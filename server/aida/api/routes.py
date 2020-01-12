import json
import random
import re
from datetime import datetime

from flask import Blueprint

from aida.api.decorators import auth_required
from aida.scheduler.questions import start_question_scheduler

blueprint = Blueprint("routes", __name__, url_prefix="/")


@blueprint.route("/questions/start", methods=["GET"])
@auth_required
def start_questions(user_id):
    """Start scheduling questions to ask the user"""
    start_question_scheduler(user_id)
    return {}, 200


@blueprint.route("/matches/start", methods=["GET"])
@auth_required
def start_matches(user_id):
    """Start scheduling questions to ask the user"""
    pass
