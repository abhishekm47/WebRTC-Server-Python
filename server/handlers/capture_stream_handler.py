
import tornado.websocket

from tornado.log import app_log
from tornado.gen import coroutine
from streaming.stream_client import generate_id
from streaming.stream_subscriptions import StreamSubscriptions


class CaptureStreamHandler(tornado.websocket.WebSocketHandler):
    @coroutine
    def open(self):
        self.counter = 0
        self.stream_id = generate_id()
        yield self.write_message(self.stream_id)
        app_log.debug('Stream WebSocket opened: ' + self.stream_id)
        StreamSubscriptions[self.stream_id] = []

    def on_close(self):
        app_log.debug('Stream WebSocket closed: ' + self.stream_id)
        app_log.debug('Captured {0} messages from stream {1}'
                      .format(self.counter, self.stream_id))
        del StreamSubscriptions[self.stream_id]

    @coroutine
    def on_message(self, message):
        app_log.debug('Message recieved: ' + str(len(message)))
        self.counter += 1
        for client in StreamSubscriptions[self.stream_id]:
            app_log.debug('Dispatching message to client: ' + client.id)
            yield client.send(message)
