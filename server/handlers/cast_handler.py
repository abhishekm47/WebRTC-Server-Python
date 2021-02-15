
import tornado.web

from tornado.options import options


class CastHandler(tornado.web.RequestHandler):
    def get(self, id):
        self.render('cast.html',
                    stream_id=id,
                    public_address=options.public_address)
