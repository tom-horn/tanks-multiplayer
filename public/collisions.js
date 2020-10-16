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

    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function
    let left =   lineLine(x1, y1, x2, y2, topleft[0], topleft[1], bottomleft[0], bottomleft[1]);
    let right =  lineLine(x1, y1, x2, y2, topright[0], topright[1], bottomright[0], bottomright[1]);
    let top =    lineLine(x1, y1, x2, y2, topleft[0], topleft[1], topright[0], topright[1]);
    let bottom = lineLine(x1, y1, x2, y2, bottomleft[0], bottomleft[1], bottomright[0], bottomright[1]);

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

function lineCircle(x1, y1, x2, y2, cx, cy, r) {

    // is either end INSIDE the circle?
    // if so, return true immediately
    let inside1 = pointCircle(x1,y1, cx,cy,r);
    let inside2 = pointCircle(x2,y2, cx,cy,r);
    if (inside1 || inside2) return true;
  
    // get length of the line
    let distX = x1 - x2;
    let distY = y1 - y2;
    let len = sqrt( (distX*distX) + (distY*distY) );
  
    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);
  
    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));
  
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = linePoint(x1,y1,x2,y2,closestX,closestY);
    if (!onSegment) return false;
  
    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    let distance = sqrt( (distX*distX) + (distY*distY) );
  
    if (distance <= r) {
      return true;
    }
    return false;
  }

  function pointCircle(px, py, cx, cy, r) {

    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    let distX = px - cx;
    let distY = py - cy;
    let distance = sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= r) {
      return true;
    }
    return false;
  }
  
  function linePoint(x1, y1, x2, y2, px, py) {
    // get distance from the point to the two ends of the line
    let d1 = dist(px,py, x1,y1);
    let d2 = dist(px,py, x2,y2);
  
    // get the length of the line
    let lineLen = dist(x1,y1, x2,y2);
  
    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 0.1;    // higher # = less accurate
  
    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
  }

  function circleRect(cx, cy, radius, rx, ry, rw, rh, angle, rotatex, rotatey) {

    let xleft = rx;
    let xright = rx + rw;
    let ytop = ry;
    let ybottom = ry + rh;

    let topleft = rotatePoint(rotatex, rotatey, xleft, ytop, angle);
    let topright = rotatePoint(rotatex, rotatey, xright, ytop, angle);
    let bottomleft = rotatePoint(rotatex, rotatey, xleft, ybottom, angle);
    let bottomright = rotatePoint(rotatex, rotatey, xright, ybottom, angle);

    let left =   lineCircle(topleft[0], topleft[1], bottomleft[0], bottomleft[1], cx, cy, radius);
    let right =  lineCircle(topright[0], topright[1], bottomright[0], bottomright[1], cx, cy, radius);
    let top =    lineCircle(topleft[0], topleft[1], topright[0], topright[1], cx, cy, radius);
    let bottom = lineCircle(bottomleft[0], bottomleft[1], bottomright[0], bottomright[1], cx, cy, radius);

    if (left || right || top || bottom) {
        return true;
    }
    return false;
  }
