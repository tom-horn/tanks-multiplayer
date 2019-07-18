function Bullet(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.xvel = Math.cos(radians(this.angle));
		this.yvel = Math.sin(radians(this.angle));
		this.r = 2.5;
		this.errorCount = 0;

    this.show = function() {
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    this.update = function() {
			let newx = this.x + this.xvel;
			let newy = this.y + this.yvel;

			let result = this.positionIsValid(newx, newy)
			if (!result.valid) {
				if (this.errorCount > 5) {
					if (result.vertical) {
						this.yvel *= -1;
					} else {
						this.xvel *= -1;
					}
				}
				if (result.vertical) {
					this.xvel *= -1;
				} else {
					this.yvel *= -1;
				}
				this.errorCount += 1;
				return;
			}

			this.x = newx;
			this.y = newy;
    }

    this.positionIsValid = function(x, y) {
			let nearbyCells = map.getSurroundingCells(x, y);

      for (let i = 0; i < nearbyCells.length; i++) {
        let cell = nearbyCells[i];
        if (cell.left) {
          if (lineCircle(cell.xleft, cell.ytop, cell.xleft, cell.ybottom, x, y, this.r)) {
						return {
							x1: cell.xleft,
							y1: cell.ytop,
							x2: cell.xleft,
							y2: cell.ybottom,
							vertical: true,
							valid: false
						};
					}
        }

        if (cell.right) {
					if (lineCircle(cell.xright, cell.ytop, cell.xright, cell.ybottom, x, y, this.r)) {
						return {
							x1: cell.xright,
							y1: cell.ytop,
							x2: cell.xright,
							y2: cell.ybottom,
							vertical: true,
							valid: false
						};
					}
        }

        if (cell.bottom) {
					if (lineCircle(cell.xleft, cell.ybottom, cell.xright, cell.ybottom, x, y, this.r)) {
						return {
							x1: cell.xleft,
							y1: cell.ybottom,
							x2: cell.xright,
							y2: cell.ybottom,
							vertical: false,
							valid: false
						};
					}
        }

        if (cell.top) {
					if (lineCircle(cell.xleft, cell.ytop, cell.xright, cell.ytop, x, y, this.r)) {
						return {
							x1: cell.xleft,
							y1: cell.ytop,
							x2: cell.xright,
							y2: cell.ytop,
							vertical: false,
							valid: false
						};
					}
        }
			}

      return {
				valid: true
			};
		}
		
		this.hitTank = function(tanks) {
			let newTanks = [];
			let hit = false;
			for (let i = 0; i < tanks.length; i++) {
				let tank = tanks[i];
				if (circleRect(this.x, this.y, this.r, tank.x - tank.size / 2, tank.y - tank.size / 2, tank.size, tank.size, tank.rotation, tank.x, tank.y)) {
					hit = true;
				} else {
					newTanks.push(tank);
				}
			}
			return {
				hit: hit,
				tanks: tanks
			}
		}

    // this.dead = function() {
    //     return (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
    // }
}