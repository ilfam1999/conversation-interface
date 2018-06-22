navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {
		rec = new MediaRecorder(stream);
		rec.ondataavailable = e => {
			audioChunks.push(e.data);
			if (rec.state == "inactive"){
        let blob = new Blob(audioChunks,{type:'audio/x-flac'});
        recordedAudio.src = URL.createObjectURL(blob);
        // recordedAudio.controls=true;
        // recordedAudio.autoplay=true;
        // audioDownload.href = recordedAudio.src;
        // audioDownload.download = 'sample.flac';
        // audioDownload.innerHTML = 'download';
        recordedAudio.play();
        // recordedAudio.pause();
     }
		}
	})
	.catch(e=>console.log(e));
  
var isPause = false;
startRecord.disabled = false;
pauseRecord.disabled = true;
stopRecord.disabled = true;

startRecord.onclick = e => {
  startRecord.disabled = true;
  pauseRecord.disabled = false;
  stopRecord.disabled = false;
  audioChunks = [];
  if(isPause){
    rec.resume();
  }else{
    rec.start();
  }
  isPause = false;
}

pauseRecord.onclick = e => {
  startRecord.disabled = false;
  pauseRecord.disabled = true;
  stopRecord.disabled = false;
  rec.pause();
  isPause = true;
  console.log("fine");
}

stopRecord.onclick = e => {
  startRecord.disabled = false;
  pauseRecord.disabled = true;
  stopRecord.disabled = true;
  rec.stop();
  isPause = false;
  // display the transcipt part
  document.querySelector(".panel").style.display = "block";
  document.getElementById("transcipt").innerHTML = "...Loading";
}