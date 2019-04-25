/* @flow weak */

/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import R from 'ramda'

export const rotateProc = R.curry((theta, {x:cx, y:cy}/*center*/, {x, y}/*point*/)=> {
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  const radian = toRadians(theta);

  const sin = Math.sin(radian);
  const cos = Math.cos(radian);

  const tempX = x - cx;
  const tempY = y - cy;

  const rotatedX = tempX * cos - tempY * sin;
  const rotatedY = tempX * sin + tempY * cos;

  return {x: rotatedX + cx, y: rotatedY + cy}
});

// use only on center axises flipping
export const flipByAxisProc = R.curry((axisCoord, coord)=> {
  const diffFromAxis = coord - axisCoord;
  return axisCoord - diffFromAxis;
});

export const containPointProc = ({point1: {x: left, y: top}, point2: {x: right, y: bottom}}, {x, y})=> {
  return left <= x && right >= x && top <= y && bottom >= y;
};

///////////////////
export const shallowCopyImToObj = (schema, imObj)=>
  R.fromPairs(R.map((key)=>[key, imObj.get(key)])(R.keys(schema)));
