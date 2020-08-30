function Tank(x, y, id, rotation=0, bullets=[], colour) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.size = 15;
    this.width = 15;
    this.length = 18;
    this.xvel = 0;
    this.yvel = 0;
    this.forwardVelocityFactor = 2.5;
    this.backwardVelocityFactor = 1;
    this.rotationDelta = 4;
    this.rotation = rotation;
    this.bullets = bullets;
    this.turretLength = 10;
    
    this.show = function() {
      fill(0);

      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      
      // set the colour of the tank
      let c = color(this.colour.red, this.colour.blue, this.colour.green);
      fill(c);
      noStroke();

      rect(0, 0, this.length, this.width);
      rect(10, 0, this.turretLength, 5);
      pop();
    }
    
    this.update = function() {
      let newX = this.x + this.xvel;
      let newY = this.y + this.yvel;

      let isValid = this.positionIsValid(newX, newY, this.rotation)
      if (!isValid) {
        return;
      }

      this.x = newX;
      this.y = newY;
      
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }

    this.positionIsValid = function(x, y, angle) {
      let nearbyCells = map.getSurroundingCells(x, y);

      let rx = x - this.width / 2;
      let ry = y - this.length / 2;
      let rw = this.width;
      let rh = this.length;

      for (let i = 0; i < nearbyCells.length; i++) {
        let cell = nearbyCells[i];
        // really bad and repetitive code here, fix later
        if (cell.left) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xleft, cell.ybottom,
                rx, ry, rw, rh, angle, x, y)) {
            return false;
          }
          
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xleft, cell.ybottom,
                x, y, this.turretLength, 5, angle,
                x, y)) {
            return false;
          }
        }

        if (cell.right) {
          // check collision with tank body and wall
          if (lineRect(cell.xright, cell.ytop, cell.xright, cell.ybottom,
            rx, ry, rw, rh, angle, x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xright, cell.ytop, cell.xright, cell.ybottom,
            x, y, this.turretLength, 5, angle,
            x, y)) {
            return false;
          }
        }

        if (cell.bottom) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ybottom, cell.xright, cell.ybottom,
            rx, ry, rw, rh, angle, x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ybottom, cell.xright, cell.ybottom,
            x, y, this.turretLength, 5, angle,
            x, y)) {
            return false;
          }
        }

        if (cell.top) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xright, cell.ytop,
            rx, ry, rw, rh, angle, x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xright, cell.ytop,
            x, y, this.turretLength, 5, angle,
            x, y)) {
            return false;
          }
        }
      }

      return true;
    }

    this.getTurretTip = function(x, y) {
      let offset = 4;
      let tx = x + ((this.turretLength + offset) * Math.cos(radians(this.rotation)))
      let ty = y + ((this.turretLength + offset) * Math.sin(radians(this.rotation)))
      return [tx, ty];
    }
    
    this.setVel = function(xvel, yvel) {
      this.xvel = xvel;
      this.yvel = yvel;
    }

    this.rotateLeft = function() {
      let newRot = this.rotation - this.rotationDelta;
      
      if (this.positionIsValid(this.x, this.y, newRot)) {
        this.rotation = newRot;
      }
    }

    this.rotateRight = function() {
      let newRot = this.rotation + this.rotationDelta;
      
      if (this.positionIsValid(this.x, this.y, newRot)) {
        this.rotation = newRot;
      }
    }

    this.moveForward = function() {
      this.xvel = Math.cos(radians(this.rotation)) * this.forwardVelocityFactor;
      this.yvel = Math.sin(radians(this.rotation)) * this.forwardVelocityFactor;
    }

    this.moveBackward = function() {
      this.xvel = -Math.cos(radians(this.rotation)) * this.backwardVelocityFactor;
      this.yvel = -Math.sin(radians(this.rotation)) * this.backwardVelocityFactor;
    }

    this.shoot = function() {
      if (this.bullets.length < 15) {
        let tip = this.getTurretTip(this.x, this.y);
        this.bullets.push(new Bullet(tip[0], tip[1], this.rotation, null, null, this.colour));
      }
    }

    this.deleteBullet = function(index) {
      this.bullets.splice(index, 1);
    }
  }