/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import {Record} from 'immutable';
import {shallowCopyImToObj} from '../utils';
import {rectangleBySizeFct} from '../rectangle';
import {pointFct, pointFromSize} from '../point';

const schema = {
  id: undefined,
  content: '',
  timeStamp: undefined,
  type: undefined,
  drawing: undefined,
  moving: undefined,
  rectangle: undefined,
  image: undefined,
  fullsize_rectangle: undefined,
  deepImageIndex: undefined,
  deepImageColor: undefined,
};

export const _AnnotationRecord = Record(schema);
export const imAnnotationFct = (obj)=> new AnnotationRecord(shallowCopyImToObj(schema, obj));

class AnnotationRecord extends _AnnotationRecord {
  updateOnTransform(func) {
    return imAnnotationFct(this.update('rectangle', func));
  }

  adjustSize(oldHostSize, newHostSize) {
    let annotation = this;

    const sizePoint = pointFct({x: newHostSize.width, y: newHostSize.height});
    const oldSizePoint = pointFct({x: oldHostSize.width, y: oldHostSize.height});

    const scalePoint = sizePoint.divide(oldSizePoint);

    return imAnnotationFct(
      annotation.updateOnTransform((rectangle)=>rectangle.scale(scalePoint))
    );
  }

  move(movePoint) {
    return imAnnotationFct(
      this.updateOnTransform((rectangle)=>rectangle.updatePointsOnTransform((point)=>point.add(movePoint))
      )
    );
  }

  rotate(degree, centerPoint) {
    return imAnnotationFct(
      this.updateOnTransform((rectangle)=>rectangle.rotate(degree, centerPoint))
    )
  }
}
export const annotationFct = ({id,type, drawing, moving, rectangle, fullsize_rectangle, image, link, deepImageIndex, deepImageColor})=>
  new AnnotationRecord({
    content: '',
    id,
    timeStamp: new Date(),
    type,
    moving,
    drawing,
    link,
    image,
    rectangle,
    fullsize_rectangle,
    deepImageIndex,
    deepImageColor,
  });
