
import random

from tornado.gen import coroutine
from tornado.queues import Queue


class StreamClient(object):
    MAX_SIZE = 60

    def __init__(self, steam_id):
        self.id = generate_id()
        self.stream_id = steam_id
        self.queue = Queue(StreamClient.MAX_SIZE)

    @coroutine
    def send(self, item):
        yield self.queue.put(item)

    @coroutine
    def fetch(self):
        item = yield self.queue.get()
        self.queue.task_done()
        return item

    def empty(self):
        return self.queue.qsize() == 0


def generate_id():
    return str(random.randint(10000000, 99999999))
