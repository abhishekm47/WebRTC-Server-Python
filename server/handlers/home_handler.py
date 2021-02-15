
import tornado.web

from tornado.options import options
from streaming.stream_subscriptions import StreamSubscriptions


class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('home.html',
                    public_address=options.public_address,
                    streams=StreamSubscriptions)
