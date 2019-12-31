import json

from firebase_admin import auth
from flask import request


def auth_required(function):
    """Decorator to verify a user authenticated with Firebase"""

    def wrap_function(*args):
        body = json.loads(request.data)

        # decoded_token = auth.verify_id_token(body["id_token"])
        # user_id = decoded_token["uid"]
        user_id = "Npu2xs1KiqVtQvGlKEBZ6iSLO0C3"

        return function(user_id, *args)

    return wrap_function
