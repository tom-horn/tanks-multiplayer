function Cell(row, col, left, right, top, bottom, size) {
    this.row = row;
    this.col = col;

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;

    this.size = size;

    this.show = function() {
        let xleft = this.col * this.size;
        let xright = xleft + this.size;
        let ytop = row * this.size;
        let ybottom = ytop + this.size;
        stroke(0);
        if (this.left) {
            line(xleft, ytop, xleft, ybottom);
        }

        if (this.right) {
            line(xright, ytop, xright, ybottom);
        }

        if (this.top) {
            line(xleft, ytop, xright, ytop);
        }

        if (this.bottom) {
            line(xleft, ybottom, xright, ybottom);
        }
    }
}