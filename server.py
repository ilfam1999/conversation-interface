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
    # webbrowser.open(blobUrl)
    # time.sleep(3)
    # filename = blobUrl.split('/')[1]
    # filepath = "/Users/wangruohan/Downloads/" + filename
    # blob = open (filepath, 'rb')
    # os.rename(blob.name, "speech.wav")
    time.sleep(3)
    filepath = "/Users/wangruohan/Downloads/speech.webm"
    audio_file = open(filepath, 'rb')
    os.rename(audio_file.name, "speech.webm")
    audio_file.close()

    t2s = SttIntegrated("speech.webm")
    t2s.main()
    file_google = open("speech.Google.txt", "r")
    google_text = file_google.read()
    file_google.close()
    file_amazon = open("speech.AWS.txt", "r") 
    amazon_text = file_amazon.read()
    result = {"Amazon": amazon_text, "Google": google_text}
    return result

class HelloHandler(tornado.web.RequestHandler):

    def get(self):
        self.write('Hello from tornado')

class WebSocket(tornado.websocket.WebSocketHandler):

    def on_message(self, message):
        """Evaluates the function pointed to by json-rpc."""
        json_rpc = json.loads(message)

        print("Receive from client:")
        print(message)
        try:
        	# call the method in method.py
            # result = getattr(methods, json_rpc["method"])(**json_rpc["params"])

            # Two results for Amazon and Google
            result = transform(json_rpc["param"])
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
	print("Listening to the client......")
	tornado.ioloop.IOLoop.instance().start()
