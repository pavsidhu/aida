import random
from datetime import datetime, timedelta

import firebase_admin
from dotenv import load_dotenv
import numpy as np
import pygeohash
from firebase_admin import firestore, messaging
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from aida.scheduler import scheduler

MIN_MATCH_TIME = 30
MATCH_TIME_RANGE = 300


def start_matching_scheduler(user_id):
    """Schedules finding a match for a user"""

    minutes = random.randint(MIN_MATCH_TIME, MIN_MATCH_TIME + MATCH_TIME_RANGE)
    scheduler.enqueue_in(timedelta(minutes=minutes), find_match, user_id)


def find_match(user_id, is_queued=True):
    """Finds a match for a user"""

    if is_queued:
        load_dotenv()
        firebase_admin.initialize_app()

    db = firestore.client()

    # Get user's personality
    user = db.collection("users").document(user_id).get().to_dict()
    user["id"] = user_id

    # If a user does not have enough data, don't find matches
    if user["progress"] < 1.0:
        return

    # Find potential matches near the user
    nearby_users = find_nearby_unmatched_users(db, user)

    # There are no matches available to the user
    if not nearby_users:
        return

    # Select a match for the user
    match = select_match(user, nearby_users)

    # Setup the match
    create_match(db, user, match)

    # Schedule the next match
    if is_queued:
        start_matching_scheduler(user_id)


def find_nearby_unmatched_users(db, user):
    """Finds nearby non-matched users based on the user's location and gender preference"""

    lowerGeohash, upperGeohash = calculate_match_range(user["location"])
    preference = "Male" if user["gender"] == "Female" else "Female"

    nearby_users = [
        {**doc.to_dict(), **{"id": doc.id}}
        for doc in db.collection("users")
        .where("location", ">=", lowerGeohash)
        .where("location", "<=", upperGeohash)
        .where("gender", "==", preference)
        .stream()
    ]

    # Remove users that the user has already matched with
    match_user_ids = get_match_user_ids(db, user["id"])
    unmatched_users = [
        nearby_user
        for nearby_user in nearby_users
        if nearby_user["id"] not in match_user_ids
    ]

    return unmatched_users


def select_match(user, nearby_users):
    ranked_users = sorted(
        nearby_users,
        key=lambda nearby_user: calculate_personality_similarity(
            user["personality"], nearby_user["personality"]
        ),
    )

    # Return the highest ranked individual
    return ranked_users[0]


DEG_LATITUDE_PER_KM = 0.008983152771
DEG_LONGITUDE_PER_KM = 0.008998231173


def create_match(db, user, matching_user):
    """Does all the setup for creating a new match"""

    # Create a new match
    _, match = db.collection("matches").add(
        {
            "users": [
                db.collection("users").document(user["id"]),
                db.collection("users").document(matching_user["id"]),
            ]
        }
    )

    message = {
        "content": db.collection("matches").document(match.id),
        "type": "match",
        "sender": None,
        "createdAt": datetime.now(),
    }

    # Add message to conversations with Aida
    db.collection("users").document(user["id"]).collection("messages").add(message)
    db.collection("users").document(matching_user["id"]).collection("messages").add(
        message
    )

    tokens = []

    if user.get("notification_token"):
        tokens.append(user["notification_token"])
    
    if matching_user.get("notification_token"):
        tokens.append(matching_user["notification_token"])

    if not tokens:
        return

    # Setup notifications for messages between users
    topic = f"/topics/match-{match.id}"
    messaging.subscribe_to_topic(
        tokens=[tokens],
        topic=topic,
    )

    # Send a match notification to both users
    messaging.send(
        messaging.Message(
            notification=messaging.Notification(
                title="Aida", body="I've found you a match! 😍"
            ),
            topic=topic,
        )
    )


def calculate_match_range(geohash, radius=10):
    """Calculates lower and upper geohash boundaries for a given geohash and range in kilometers"""

    # Decode geohash
    latitude, longitude = pygeohash.decode(geohash)

    # Calculate lower boundaries
    lower_latitude = latitude - DEG_LATITUDE_PER_KM * radius
    lower_longitude = longitude - DEG_LONGITUDE_PER_KM * radius

    # Calculate upper boundaries
    upper_latitude = latitude + DEG_LATITUDE_PER_KM * radius
    upper_longitude = longitude + DEG_LONGITUDE_PER_KM * radius

    # Encode boundaries
    lower = pygeohash.encode(lower_latitude, lower_longitude)
    upper = pygeohash.encode(upper_latitude, upper_longitude)

    return lower, upper


def calculate_personality_similarity(personality_one, personality_two):
    """Compares two personalities using cosine similarity"""

    # Vectorize personality
    personality_vectorizer = DictVectorizer()
    vector = personality_vectorizer.fit_transform([personality_one, personality_two])

    # Calculate cosine similarity
    similarity_vector = cosine_similarity(vector[0], vector[1])

    # Return the average cosine similarity for all traits
    return np.mean(similarity_vector)


def get_match_user_ids(db, user_id):
    """Returns a list of user ids that a user has matched with"""

    user_ref = db.collection("users").document(user_id)

    matches = (
        db.collection("matches").where("users", "array_contains", user_ref).stream()
    )

    ids = []

    for doc in matches:
        match = doc.to_dict()

        for match_user_ref in match["users"]:
            if match_user_ref != user_ref:
                ids.append(match_user_ref.id)

    return ids
