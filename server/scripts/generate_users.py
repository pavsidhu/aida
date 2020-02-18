import json

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import firestore

load_dotenv()
firebase_admin.initialize_app()
db = firestore.client()

# Upload users to firestore
with open("data/users.json", "r") as file:
    batch = db.batch()
    users = json.load(file)

    for user in users["users"]:
        user_ref = db.collection("users").document()
        batch.create(user_ref, user)

    batch.commit()
