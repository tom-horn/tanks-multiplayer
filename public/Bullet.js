function Bullet(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.xvel = Math.cos(radians(this.angle));
    this.yvel = Math.sin(radians(this.angle));

    this.show = function() {
        ellipse(this.x, this.y, 5, 5);
    }

    this.update = function() {
        this.x += this.xvel;
        this.y += this.yvel;
    }

    this.dead = function() {
        return (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
    }
}