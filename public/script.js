const socket = io.connect('/');
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  config: { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] },
  path: '/peerjs',
  host: '/',
  port: '3001',
});

let myVideoStream;
const myVideo = document.createElement('video');

myVideo.muted = true;
const peers = {};
var currentPeer = null;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.7,
    });
    hands.onResults(onGestureAction);

    const camera = new Camera(myVideo, {
      onFrame: async () => {
        await hands.send({ image: myVideo });
      },
      width: 640,
      height: 320,
    });
    camera.start();
    myPeer.on('call', (call) => {
      call.answer(stream);
      currentPeer = call;
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      console.log('user Joined');
      connectToNewUser(userId, stream);
    });
    // input value
    let text = $('input');
    // when press enter send message
    $('html').keydown(function (e) {
      console.log(text.val());
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val());
        text.val('');
      }
    });
    socket.on('createMessage', (message) => {
      console.log(message);
      $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
      scrollToBottom();
    });
  });


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})
myPeer.on('open', id => {
  console.log("Opened");
  userId = id;
  socket.emit('join-room', ROOM_ID, id)
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  console.log(call);
  console.log(myPeer);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
    console.log('user Joined and video added');
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  console.log('Video adding');
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop('scrollHeight'));
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector('.main__video_button').innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector('.main__video_button').innerHTML = html;
};
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  console.log('object');
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};
var screenSharing = false;
var screenStream;
function startScreenShare() {
  if (screenSharing) {
    stopScreenSharing();
  }
  navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
    screenStream = stream;
    let videoTrack = screenStream.getVideoTracks()[0];
    videoTrack.onended = () => {
      stopScreenSharing();
    };
    if (myPeer) {
      let sender = currentPeer.peerConnection.getSenders().find(function (s) {
        return s.track.kind == videoTrack.kind;
      });
      sender.replaceTrack(videoTrack);
      screenSharing = true;
    }
    console.log(screenStream);
  });
}

function stopScreenSharing() {
  if (!screenSharing) return;
  let videoTrack = myVideoStream.getVideoTracks()[0];
  if (myPeer) {
    let sender = currentPeer.peerConnection.getSenders().find(function (s) {
      return s.track.kind == videoTrack.kind;
    });
    sender.replaceTrack(videoTrack);
  }
  screenStream.getTracks().forEach(function (track) {
    track.stop();
  });
  screenSharing = false;
}
document.getElementById('mute').addEventListener('click', () => {
  muteUnmute();
});

document.getElementById('playStop').addEventListener('click', () => {
  playStop();
});
var screenShare = document.getElementById('share-screen');
screenShare.addEventListener('click', () => {
  if (screenSharing) {
    stopScreenSharing();
  } else {
    startScreenShare();
  }
});

function onGestureAction(results) {
  // console.log('Hi');
  var gesture = onResults(results);
  switch (gesture) {
    case Gesture.RightSwipe:
      {
        console.log('start share');
        startScreenShare();
      }
      break;
    case Gesture.LeftSwipe:
      {
        console.log('end share');
        stopScreenSharing();
      }
      break;
    case Gesture.All5Fingers:
      {
        //pass
      }
      break;
    case Gesture.ThumbsUp:
      {
        console.log('unmute audio');
        muteUnmute();
      }
      break;
    case Gesture.ThumbsDown:
      {
        console.log('mute audio');
        muteUnmute();
      }
      break;
    default: {
      //pass
    }
  }
}