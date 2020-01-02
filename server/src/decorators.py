from flask import request
from firebase_admin import auth


def auth_required(function):
    """Decorator to verify a user authenticated with Firebase"""

    def wrap_function(*args):
        authorization = request.headers.get("Authorization")

        if not authorization:
            return {"error": "No Authorization header provided"}, 401

        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]

        return function(user_id, *args)

    return wrap_function
