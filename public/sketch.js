let player;
let tanks = {};
let map;
let seed = "hellllooo";
let game_over = false;
let socket = io();
let cowabungaAudio = document.getElementById("cowabunga-audio");

function createNewBullets(oldBullets, colour) {
  let bullets = [];
  for (let i = 0; i < oldBullets.length; i++) {
    bullet = oldBullets[i];
    let nb = new Bullet(bullet.x, bullet.y, bullet.angle, bullet.xvel, bullet.yvel, colour);
    bullets.push(nb);
  }
  return bullets;
}

function createNewTank(oldTank) {
  let bullets = createNewBullets(oldTank.bullets, oldTank.colour);
  return new Tank(oldTank.x, oldTank.y, oldTank.id, oldTank.rotation, bullets, oldTank.colour);
}

function newMap(newSeed) {
  seed = newSeed
  map = new Map(seed);
  map.createWalls();
}

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  rectMode(CENTER);
  frameRate(50);

  player = new Tank(20, 20, create_UUID(), 0, [], getRandomRgb());
  newMap(seed);

  socket.emit('newplayer', player);

  // receive newplayer message when a player joins the game
  socket.on('newplayer', function(tank) {
    console.log("new player");
    tanks[tank.id] = createNewTank(tank);
  })

  // receive addplayers message when first connecting to server
  socket.on('addplayers', function(players) {
    console.log("adding players: ", players);
    for (let key in players) {
      let tank = players[key];
      tanks[tank.id] = createNewTank(tank);
    };
  });

  // receive update message from other players
  socket.on('update', function(tank) {
    let bullets = createNewBullets(tank.bullets, tank.colour);
    try {
      tanks[tank.id].x = tank.x;
      tanks[tank.id].y = tank.y;
      tanks[tank.id].rotation = tank.rotation
      tanks[tank.id].bullets = bullets;
    } catch(err) {
    }
  })

  // receive kill message
  socket.on('kill', function(tankId) {
    if (tankId in tanks) {
      delete tanks[tankId];
    } else if (tankId === player.id) {
      game_over = true;
      alert("you dead!");
    }
  })

  setInterval(function() {
    socket.emit('update', player);
  }, 50);
}

function displayGameOver() {
  background(0);
  textSize(32);
  fill(255, 255, 255);
  textAlign(CENTER);
  text('GAME OVER', width * 0.5, height * 0.5);
}

function draw() {
  if (game_over) {
    displayGameOver();
    return;
  }

  background(255);
  for(let key in tanks) {
    let tank = tanks[key];
    tank.update();
    tank.show();
    
    for (let j = 0; j < tank.bullets.length; j++) {
      let bullet = tank.bullets[j];
      bullet.update();
      bullet.show();
    }
  }

  processKeys();
  player.update();
  player.show();

  for (let i = player.bullets.length - 1; i >= 0; i--) {
    let bullet = player.bullets[i];

    // check if current player has been hit
    let result = bullet.hitTank([player]);
    if (result.hit) {
      console.log("you're dead son!");
      socket.emit("kill", player.id);
      game_over = true;
      player.deleteBullet(i);
      return;
    }

    // check if other tanks have been hit
    result = bullet.hitTank(tanks);
    if (result.hit) {
      delete tanks[result.tank.id];
      console.log("killed another tank!");
      socket.emit("kill", result.tank.id);
      player.deleteBullet(i);
      cowabungaAudio.play();
    }

    bullet.update();
    bullet.show();
  }

  for (let i = 0; i < map.cells.length; i++) {
    let cell = map.cells[i];
    cell.show();
  }
}

function processKeys() {
  if (keyIsDown(LEFT_ARROW)) {
    player.rotateLeft();
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.rotateRight();
  }

  if (keyIsDown(UP_ARROW)) {
    player.moveForward();
  } else if (keyIsDown(DOWN_ARROW)) {
    player.moveBackward();
  } else {
    player.setVel(0, 0);
  }
}

function keyPressed() {
  if (keyCode === 77) {
    player.shoot();
  }
}

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = num >> 8 & 255;
  var b = num & 255;
  return {
    "red": r,
    "green": g,
    "blue": b,
  }
}