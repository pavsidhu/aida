from datetime import datetime, timedelta

import firebase_admin
import numpy as np
import pygeohash
from firebase_admin import firestore, messaging
from sklearn.feature_extraction import DictVectorizer
from sklearn.metrics.pairwise import cosine_similarity

MIN_MATCH_TIME = 30
MATCH_TIME_RANGE = 300


def start_matching_scheduler(user_id):
    """Schedules finding a match for a user"""

    find_match(user_id)
    # minutes = random.randint(MIN_MATCH_TIME, MIN_MATCH_TIME + MATCH_TIME_RANGE)
    # scheduler.enqueue_in(timedelta(minutes=minutes), find_match, user_id)


db = firestore.client()


def find_match(user_id):
    """Finds a match for a user"""

    # load_dotenv()
    # firebase_admin.initialize_app()

    # Get user's personality
    user = db.collection("users").document(user_id).get().to_dict()
    user["id"] = user_id

    # Find potential matches near the user
    nearby_users = find_nearby_unmatched_users(user)

    # There are no matches available to the user
    if not nearby_users:
        return

    # Select a match for the user
    match = select_match(user, nearby_users)

    # Setup the match
    create_match(user, match)


def find_nearby_unmatched_users(user):
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
    match_user_ids = get_match_user_ids(user["id"])
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

    # TODO: Use random value from normal distribution to select a match
    return ranked_users[0]


DEG_LATITUDE_PER_KM = 0.008983152771
DEG_LONGITUDE_PER_KM = 0.008998231173


def create_match(user, matching_user):
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

    # Setup notifications for messages between users
    topic = f"/topics/match-{match.id}"
    messaging.subscribe_to_topic(
        tokens=[user["notification_token"], matching_user["notification_token"]],
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


def get_match_user_ids(user_id):
    """Returns a list of user ids that a user has matched with"""

    matches = (
        db.collection("matches").where("users", "array_contains", [user_id]).stream()
    )
    ids = []

    for doc in matches:
        match = doc.to_dict()

        for user in match["users"]:
            if user["id"] != user_id:
                ids.append(user["id"])

    return ids
