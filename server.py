import argparse
import json
import os
import traceback
import webbrowser
import tornado.web
import tornado.websocket
import time
from SpeechToText import SttIntegrated
#import methods

def transform(blobUrl):
	# Turn audio to text
	webbrowser.open(blobUrl)
	time.sleep(3)
	filename = blobUrl.split('/')[1]
	filepath = "/Users/wangruohan/Downloads/" + filename
	blob = open (filepath, 'rb')
	os.rename(blob.name, "speech.wav")

class HelloHandler(tornado.web.RequestHandler):

    def get(self):
        self.write('Hello from tornado')

class WebSocket(tornado.websocket.WebSocketHandler):

    def on_message(self, message):
        """Evaluates the function pointed to by json-rpc."""
        json_rpc = json.loads(message)

        try:
        	# call the method in method.py
            # result = getattr(methods, json_rpc["method"])(**json_rpc["params"])

            # Two results for Amazon and Google
            result = transform(json_rpc["params"])
            result1 = result["Amazon"]
            result2 = result["Google"]
            error = None
        except:
            # Errors are handled by enabling the `error` flag and returning a
            # stack trace. The client can do with it what it will.
            result = traceback.format_exc()
            error = 1

        # send respond to the client
        self.write_message(json.dumps({"result1": result1, "result2": result2, "error": error,
                                       "id": json_rpc["id"]},
                                      separators=(",", ":")))

    def check_origin(self, origin):
        return True


if __name__ == '__main__':
	tornado_app = tornado.web.Application([
	      ('/hello-tornado', HelloHandler),
	      ('/websocket', WebSocket),
	      ])
	server = tornado.httpserver.HTTPServer(tornado_app)
	server.listen("8080")
	print("Listening to the client......")
	tornado.ioloop.IOLoop.instance().start()
