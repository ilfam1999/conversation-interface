import argparse
import json
import os
import traceback
import webbrowser
import tornado.web
import tornado.websocket
import time

def transform(blobUrl):
    # Turn audio to text
    webbrowser.open(blobUrl)
    time.sleep(3)
    filename = blobUrl.split('/')[1]
    filepath = "/Users/wangruohan/Downloads/" + filename
    blob = open (filepath, 'rb')
    os.rename(blob.name, "speech.wav")
    # text = ""
    # text = "Bacon ipsum dolor amet beef ribs flank andouille ribeye drumstick, biltong porchetta meatball pork belly swine turducken prosciutto cupim. Cow corned beef beef ham shoulder kielbasa sirloin tongue. Kielbasa rump buffalo strip steak. Flank tri-tip shank corned beef chuck meatball. Short loin tongue frankfurter, rump short ribs jerky kielbasa capicola turducken ham hock meatball. Capicola biltong buffalo meatball sirloin short loin pancetta brisket alcatra jerky frankfurter salami ham hock kielbasa cupim. Cow cupim shankle, shank brisket biltong strip steak corned beef meatloaf salami venison ribeye prosciutto.\n "
    return filepath

class HelloHandler(tornado.web.RequestHandler):

    def get(self):
        self.write('Hello from tornado')

class WebSocket(tornado.websocket.WebSocketHandler):

    def on_message(self, message):
        """Evaluates the function pointed to by json-rpc."""
        json_rpc = json.loads(message)

        try:
        	# call the method in method.py
            result = getattr(methods, json_rpc["method"])(**json_rpc["params"])
            error = None
        except:
            # Errors are handled by enabling the `error` flag and returning a
            # stack trace. The client can do with it what it will.
            result = traceback.format_exc()
            error = 1

        # send respond to the client
        self.write_message(json.dumps({"result": result, "error": error,
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
	tornado.ioloop.IOLoop.instance().start()