import json
import random
import re
import sys
from datetime import datetime, timedelta

import firebase_admin
import numpy as np
import torch
from dotenv import load_dotenv
from firebase_admin import firestore

from aida.scheduler import scheduler
from aida.user_analysis.model.LstmModel import LstmModel
from aida.user_analysis.model.tokenizer import tokenize

ANALYSE_USER_HOURS = 24
MIN_MESSAGES_REQUIRED = 2

TRAITS = [
    "extroversion",
    "neuroticism",
    "agreeableness",
    "conscientiousness",
    "openness",
]

models = {}

for trait in TRAITS:
    model = LstmModel()
    model.load_state_dict(torch.load(f"aida/user_analysis/trained/{trait}.pt"))
    model.to("cuda:0" if torch.cuda.is_available() else "cpu")
    model.eval()

    models[trait] = model


def start_user_analysis_scheduler(user_id):
    """Schedules analysing a user"""
    scheduler.enqueue_in(timedelta(hours=ANALYSE_USER_HOURS), user_analysis, user_id)


def user_analysis(user_id, is_queued=True):
    """Analyses a user's personality using chat data"""

    if is_queued:
        load_dotenv()
        firebase_admin.initialize_app()

    db = firestore.client()

    # Get the user's reference from Firestore
    user_ref = db.collection("users").document(user_id)

    # Get a user's messages through interacting with Aida
    messages = get_messages(user_ref)

    # Calculate the user's progress until they're ready for personality analysis
    progress = calculate_user_progress(messages)
    user_ref.update({"progress": progress})

    if progress != 1.0:
        return

    # Predict the user's personality
    personality = predict_personality(messages)

    # Save the user's analysed personality
    user_ref.update({"personality": personality})

    # Schedule the next analysis
    if is_queued:
        start_user_analysis_scheduler(user_id)


def predict_personality(texts):
    """Predict the user's personality"""
    personality = {}

    tokens = tokenize(texts)

    with torch.no_grad():
        for trait, model in models.items():
            output = model(tokens)

            # Calculate average output from the model and round to 0 or 1
            personality[trait] = output.squeeze(1).mean().round().item()

    return personality


hashtag_pattern = r"(?:^|\s){1}(#[A-Za-z0-9_]+)"
url_pattern = r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
mention_pattern = r"(?:^|\s){1}(@[A-Za-z0-9_]+)"


def get_messages(user_ref):
    """Fetches all messages sent by the user to Aida"""
    messages_ref = user_ref.collection("messages")

    messages = []

    for doc in messages_ref.stream():
        message = doc.to_dict()

        if message["sender"] and message["type"] == "text":
            messages.append(message["content"])

    return messages


def calculate_user_progress(messages):
    """Calculate percentage of data available until ready for personality analysis"""

    number_of_messages = len(messages)
    progress = number_of_messages / MIN_MESSAGES_REQUIRED

    return min(progress, 1.0)
