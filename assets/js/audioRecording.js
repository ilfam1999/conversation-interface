// (function(n){var a=Math.min,s=Math.max;var e=function(n,a,e){var s=e.length;for(var t=0;t<s;++t)n.setUint8(a+t,e.charCodeAt(t))};var t=function(t,e){this.sampleRate=t;this.numChannels=e;this.numSamples=0;this.dataViews=[]};t.prototype.encode=function(r){var t=r[0].length,u=this.numChannels,h=new DataView(new ArrayBuffer(t*u*2)),o=0;for(var e=0;e<t;++e)for(var n=0;n<u;++n){var i=r[n][e]*32767;h.setInt16(o,i<0?s(i,-32768):a(i,32767),true);o+=2}this.dataViews.push(h);this.numSamples+=t};t.prototype.finish=function(s){var n=this.numChannels*this.numSamples*2,t=new DataView(new ArrayBuffer(44));e(t,0,"RIFF");t.setUint32(4,36+n,true);e(t,8,"WAVE");e(t,12,"fmt ");t.setUint32(16,16,true);t.setUint16(20,1,true);t.setUint16(22,this.numChannels,true);t.setUint32(24,this.sampleRate,true);t.setUint32(28,this.sampleRate*4,true);t.setUint16(32,this.numChannels*2,true);t.setUint16(34,16,true);e(t,36,"data");t.setUint32(40,n,true);this.dataViews.unshift(t);var a=new Blob(this.dataViews,{type:"audio/wav"});this.cleanup();return a};t.prototype.cancel=t.prototype.cleanup=function(){delete this.dataViews};n.WavAudioEncoder=t})(self);

var client = {
    queue: {},

    // Connects to Python through the websocket
    connect: function () {
        var self = this;
        this.socket = new WebSocket("ws://localhost:8080/websocket");

        this.socket.onopen = function () {
            console.log("Connected!");
        };

        this.socket.onmessage = function (messageEvent) {

            console.log("Received msg from the server.");
            var router, current, updated, jsonRpc;

            jsonRpc = JSON.parse(messageEvent.data);
            router = self.queue[jsonRpc.id];
            delete self.queue[jsonRpc.id];
            self.result = jsonRpc.result;

            // If there's an error, display it in an alert window
            if (jsonRpc.error) {
                alert(jsonRpc.result);

            // If the response is from "transform", show the text
            } else if (router === "transform") {
                $("#nav-amazon").html(jsonRpc.result["Amazon"]);
                $("#nav-google").html(jsonRpc.result["Google"]);

            // If the response is from anything else, it's currently unsupported
            } else {
                alert("Unsupported function: " + router);
            }
        };
    },

    uuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },

    transform: function (blobUrl) {
        var uuid = this.uuid();
        this.socket.send(JSON.stringify({method: "transform", id: uuid, params: blobUrl}));
        this.queue[uuid] = "transform";
    }
};

function getBuffers(event) {
  var buffers = [];
  // buffers[0] = event.inputBuffer.getChannelData(0);
  return buffers;
}

navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {
    var options = {
        mimeType : 'audio/webm'
    }
		rec = new MediaRecorder(stream,options);
		rec.ondataavailable = e => {
			audioChunks.push(e.data);
      // encoder = new WavAudioEncoder(44100, 1);
      // encoder.encode(getBuffers(e));
      // blob = encoder.finish([mimeType])
			if (rec.state == "inactive"){
        let blob = new Blob(audioChunks,{type:'audio/webm'});
        blob.lastModifiedDate = new Date();
        blob.name = "audio/webm";
        blobUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = blobUrl;
        link.download = "audio/webm";
        document.body.appendChild(link);
        // link.click();
        client.transform(blobUrl);
        //var formData = new FormData();
        //formData.append('audio', blob, 'speech.wav');
        // $.ajax({
        //     type: 'POST',
        //     url: 'http://localhost/python/server.py',
        //     data: formData,
        //     processData: false,  // prevent jQuery from converting the data
        //     contentType: false,  // prevent jQuery from overriding content type
        //     success: function() {
        //         alert("sent");
        //     }
        // });
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
  console.log("clicked stop button");
  // display the transcipt part
  //document.querySelector(".panel").style.display = "block";
  // document.getElementById("transcipt").innerHTML = "...Loading";
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

// ----------------------------------------------------------------
$("#nav-amazon-tab").on("click", function(){
  $(this).addClass('active');
  $("#nav-google-tab").removeClass('active');
  $("#nav-ibm-tab").removeClass('active');
  $("#nav-amazon").addClass('show');
  $("#nav-google").removeClass('show');
  $("#nav-ibm").removeClass('show');
  $("#nav-amazon").addClass('active');
  $("#nav-google").removeClass('active');
  $("#nav-ibm").removeClass('active');

})

$("#nav-google-tab").on("click", function(){
  $(this).addClass('active');
  $("#nav-amazon-tab").removeClass('active');
  $("#nav-ibm-tab").removeClass('active');
  $("#nav-google").addClass('show');
  $("#nav-amazon").removeClass('show');
  $("#nav-ibm").removeClass('show');
  $("#nav-google").addClass('active');
  $("#nav-amazon").removeClass('active');
  $("#nav-ibm").removeClass('active');
})

$("#nav-ibm-tab").on("click", function(){
  $(this).addClass('active');
  $("#nav-amazon-tab").removeClass('active');
  $("#nav-google-tab").removeClass('active');
  $("#nav-amazon").removeClass('active');
  $("#nav-google").removeClass('active');
  $("#nav-ibm").addClass('active');
  $("#nav-amazon").removeClass('show');
  $("#nav-google").removeClass('show');
  $("#nav-ibm").addClass('show');
})

