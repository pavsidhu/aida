import json
import random
import re
from datetime import datetime

from twitter_scraper import get_tweets


def get_user_tweets(user_id, username, pages=25):
    """Scrapes tweets posted by a user and stores them in Firestore"""

    tweets = []

    for tweet in get_tweets(username, pages=pages):
        if not tweet["isRetweet"]:
            tweets.append(tweet)

    return tweets
