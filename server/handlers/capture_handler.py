
import tornado.web

from tornado.options import options


class CaptureHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('capture.html',
                    address=options.address,
                    public_address=options.public_address)
