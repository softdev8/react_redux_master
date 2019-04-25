/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import R from 'ramda'
import {Record} from 'immutable'
import {rotateProc, flipByAxisProc} from '../utils'
import {shallowCopyImToObj} from '../utils'

const schema = {
  x: undefined,
  y: undefined,
};

const _PointRecord = Record(schema);
export const imPointFct = (obj)=> new PointRecord(shallowCopyImToObj(schema, obj));

class PointRecord extends _PointRecord {
  rotate(theta, center) {
    return imPointFct(this.merge(rotateProc(theta, center)(this.toJS())))
  }

  flip(axis, axisCoord) {
    return imPointFct(this.update(axis, flipByAxisProc(axisCoord)))
  }

  setCoord(coordType, val) {
    return imPointFct(this.update(coordType, ()=>val))
  }

  updateCoordsOnTransform(funcX, funcY) {
    return imPointFct(this.update('x', funcX).update('y', (funcY ? funcY : funcX)))
  }

  updatePoint(coordOp, point) {
    return imPointFct(this.updateCoordsOnTransform(
        (x)=>coordOp(x, point.get('x')),
        (y)=>coordOp(y, point.get('y')))
    );
  }

  add(otherPoint) {
    return imPointFct(this.updatePoint(R.add, otherPoint))
  }

  subtract(otherPoint) {
    return imPointFct(this.updatePoint(R.add, otherPoint.negate()))
  }

  divide(otherPoint) {
    return imPointFct(this.updatePoint(R.multiply, otherPoint.inverse()))
  }

  scale(otherPoint) {
    return imPointFct(this.updatePoint(R.multiply, otherPoint))
  }

  addScalar(val) {
    return imPointFct(this.updatePoint(R.add, pointFromScalarFct(val)))
  }

  scaleScalar(val) {
    return imPointFct(this.updatePoint(R.multiply, pointFromScalarFct(val)))
  }

  negate() {
    return imPointFct(this.updateCoordsOnTransform((coord)=>-coord));
  }

  inverse() {
    return imPointFct(this.updateCoordsOnTransform((coord)=>1 / coord));
  }
}

export function pointFct({x, y}) {
  return new PointRecord({x, y});
}

export function pointFromScalarFct(val) {
  return new PointRecord({x: val, y: val});
}

export function pointFromSize(size) {
  return new PointRecord({x: size.get('width'), y: size.get('height')});
}
