import React, {Component} from 'react';
import R from 'ramda';
import objectAssign from 'object-assign';
import ImageOnSteroids from '../image/ImageOnSteroids';
import {rectangleByPointsFct,rectangleByPointsAndSizeFct, rectangleBySizeFct, imRectangleFct} from '../../records/rectangle';
import {pointFromSize} from '../../records/point';
import {sizeFct} from '../../records/size';

export const PreviewDecorator = (WrappedComponent)=> {
  class Preview extends Component {

    render() {
      if (!this.props.imageRect) {
        return <WrappedComponent {...this.props} ref='component'/>
      }

      const imageRect = imRectangleFct(this.props.imageRect);
      const canvasTopLeftPoint = imRectangleFct(this.props.canvasRect).getTopLeftPoint();
      const cropBoxRectTopLeftPoint = imRectangleFct(this.props.cropBoxRect).getTopLeftPoint();
      const imageLeftPoint = imRectangleFct(this.props.imageRect).getTopLeftPoint();
      const imageSizePoint = pointFromSize(imageRect.getSize());
      const outboxSizePoint = pointFromSize(sizeFct(this.props.style));

      const offsetPoint = canvasTopLeftPoint.add(imageRect.getTopLeftPoint());
      const scalePoint = imageSizePoint.divide(outboxSizePoint);

    return <WrappedComponent {...this.props} 
              ref='component'
              offsetPoint={offsetPoint}
              scalePoint={scalePoint}
        />
    }

  }
  return Preview
};

//export const Preview2Decorator = (WrappedComponent)=> {
//    class Preview extends Component {
//        render() {
//            if (!this.props.cropBoxRect || !this.props.canvasRect || !this.props.imageRect) {
//                return <WrappedComponent {...this.props} ref='component'/>
//            }
//
//            const canvasTopLeftPoint = this.props.canvasRect.getTopLeftPoint();
//            const imageLeftPoint = this.props.imageRect.getTopLeftPoint();
//            const cropBoxTopLeftPoint = this.props.cropBoxRect.getTopLeftPoint();
//            const imageTopLeftPoint = this.props.imageRect.getTopLeftPoint();
//            const outboxSizePoint = pointFromSize(sizeFct(this.props.outboxStyle));
//            const imageSizePoint = pointFromSize(this.props.imageRect.getSize());
//            const cropBoxSizePoint = pointFromSize(this.props.cropBoxRect.getSize());
//            const canvasSizePoint = pointFromSize(this.props.canvasRect.getSize());
//            const naturalImageSizePoint = pointFromSize(this.props.naturalImageSize);
//
//            this.props.scalePoint = this.props.scalePoint.inverse()
//                .scale(canvasSizePoint.divide(cropBoxSizePoint));
//
//            this.props.offsetPoint = this.props.offsetPoint.subtract(canvasTopLeftPoint).add((cropBoxTopLeftPoint.subtract(canvasTopLeftPoint).scale(outboxSizePoint.divide(cropBoxSizePoint))).negate());
//            //this.props.additionalOffset = this.props.additionalOffset.subtract(cropBoxTopLeftPoint);
//
//            console.log(cropBoxTopLeftPoint.toJS())
//            console.log(canvasTopLeftPoint.toJS())
//            return <WrappedComponent {...this.props} ref='component'
//                                                     outboxStyle={this.props.outboxStyle}
//                                                     imgSizePoint={imageSizePoint
//                                                         .scale(cropBoxSizePoint
//                                                         .divide(outboxSizePoint)
//                                                         .inverse())
//                                                     }
//                                                     cropOffsetPoint={cropBoxTopLeftPoint
//                .subtract(canvasTopLeftPoint)
//                .scale(outboxSizePoint.divide(cropBoxSizePoint))
//                .negate()}
//                //rotate={this.props.image.rotate}
//                />
//        }
//
//    }
//    return Preview
//};

//export const PreviewStyleDecorator = (WrappedComponent)=> {
//    class PreviewStyle extends Component {
//        render() {
//            if (!this.props.imageRect) {
//                return <WrappedComponent {...this.props} ref='component'/>
//            }
//
//            this.props.outboxStyle = objectAssign({overflow: 'hidden'}, this.props.outboxStyle);
//            function getRotateValue(degree) {
//                return degree ? 'rotate(' + degree + 'deg)' : 'none';
//            }
//
//            const imgStyle = objectAssign({
//                display: 'block',
//                minWidth: '0px !important',
//                minHeight: '0px !important',
//                maxWidth: 'none !important',
//                maxHeight: 'none !important',
//                marginLeft: this.props.cropOffsetPoint.get('x'),
//                marginTop: this.props.cropOffsetPoint.get('y'),
//                width: this.props.imgSizePoint.get('x'),
//                height: this.props.imgSizePoint.get('y'),
//                //transform: this.props.rotate ? getRotateValue(this.props.rotate) : 'none'
//            }, this.props.imgStyle);
//
//            return <WrappedComponent {...this.props} ref='component' imgStyle={imgStyle}/>
//        }
//    }
//    return PreviewStyle
//};
