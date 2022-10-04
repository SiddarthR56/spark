var divSelectRoom = document.getElementById("selectRoom");
var divConsultingRoom = document.getElementById("consultingRoom");
var divConsultingControls = document.getElementById("consultingControls");
var inputRoomNumber = document.getElementById("roomNumber");
var btnGoRoom = document.getElementById("goRoom");
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");
var toggleButton = document.getElementById('toggle-cam');
var toggleMic = document.getElementById('toggle-mic');

var roomNumber;
var localStream;
var remoteStream;
var rtcPeerConnection;
var iceServers = {
    'iceServers': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
}
var streamConstraints = { audio: true, video: true };
var isCaller;

var socket = io();

btnGoRoom.onclick = function () {
    if (inputRoomNumber.value === '') {
        alert("Please type a room number")
    } else {
        roomNumber = inputRoomNumber.value;
        console.log("Room number " + roomNumber + " gathered");
        console.log('connect socket id:' + `${socket.id}`);
        socket.emit("create or join", roomNumber);
        // divSelectRoom.style = "display: none;";
        divConsultingRoom.style = "display: block;";
        divConsultingControls.style = "display: block;";
    }
};

socket.on('connect', function() {
    alert("Connection acheived.");
    console.log(socket.id);
});

socket.on('created', function (room) {
    alert("You are the first one in the room. Room created.")
    navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
        localStream = stream;
        localVideo.srcObject = stream;
        isCaller = true;
    }).catch(function (err) {
        console.log('An error ocurred when accessing media devices', err);
    });
});

toggleButton.addEventListener('click', () =>{
    const videoTrack = localStream.getTracks().find(track => track.kind === 'video');
    if(videoTrack.enabled){
        videoTrack.enabled = false;
        toggleButton.innerHTML = "Show cam"
    } else{
        videoTrack.enabled = true;
        toggleButton.innerHTML = "Hide cam"
    }
});

toggleMic.addEventListener('click', () =>{
    const audioTrack = localStream.getTracks().find(track => track.kind === 'audio');
    if(audioTrack.enabled){
        audioTrack.enabled = false;
        toggleMic.innerHTML = "Unmute microphone"
    } else{
        audioTrack.enabled = true;
        toggleMic.innerHTML = "Mute microphone"
    }
});

socket.on('joined', function (room) {
   alert("You are joining an existing room. Room joined.")
    navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
        localStream = stream;
        localVideo.srcObject = stream;
        socket.emit('ready', roomNumber);
    }).catch(function (err) {
        console.log('An error ocurred when accessing media devices', err);
    });
});

socket.on('candidate', function (event) {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });
    rtcPeerConnection.addIceCandidate(candidate);
});

socket.on('ready', function () {
    if (isCaller) {
        alert("Attempting to access video log of joined user.")
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddStream;
        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
        rtcPeerConnection.createOffer()
            .then(sessionDescription => {
                rtcPeerConnection.setLocalDescription(sessionDescription);
                socket.emit('offer', {
                    type: 'offer',
                    sdp: sessionDescription,
                    room: roomNumber
                });
            })
            .catch(error => {
                console.log(error)
            })
    }
});

socket.on('offer', function (event) {
    if (!isCaller) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddStream;
        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
        rtcPeerConnection.createAnswer()
            .then(sessionDescription => {
                rtcPeerConnection.setLocalDescription(sessionDescription);
                socket.emit('answer', {
                    type: 'answer',
                    sdp: sessionDescription,
                    room: roomNumber
                });
            })
            .catch(error => {
                console.log(error)
            })
    }
});

socket.on('answer', function (event) {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

socket.on( 'disconnect', function () {
    alert( 'disconnected to server' );
});

socket.on('full', function(){
    alert('Room is full. You can not enter this room right now.');
});

function onIceCandidate(event) {
    console.log(event)
    if (event.candidate) {
        console.log('sending ice candidate');
        socket.emit('candidate', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: roomNumber
        })
    }
}

function onAddStream(event) {
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.stream;
}
