
def transform(audio):
	# Turn audio url into wav file
	# url->wav->text
	
	# file=requests.get(audio)
	print ("trying to request urllib")
	req = urllib.request.urlretrieve(audio, 'speech.wav')
	# with open("/Users/YYF/Downloads/audio.wav","wb") as ff:
	# 	ff.write(file.content)
	text = "Bacon ipsum dolor amet beef ribs flank andouille ribeye drumstick, biltong porchetta meatball pork belly swine turducken prosciutto cupim. Cow corned beef beef ham shoulder kielbasa sirloin tongue. Kielbasa rump buffalo strip steak. Flank tri-tip shank corned beef chuck meatball. Short loin tongue frankfurter, rump short ribs jerky kielbasa capicola turducken ham hock meatball. Capicola biltong buffalo meatball sirloin short loin pancetta brisket alcatra jerky frankfurter salami ham hock kielbasa cupim. Cow cupim shankle, shank brisket biltong strip steak corned beef meatloaf salami venison ribeye prosciutto.\n "
	return text