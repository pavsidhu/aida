import json

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import firestore

load_dotenv()
firebase_admin.initialize_app()
db = firestore.client()

# Upload questions to firestore
with open("data/questions.json", "r") as file:
    batch = db.batch()
    questions = json.load(file)

    for question in questions["questions"]:
        question_ref = db.collection("questions").document()
        batch.create(question_ref, question)

    batch.commit()
