import React, {Component, PropTypes} from 'react'
import {Button, Grid, Row, Col} from 'react-bootstrap';
import Container from '../annotation/Container'
import {Annotate, CropRotate} from '../editImageModes'
import ImageOnSteroidsResizableByParent from '../ImageOnSteroidsResizableByParent';
import ImageOnSteroids from '../ImageOnSteroids';
import {rectangleByPointsAndSizeFct} from '../../records/rectangle';
import {pointFromSize} from '../../records/point';
import {sizeFct} from '../../records/size';
import {PreviewDecorator,Preview2Decorator, PreviewStyleDecorator} from '../cropper/preview-item';
import cropperDecorator from '../cropper/cropperDecorator';

const CropperWithCoolImage = PreviewDecorator(cropperDecorator(ImageOnSteroids));

export default class CropperPane extends Component {
  render() {
    if (!this.props.editableImage) {
      return <div/>;
    }

    return (
      <div style={{
        overflow: 'hidden',
        position: 'absolute',
      }}>
        <CropperWithCoolImage
          autoCropArea={1}
          guides={true}
          {...this.props}
          >
        </CropperWithCoolImage>
      </div>
    );
  }
}


//getData() {
//  return this.$img.cropper('getData');
//}
//
//getContainerData() {
//  return this.$img.cropper('getContainerData');
//}
//
//getImageData() {
//  return this.$img.cropper('getImageData');
//}
//
//getCanvasData() {
//  return this.$img.cropper('getCanvasData');
//}

//setCanvasData(data) {
//  return this.$img.cropper('setCanvasData', data);
//}
//
//getCropBoxData() {
//  return this.$img.cropper('getCropBoxData');
//}
//
//setCropBoxData(data) {
//  return this.$img.cropper('setCropBoxData', data);
//}
//
//getCroppedCanvas(options) {
//  return this.$img.cropper('getCroppedCanvas', options);
//}
//
//setAspectRatio(aspectRatio) {
//  return this.$img.cropper('setAspectRatio', aspectRatio);
//}
//
//setDragMode() {
//  return this.$img.cropper('setDragMode');
//}

//on(eventname, callback) {
//  return this.$img.on(eventname, callback);
//}


//crop() {
//  const cropper = this.refs.cropper.refs.component;
//  if (!cropper) return;
//
//  const {width, height} = cropper.getCropBoxData();
//  this.props.imageModified({
//    dataUrl: cropper.getCroppedCanvas().toDataURL(),
//    size: {width, height}
//  });
//}
//
//rotate(degree) {
//  const cropper = this.refs.cropper.refs.component;
//  if (!cropper) return;
//
//  cropper.rotate(degree);
//  this.setState({
//    cropBox: cropper.getCropBoxData(),
//    image: cropper.getImageData(),
//    canvas: cropper.getCanvasData()
//  })
//}