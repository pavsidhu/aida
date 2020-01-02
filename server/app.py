import logging

from flask import Flask, request

import firebase_admin
from dotenv import load_dotenv

load_dotenv()
firebase_admin.initialize_app()

app = Flask(__name__)
app.logger.setLevel(logging.ERROR)

from src.question import blueprint as question

app.register_blueprint(question)

app.run(host='0.0.0.0')
