var client = {
    queue: {},

    // Connects to Python through the websocket
    connect: function () {
        var self = this;
        this.socket = new WebSocket("ws://localhost:8080/websocket");

        this.socket.onopen = function () {
            console.log("Connected to the server.");
        };

        this.socket.onmessage = function (messageEvent) {

            console.log("Received response from the server.");
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

    transform: function (blob) {
        var uuid = this.uuid();
        //this.socket.send(JSON.stringify({method: "transform", id: uuid, param: blobUrl}));
        this.socket.send(blob);
        this.queue[uuid] = "transform";
        console.log("Send msg to server get the transcirpt.")
    }
};

navigator.mediaDevices.getUserMedia({audio:true})
 .then(stream => {
    var options = {
        mimeType : 'audio/webm'
    }
   rec = new MediaRecorder(stream,options);
   rec.ondataavailable = e => {
     audioChunks.push(e.data);
     if (rec.state == "inactive"){
        let blob = new Blob(audioChunks,{type:'audio/webm'});
        blob.lastModifiedDate = new Date();
        blob.name = "speech.webm";
        blobUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = blobUrl;
        link.download = "speech.webm";
        document.body.appendChild(link);
        link.click();
        client.transform(blobUrl);
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
  //document.querySelector(".panel").style.display = "block";
  // document.getElementById("transcipt").innerHTML = "...Loading";
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

