function Tank(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.xvel = 0;
    this.yvel = 0;
    this.rotation = 0;
    this.bullets = [];
    this.turretLength = 25
    
    this.show = function() {
      fill(0);

      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      rect(0, 0, this.size, this.size);
      rect(15, 0, this.turretLength, 5);
      pop();
    }
    
    this.update = function() {
      let newX = this.x + this.xvel;
      let newY = this.y + this.yvel;

      let isValid = this.positionIsValid(newX, newY)
      if (!isValid) {
        return;
      }

      this.x = newX;
      this.y = newY;
      
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
    }

    this.positionIsValid = function(x, y) {
      let nearbyCells = map.getSurroundingCells(x, y);

      for (let i = 0; i < nearbyCells.length; i++) {
        let cell = nearbyCells[i];
        // really bad and repetitive code here, fix later
        if (cell.left) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xleft, cell.ybottom,
                x - this.size / 2, y - this.size / 2, this.size, this.size, this.rotation,
                x, y)) {
            return false;
          }
          
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xleft, cell.ybottom,
                x, y, this.turretLength, 5, this.rotation,
                x, y)) {
            return false;
          }
        }

        if (cell.right) {
          // check collision with tank body and wall
          if (lineRect(cell.xright, cell.ytop, cell.xright, cell.ybottom,
            x - this.size / 2, y - this.size / 2, this.size, this.size, this.rotation,
            x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xright, cell.ytop, cell.xright, cell.ybottom,
            x, y, this.turretLength, 5, this.rotation,
            x, y)) {
            return false;
          }
        }

        if (cell.bottom) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ybottom, cell.xright, cell.ybottom,
            x - this.size / 2, y - this.size / 2, this.size, this.size, this.rotation,
            x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ybottom, cell.xright, cell.ybottom,
            x, y, this.turretLength, 5, this.rotation,
            x, y)) {
            return false;
          }
        }

        if (cell.top) {
          // check collision with tank body and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xright, cell.ytop,
            x - this.size / 2, y - this.size / 2, this.size, this.size, this.rotation,
            x, y)) {
            return false;
          }
      
          // check collision with turret and wall
          if (lineRect(cell.xleft, cell.ytop, cell.xright, cell.ytop,
            x, y, this.turretLength, 5, this.rotation,
            x, y)) {
            return false;
          }
        }
      }

      return true;
    }

    this.getTurretTip = function(x, y) {
      let tx = x + 25 * Math.cos(radians(this.rotation))
      let ty = y + 25 * Math.sin(radians(this.rotation))
      return [tx, ty];
    }
    
    this.setVel = function(xvel, yvel) {
      this.xvel = xvel;
      this.yvel = yvel;
    }

    this.rotateLeft = function() {
        this.rotation -= 3;
    }

    this.rotateRight = function() {
        this.rotation += 3;
    }

    this.moveForward = function() {
      this.xvel = Math.cos(radians(this.rotation)) * 2.5;
      this.yvel = Math.sin(radians(this.rotation)) * 2.5;
    }

    this.moveBackward = function() {
      this.xvel = -Math.cos(radians(this.rotation))
      this.yvel = -Math.sin(radians(this.rotation))
    }

    this.shoot = function() {
      if (this.bullets.length < 15) {
        let tip = this.getTurretTip(this.x, this.y);
        this.bullets.push(new Bullet(tip[0], tip[1], this.rotation));
      }
    }

    this.deleteBullet = function(index) {
      this.bullets.splice(index, 1);
    }
  }