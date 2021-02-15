
import tornado.websocket

from tornado.log import app_log
from tornado.gen import coroutine, sleep
from streaming.stream_client import StreamClient
from streaming.stream_subscriptions import StreamSubscriptions


class CastStreamHandler(tornado.websocket.WebSocketHandler):
    def open(self, id):
        if id in StreamSubscriptions:
            app_log.debug('Stream client WebSocket opened')
            self.client = StreamClient(id)
            StreamSubscriptions[id].append(self.client)

    def on_close(self):
        app_log.debug('Stream client WebSocket closed: ' + self.client.id)
        if self.client.stream_id in StreamSubscriptions:
            StreamSubscriptions[self.client.stream_id].remove(self.client)
        self.client = None

    @coroutine
    def on_message(self, message):
        app_log.debug('Client ready {0}, feeding stream: {1}'
                      .format(self.client.id, self.client.stream_id))
        while self.client:
            message = yield self.client.fetch()
            if message:
                yield self.write_message(message)
            else:
                yield sleep(0.1)
