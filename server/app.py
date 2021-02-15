
import signal
import tornado
import tornado.ioloop
import tornado.web
import app_config

from tornado.log import app_log
from tornado.options import options
from app_settings import settings
from handlers.home_handler import HomeHandler
from handlers.capture_handler import CaptureHandler
from handlers.capture_stream_handler import CaptureStreamHandler
from handlers.cast_handler import CastHandler
from handlers.cast_stream_handler import CastStreamHandler


application = tornado.web.Application([
    (r"/scripts/(.*)", tornado.web.StaticFileHandler, {'path': 'scripts'}),
    (r"/", HomeHandler),
    (r"/capture", CaptureHandler),
    (r"/capture-stream", CaptureStreamHandler),
    (r"/cast/(.*)", CastHandler),
    (r"/cast-stream/(.*)", CastStreamHandler)
], **settings)

if __name__ == "__main__":
    def stop_server(signum, frame):
        app_log.info('Stopping server')
        loop.stop()

    signal.signal(signal.SIGINT, stop_server)

    app_log.setLevel(options.loglevel)
    app_log.info('Starting Tornado {0} server'.format(tornado.version))
    app_log.info('Press Ctrl+C to stop')

    application.listen(options.port)
    loop = tornado.ioloop.IOLoop.current()
    loop.start()
