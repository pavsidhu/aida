import logging

from flask import Flask, request

import firebase_admin
from dotenv import load_dotenv

load_dotenv()
firebase_admin.initialize_app()

app = Flask(__name__)
app.logger.setLevel(logging.ERROR)

from src.api.routes.question

app.register_blueprint(question)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
