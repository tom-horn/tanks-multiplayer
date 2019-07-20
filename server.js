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
	console.log("New Request: Method - " + req.route.stack[0].method + "   " + " Route - " + req.route.path);
});

app.use("/public", express.static("./public"));
http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('newplayer', function(tank) {
		console.log("new tank entered the arena");
		socket.broadcast.emit('newplayer', tank);
		socket.emit('addplayers', players);
		console.log(players);
		players[tank.id] = tank;
		playerSockets[tank.id] = socket;
	})

	socket.on('update', function(tank) {
		socket.broadcast.emit('update', tank);
	})

	socket.on('kill', function(tank) {
		delete players[tank.id];
		socket.broadcast.emit('kill', tank);
	})

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});