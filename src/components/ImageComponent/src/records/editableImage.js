/* @flow weak */
/*eslint no-new:0*/
/*eslint no-use-before-define:0*/
/*eslint new-cap:0*/

import {Record, List} from 'immutable';
import {imageFct} from '../image';
import {pointFct, pointFromSize} from '../point';
import {rectangleBySizeFct, rectangleFct} from '../rectangle';
import {shallowCopyImToObj} from '../utils';
import R from 'ramda';

const schema = {
  image: undefined,
  annotations: undefined,
  deeperImages: undefined,
  hotspots: undefined,
  lastId: undefined,
};

export const _EditableImageRecord = Record(schema);
export const imEditableImageFct = (obj)=> new EditableImageRecord(shallowCopyImToObj(schema, obj));

class EditableImageRecord extends _EditableImageRecord {
  getSize() {
    return this.get('image').getSize();
  }

  getCenterPoint() {
    return pointFromSize(this.get('image').getSize()).scaleScalar(0.5);
  }

  updateOnTransform(func) {
    return imEditableImageFct(this.update('annotations', (annotations)=>
        annotations.map((annotation)=> annotation.updateOnTransform(func)))
    );
  }

  adjustSize(oldSize, newSize) {
    return imEditableImageFct(this.update('annotations', (annotations)=>(
          annotations.map((annotation)=>annotation.adjustSize(oldSize, newSize)))
      ).update('image', (image)=>image.updateSize(newSize))
    );
  }

  rotate(degree) {
    const centerPoint = this.getCenterPoint();
    return imEditableImageFct(this.update('annotations', (annotations)=>(
        annotations.map((annotation)=>annotation.rotate(degree, centerPoint))
      )
    ))
  }

  crop(src, {top, left, right, bottom}) {
    const currentSizePoint = pointFromSize(this.getSize());
    const topLeftRatioPoint = pointFct({x: left, y: top});
    const rightBottomRatiomPoint = pointFct({x: right, y: bottom});
    const newTopLeftPoint = topLeftRatioPoint.scale(currentSizePoint);
    const newRightBottomPoint = rightBottomRatiomPoint.scale(currentSizePoint);

    const newRect = rectangleFct({point1: newTopLeftPoint, point2: newRightBottomPoint});

    const negateNewTopLeftPoint = newTopLeftPoint.negate();

    return imEditableImageFct(this.update('image', (image)=>image.crop(src, newRect.getSize()))
      .update('annotations', (annotations)=> {
        return annotations
          .filter((annotation)=>newRect.containRect(annotation.get('rectangle')))
          .map((annotation)=>annotation.move(negateNewTopLeftPoint))
      }
    ));
  }

  updateImageSrc(src) {
    return imEditableImageFct(this.update('image', (image)=>image.updateSrc(src)));
  }

  updateImageServerSrc(src) {
    return imEditableImageFct(this.update('image', (image)=>image.updateImageServerSrc(src)));
  }

  updateImageSize(size) {
    return imEditableImageFct(this.update('image', (image)=>image.updateSize(size)));
  }

  annotationDelete(id) {
    return imEditableImageFct(
      this.update('annotations', (list)=>list.delete(list.findIndex((value) => value.get('id') === id)))
    );
  }

  updateAnnotation(id, func) {
    return imEditableImageFct(
      this.update('annotations', (list)=> {
        const index = list.findIndex((value) => value.get('id') === id);
        return list.set(index, func(list.get(index)));
      })
    );
  }

  annotationSave(annotation, curSize) {
    let annotationToSave = annotation.adjustSize(curSize, this.getSize())
    annotationToSave = !annotation.get('id') ? annotationToSave.set('id', this.get('lastId') + 1) : annotationToSave;

    const addAnnotationToList = R.curry((newAnnotation, list)=> {
      const index = list.findIndex((value) => value.get('id') === newAnnotation.get('id'));

      if (index >= 0) {
        return list.set(index, newAnnotation);
      }
      return list.push(newAnnotation);
    });

    return imEditableImageFct(
      this.update('annotations', addAnnotationToList(annotationToSave))
        .update('lastId', (lastId)=>Math.ceil(Math.max(annotationToSave.get('id'), lastId))
      )
    );
  }
}

export const editableImageFct = ({annotations, image, deeperImages, hotspots})=> new EditableImageRecord({
  image: imageFct(image),
  annotations: List(annotations),
  deeperImages: List(deeperImages),
  hotspots: List(hotspots),
  lastId: 0,
});

// const flipTransform = (axis, axisCoord)=>
//    (__)=>__.flip(axis, axisCoord);
// const rotateTransform = (theta, center)=>
//    (__)=>__.rotate(theta, center);
