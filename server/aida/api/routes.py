import json
import random
import re
from datetime import datetime

from flask import Blueprint, request

from aida.api.decorators import auth_required
from aida.scheduler.questions import start_question_scheduler, send_question
from aida.scheduler.matching import start_matching_scheduler, find_match
from aida.scheduler.user_analysis import (
    start_user_analysis_scheduler,
    user_analysis,
    predict_personality,
)

blueprint = Blueprint("routes", __name__, url_prefix="/")


@blueprint.route("/onboarding/complete", methods=["GET"])
@auth_required
def complete_onboarding(user_id):
    """Start scheduling questions and user analysis to ask the user"""
    start_question_scheduler(user_id)
    start_user_analysis_scheduler(user_id)
    start_matching_scheduler(user_id)
    return {}, 200


@blueprint.route("/questions/demo/<string:user_id>", methods=["GET"])
def demo_questions(user_id):
    """Send a demo question to the user"""
    send_question(user_id, is_queued=False)
    return {}, 200


@blueprint.route("/user_analysis/demo/<string:user_id>", methods=["GET"])
def demo_user_analysis(user_id):
    """Demo inferring a user's personality"""
    user_analysis(user_id, is_queued=False)
    return {}, 200


@blueprint.route("/matching/demo/<string:user_id>", methods=["GET"])
def demo_matching(user_id):
    """Demo finding a match for a user"""
    find_match(user_id, is_queued=False)
    return {}, 200


@blueprint.route("/personality-evaluation", methods=["GET"])
def demo_matching():
    """Demo finding a match for a user"""
    input = request.get_json()
    personality = predict_personality(input)

    return {"personality": personality}, 200
