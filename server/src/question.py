import json
import random
import re
from datetime import datetime

from flask import Blueprint

from firebase_admin import firestore
from src.decorators import auth_required

blueprint = Blueprint("question", __name__, url_prefix="/question")

db = firestore.client()

questions_ref = db.collection("questions")
asked_questions_ref = db.collection("asked_questions")
user_ref = db.collection("users")


def parseMessage(message, user):
    tags = re.findall("{{(.*?)}}", message)

    for tag in tags:
        data = user.get(tag)

        if (data):
            message.replace("{{tag}}", data)

    return message


@blueprint.route("/", methods=["GET"])
@auth_required
def get_question(user_id):
    """Fetches a random question for Aida to ask"""

    # Fetch all the questions already been asked to the user
    asked_questions_ids = [
        doc.to_dict()["question_id"]
        for doc in asked_questions_ref.where("user_id", "==", user_id).stream()
    ]

    user = user_ref.document(user_id).stream().to_dict()
    messages_ref = user_ref.document(user_id).collection('messages')

    # Fetch all the questions
    questions = [{**doc.to_dict(), **{"id": doc.id}}
                 for doc in questions_ref.stream()]

    for question in questions:
        # Check if the question has been asked
        if question["id"] in asked_questions_ids:
            continue

        # Record the question as being asked
        asked_questions_ref.add(
            {"user_id": user_id, "question_id": question["id"]})

        # Add the question to the user's messages
        messages_ref.add({
            "content": parseMessage(question["question"], user),
            "type": 'text',
            "sender": None,
            "createdAt": datetime.now()
        })

        return {"question": question["question"]}, 200

    # Handle the unlikely case where the user has ran out of questions
    return {"error": "No questions found"}, 404
