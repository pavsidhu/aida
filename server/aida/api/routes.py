import json
import random
import re
from datetime import datetime

from flask import Blueprint

from aida.api.decorators import auth_required
from aida.scheduler.questions import start_question_scheduler, send_question
from aida.scheduler.matching import start_matching_scheduler, find_match
from aida.scheduler.user_analysis import start_user_analysis_scheduler, user_analysis

blueprint = Blueprint("routes", __name__, url_prefix="/")


@blueprint.route("/questions/start", methods=["GET"])
@auth_required
def start_questions(user_id):
    """Start scheduling questions to ask the user"""
    start_question_scheduler(user_id)
    return {}, 200


@blueprint.route("/user_analysis/start", methods=["GET"])
@auth_required
def start_user_analysis(user_id):
    """Start user analysis"""
    start_user_analysis_scheduler(user_id)
    return {}, 200


@blueprint.route("/matching/start", methods=["GET"])
@auth_required
def start_matching(user_id):
    """Start scheduling questions to ask the user"""
    start_matching_scheduler(user_id)
    return {}, 200


@blueprint.route("/questions/demo/<string:user_id>", methods=["GET"])
def demo_questions(user_id):
    """Start scheduling questions to ask the user"""
    send_question(user_id)
    return {}, 200


@blueprint.route("/user_analysis/demo/<string:user_id>", methods=["GET"])
def demo_user_analysis(user_id):
    """Start user analysis"""
    find_match(user_id)
    return {}, 200


@blueprint.route("/matching/demo/<string:user_id>", methods=["GET"])
def demo_matching(user_id):
    """Start scheduling questions to ask the user"""
    user_analysis(user_id)
    return {}, 200
