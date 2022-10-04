const express = require('express');
const app = express();
// const fs = require('fs');
var https = require('http').Server(app);
var io = require('socket.io')(https);
const path = require('path');

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

const port = process.env.PORT || 3000;

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/static')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'webrtcpage.html'));
});
app.get('/share', function(req, res) {
    res.sendFile(path.join(__dirname, 'screen-sharing-min.html'));
});

app.get('/client.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'client.js'));
  });

io.on('connection', function (socket) {
    console.log('a user connected');
    console.log('connect socket id:'  + `${socket.id}`);

    socket.on('create or join', function (room) {
        console.log('create or join to room ', room);
        
        var myRoom = io.of("/").adapter.rooms.get(room)

        if(myRoom === undefined || myRoom.size == 0) {
            console.log("a room has been created. no participants to join.");
            socket.join(room);
            socket.emit('created', room);
            console.log(io.of("/").adapter.rooms.get(room).size)
        } else if (myRoom.size == 1) {
            console.log("a participants to join available room")
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }

    });

    socket.on('ready', function (room){
        socket.broadcast.to(room).emit('ready');
    });

    socket.on('candidate', function (event){
        socket.broadcast.to(event.room).emit('candidate', event);
    });

    socket.on('offer', function(event){
        socket.broadcast.to(event.room).emit('offer',event.sdp);
    });

    socket.on('answer', function(event){
        socket.broadcast.to(event.room).emit('answer',event.sdp);
    });

    socket.on('disconnect', function () {
       console.log('a user disconnected');
    });
});

https.listen(port, function (error) {
    if(!error)
        console.log('listening on', port,"\nTap on http://localhost:3000/");
    else 
    console.log("Error occurred.", error);
});
