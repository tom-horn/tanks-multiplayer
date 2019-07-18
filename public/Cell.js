function Cell(row, col, left, right, top, bottom, size) {
    this.row = row;
    this.col = col;

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;

    this.size = size;

    this.xleft = this.col * this.size;
    this.xright = this.xleft + this.size;
    this.ytop = this.row * this.size;
    this.ybottom = this.ytop + this.size;

    this.show = function() {
        stroke(0);
        if (this.left) {
            line(this.xleft, this.ytop, this.xleft, this.ybottom);
        }

        if (this.right) {
            line(this.xright, this.ytop, this.xright, this.ybottom);
        }

        if (this.top) {
            line(this.xleft, this.ytop, this.xright, this.ytop);
        }

        if (this.bottom) {
            line(this.xleft, this.ybottom, this.xright, this.ybottom);
        }
    }
}