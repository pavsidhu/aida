import logging

import firebase_admin
from dotenv import load_dotenv
from flask import Flask, request

load_dotenv()
firebase_admin.initialize_app()

app = Flask(__name__)
app.logger.setLevel(logging.ERROR)

from src.questions import blueprint as questions

app.register_blueprint(questions)

app.run()
