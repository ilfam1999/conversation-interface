import webbrowser
import os
import time

url="blob:null/d70751c7-c91e-49ce-8dc5-fb45582026b0"
webbrowser.open(url)
time.sleep(3)
filename = url.split('/')[1]
filepath = "/Users/wangruohan/Downloads/" + filename
blob = open (filepath, 'rb')
os.rename(blob.name, "speech.wav")
# f=open('/Users/wangruohan/Downloads/text.txt','rb')
# os.rename(f.name, "new.txt")