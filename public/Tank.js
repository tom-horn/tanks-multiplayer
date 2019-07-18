function Tank(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.xvel = 0;
    this.yvel = 0;
    this.rotation = 0;
    this.bullets = [];
    
    this.show = function() {
      fill(0);

      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      rect(0, 0, this.size, this.size);
      rect(10, 0, 30, 5);
      pop();
    }
    
    this.update = function() {
      this.x += this.xvel;
      this.y += this.yvel;
      
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
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
        this.bullets.push(new Bullet(this.x + 30 * Math.cos(radians(this.rotation)), this.y + 30 * Math.sin(radians(this.rotation)) , this.rotation));
      }
    }

    this.deleteBullet = function(index) {
      this.bullets.splice(index, 1);
    }
  }