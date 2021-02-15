
import tornado.options

tornado.options.define('port')
tornado.options.define('loglevel')
tornado.options.define('address')
tornado.options.define('public_address')
tornado.options.parse_config_file("server.conf")
