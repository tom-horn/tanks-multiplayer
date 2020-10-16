const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let players = {};
let playerSockets = {};

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/play", function(req, res) {
  res.sendFile(path.join(__dirname, "views/game.html"));
});

app.use("/public", express.static("./public"));
http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  socket.on('newplayer', function(tank) {
    socket.broadcast.emit('newplayer', tank);
		socket.emit('addplayers', players);
		players[tank.id] = tank;
		playerSockets[tank.id] = socket;
	})

	socket.on('update', function(tank) {
		socket.broadcast.emit('update', tank);
	})

	socket.on('kill', function(tankId) {
		delete players[tankId];
		socket.broadcast.emit('kill', tankId);
	});

	socket.on('disconnect', function(){
    // remove disconnected users from the game
    for (let entry of Object.entries(playerSockets)) {
      let tankId = entry[0];
      let pSocket = entry[1];
      if (socket.id == pSocket.id) {
        delete playerSockets[tankId];
        delete players[tankId];
        socket.broadcast.emit('kill', tankId);
      }
    }
	});
});
