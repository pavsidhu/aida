from redis import Redis
from rq_scheduler import Scheduler

redis = Redis()
scheduler = Scheduler(connection=redis)
