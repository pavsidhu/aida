from functools import wraps

from firebase_admin import auth
from flask import request


def auth_required(function):
    """Decorator to verify a user authenticated with Firebase"""

    @wraps(function)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get("Authorization")

        if not authorization:
            return {"error": "No Authorization header provided"}, 401

        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]

        return function(user_id, *args, **kwargs)

    return wrapper
