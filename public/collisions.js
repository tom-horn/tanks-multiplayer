function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

    // calculate the direction of the lines
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}

function lineRect(x1, y1, x2, y2, rx, ry, rw, rh, angle, cx, cy) {
    let xleft = rx;
    let xright = rx + rw;
    let ytop = ry;
    let ybottom = ry + rh;

    let topleft = rotatePoint(cx, cy, xleft, ytop, angle);
    let topright = rotatePoint(cx, cy, xright, ytop, angle);
    let bottomleft = rotatePoint(cx, cy, xleft, ybottom, angle);
    let bottomright = rotatePoint(cx, cy, xright, ybottom, angle);
    ellipse(topleft[0], topleft[1], 2, 2);
    ellipse(topright[0], topright[1], 2, 2);
    ellipse(bottomleft[0], bottomleft[1], 2, 2);
    ellipse(bottomright[0], bottomright[1], 2, 2);
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function
    let left =   lineLine(x1,y1,x2,y2, topleft[0], topleft[1], bottomleft[0], bottomleft[1]);
    let right =  lineLine(x1,y1,x2,y2, topright[0], topright[1], bottomright[0], bottomright[1]);
    let top =    lineLine(x1,y1,x2,y2, topleft[0], topleft[1], topright[0], topright[1]);
    let bottom = lineLine(x1,y1,x2,y2, bottomleft[0], bottomleft[1], bottomright[0], bottomright[1]);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}

function rotatePoint(cx, cy, x, y, angle) {
    var radians = -(Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}