import logging

from flask import Flask, request
from flask_cors import CORS

import firebase_admin
from dotenv import load_dotenv

load_dotenv()
firebase_admin.initialize_app()

app = Flask(__name__)
app.logger.setLevel(logging.ERROR)
CORS(app)

from aida.api.routes import blueprint as routes

app.register_blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
