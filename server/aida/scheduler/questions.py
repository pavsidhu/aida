import re
import random
from datetime import datetime, timedelta

import firebase_admin
from firebase_admin import firestore, messaging
from redis import Redis
from rq import Queue
from rq_scheduler import Scheduler

from dotenv import load_dotenv

redis = Redis()
scheduler = Scheduler(connection=redis)

MIN_QUESTION_TIME = 30
QUESTION_TIME_RANGE = 300


def start_question_scheduler(user_id):
    """Schedules sending a question to the user"""
    minutes = random.randint(MIN_QUESTION_TIME, MIN_QUESTION_TIME + QUESTION_TIME_RANGE)
    scheduler.enqueue_in(timedelta(minutes=minutes), send_question, user_id)


def send_question(user_id):
    load_dotenv()
    firebase_admin.initialize_app()
    db = firestore.client()

    # Get a question from Firestore
    question = fetch_random_question(db, user_id)

    if question:
        # Get user
        user = db.collection("users").document(user_id).get().to_dict()

        # Add question to messages with Aida
        add_question_to_messages(db, user, user_id, question)

        # Send a notification to the user's device
        send_notification(db, user, question)

        # Schedule the next question
        start_question_scheduler(user_id)


def fetch_random_question(db, user_id):
    """Fetches a random question for Aida to ask"""

    # Fetch all the questions already been asked to the user
    asked_questions_ids = [
        doc.to_dict()["question_id"]
        for doc in db.collection("asked_questions")
        .where("user_id", "==", user_id)
        .stream()
    ]

    # Fetch all the questions
    questions = [
        {**doc.to_dict(), **{"id": doc.id}}
        for doc in db.collection("questions").stream()
    ]

    for question in questions:
        # Check if the question has been asked
        if question["id"] in asked_questions_ids:
            continue

        # Record the question as being asked
        db.collection("asked_questions").add(
            {"user_id": user_id, "question_id": question["id"]}
        )

        return question["question"]

    # Handle the unlikely case where the user has ran out of questions
    return None


def add_question_to_messages(db, user, user_id, question):
    """Add the question to the user's messages"""
    db.collection("users").document(user_id).collection("messages").add(
        {
            "content": parseMessage(question, user),
            "type": "text",
            "sender": None,
            "createdAt": datetime.now(),
        }
    )


def send_notification(db, user, question):
    """Sends a notification to the user's device"""
    messaging.send(
        messaging.Message(
            notification=messaging.Notification(title="Aida", body=question),
            token=user["notificationToken"],
        )
    )


def parseMessage(message, user):
    """Replace entities in a message"""
    print(message, user.get("name"))
    tags = re.findall("{{(.*?)}}", message)

    for tag in tags:
        data = user.get(tag)

        if data:
            message = message.replace("{{" + tag + "}}", data)

    return message
