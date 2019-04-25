/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import {Record} from 'immutable';
import {pointFct} from '../point';
import {sizeFct} from '../size';
import {containPointProc, shallowCopyImToObj} from '../utils';

const schema = {
  point1: undefined,
  point2: undefined,
};

const _RectangleRecord = Record(schema);
export const imRectangleFct = (obj)=> new RectangleRecord(shallowCopyImToObj(schema, obj));

export class RectangleRecord extends _RectangleRecord {
  getSize() {
    return sizeFct({
      width: Math.abs(this.point2.get('x') - this.point1.get('x')),
      height: Math.abs(this.point2.get('y') - this.point1.get('y')),
    });
  }

  // getDirectionPoint() {
  //  return pointFct({
  //    x: this.getX2() - this.getX1() >= 0 ? 1 : -1,
  //    y: this.getY2() - this.getY1() >= 0 ? 1 : -1
  //  });
  // }

  getSquare() {
    return Math.abs((this.getX1() - this.getX2()) * (this.getY1() - this.getY2()));
  }

  getPoints() {
    return {x1: this.getX1(), x2: this.getX2(), y1: this.getY1(), y2: this.getY2()};
  }

  normalize() {
    let point = this;
    if (this.getX1() > this.getX2()) {
      point = point.updateX1(this.getX2()).updateX2(this.getX1())
    }
    if (this.getY1() > this.getY2()) {
      point = point.updateY1(this.getY2()).updateY2(this.getY1())
    }
    return point
  }

  updatePointsOnTransform(func) {
    return imRectangleFct(this.update('point1', func)
        .update('point2', func)
    );
  }

  rotate(degree, centerPoint) {
    return imRectangleFct(
      this.updatePointsOnTransform((point)=>point.rotate(degree, centerPoint.toJS()))
    );
  }

  updatePointsCoordsOnTransform(funcX, funcY) {
    return imRectangleFct(this.updatePointsOnTransform((point)=>point.updateCoordsOnTransform(funcX, funcY)));
  }

  add(otherPoint) {
    return imRectangleFct(this.updatePointsOnTransform((point)=>point.add(otherPoint)));
  }

  subtract(otherPoint) {
    return imRectangleFct(this.updatePointsOnTransform((point)=>point.subtract(otherPoint)));
  }

  scale(otherPoint) {
    return imRectangleFct(this.updatePointsOnTransform((point)=>point.scale(otherPoint)));
  }

  divide(otherPoint) {
    return imRectangleFct(this.updatePointsOnTransform((point)=>point.divide(otherPoint)));
  }

  getTopLeftPoint() {
    return this.get('point1');
  }

  getCenterPoint() {
    return this.get('point2').add(this.get('point1')).scaleScalar(0.5);
  }

  getBottomRightPoint() {
    return this.get('point2');
  }

  getX1() {
    return this.get('point1').get('x');
  }

  getX2() {
    return this.get('point2').get('x');
  }

  getY1() {
    return this.get('point1').get('y');
  }

  getY2() {
    return this.get('point2').get('y');
  }

  updateX1(val) {
    return imRectangleFct(this.update('point1', (point)=>point.setCoord('x', val)));
  }

  updateX2(val) {
    return imRectangleFct(this.update('point2', (point)=>point.setCoord('x', val)));
  }

  updatePoint1(newPoint, func) {
    return imRectangleFct(this.update('point1', (point)=>(func ? func : (point1, point2)=>point2)(point, newPoint)));
  }

  updatePoint2(newPoint, func) {
    return imRectangleFct(this.update('point2', (point)=>(func ? func : (point1, point2)=>point2)(point, newPoint)));
  }

  updateY1(val) {
    return imRectangleFct(this.update('point1', (point)=>point.setCoord('y', val)));
  }

  updateY2(val) {
    return imRectangleFct(this.update('point2', (point)=>point.setCoord('y', val)));
  }

  containPoint(point) {
    return containPointProc(this.toJS(), point);
  }

  containRect(rect) {
    return this.containPoint(rect.get('point1')) && this.containPoint(rect.get('point2'));
  }
}

export const rectangleFct = ({point1, point2})=>
  new RectangleRecord({
    point1: pointFct(point1),
    point2: pointFct(point2),
  });

export const rectangleFromOnePointFct = (point)=>
  rectangleFct({point1: point, point2: point});

export const rectangleByPointsFct = ({top, left, right, bottom})=>
  rectangleFct({
    point1: {x: left, y: top},
    point2: {x: right, y: bottom},
  });

export const rectangleByPointsAndSizeFct = ({top, left, width, height})=>
  rectangleByPointsFct({left, top, right: left + width, bottom: top + height});

export const rectangleBySizeFct = ({width, height})=>
  rectangleByPointsFct({top: 0, left: 0, right: width, bottom: height});
