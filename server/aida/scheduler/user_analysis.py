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
from twitter_scraper import get_tweets

from aida.scheduler import scheduler
from aida.user_analysis.model.LstmModel import LstmModel
from aida.user_analysis.model.tokenizer import tokenize

ANALYSE_USER_HOURS = 24
MIN_TEXTS_REQUIRED = 40

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
    model.load_state_dict(
        torch.load(
            f"aida/user_analysis/model/trained/{trait}.pth", map_location="cuda:0"
        )
    )
    model.eval()

    models[trait] = model


def start_user_analysis_scheduler(user_id):
    """Schedules analysing a user"""
    scheduler.enqueue_in(timedelta(hours=ANALYSE_USER_HOURS), user_analysis, user_id)


def user_analysis(user_id, is_queued=True):
    """Analyses a user's personality using chat data and tweets"""

    if is_queued:
        load_dotenv()
        firebase_admin.initialize_app()

    db = firestore.client()

    # Get the user's reference from Firestore
    user_ref = db.collection("users").document(user_id)

    # Get a user's tweets from their Twitter profile
    tweets = get_user_tweets(user_ref)

    # Get a user's messages through interacting with Aida
    messages = get_messages(user_ref)

    # Calculate the user's progress until they're ready for personality analysis
    progress = calculate_user_progress(tweets, messages)

    if progress != 1.0:
        user_ref.update({"progress": progress})
        return

    # Predict the user's personality
    personality = predict_personality(tweets + messages)

    # Save the user's analysed personality
    user_ref.update({"personality": personality})

    # Schedule the next analysis
    if is_queued:
        start_user_analysis_scheduler(user_id)


def predict_personality(texts):
    """Predict the user's personality"""
    personality = {}

    tokens = tokenize(texts)

    for trait, model in models.items():
        output = model(tokens)

        # Calculate average output from the model and round to 0 or 1
        personality[trait] = output.squeeze(1).mean().round().item()

    return personality


hashtag_pattern = r"(?:^|\s){1}(#[A-Za-z0-9_]+)"
url_pattern = r"https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
mention_pattern = r"(?:^|\s){1}(@[A-Za-z0-9_]+)"


def get_user_tweets(user_ref, pages=25):
    """Scrapes tweets posted by a user and stores them in Firestore"""
    user = user_ref.get().to_dict()
    username = user["twitter"]["username"]

    tweets = []

    for tweet in get_tweets(username, pages=pages):
        if tweet.get("isRetweet") != True:
            text = tweet["text"]
            text = text.lower()

            # Remove hashtags
            text = re.sub(hashtag_pattern, "", text)

            # Remove URLs
            text = re.sub(url_pattern, "", text)

            # Remove mentions
            text = re.sub(mention_pattern, "", text)

            tweets.append(text)

    return tweets


def get_messages(user_ref):
    """Fetches all messages sent by the user to Aida"""
    messages_ref = user_ref.collection("messages")

    messages = []

    for doc in messages_ref.stream():
        message = doc.to_dict()

        if message["sender"] and message["type"] == "text":
            messages.append(message["content"])

    return messages


def calculate_user_progress(tweets, messages):
    """Calculate percentage of data available until ready for personality analysis"""

    number_of_texts = max(len(tweets), 20) + len(messages)
    return number_of_texts / MIN_TEXTS_REQUIRED
