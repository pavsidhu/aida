
import firebase_admin
from firebase_admin import firestore
from flask import Flask, request

app = Flask(__name__)

firebase_admin.initialize_app()
db = firestore.client()


@app.route("/status")
def status():
    return {"status": "running"}, 200
