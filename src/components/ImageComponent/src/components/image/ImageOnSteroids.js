import React, {Component, PropTypes} from 'react'
import R from 'ramda'
import Container from '../annotation/Container'
import {pointFromScalarFct} from '../../records/point';


const adjustTrasform = R.curry((scalePoint, offsetPoint, point)=>(
  point.scale(scalePoint)
    .add(offsetPoint)
));


export default class ImageOnSteroids extends Component {
  constructor(props, context) {
    super(props, context);
    this.getImageSrc.bind(this);
  }

  getImageSrc() {
    return this.props.src;
  }

  getImage() {
    return this.refs.img;
  }

  render() {
    const style = this.props.notDisplay ? {display: 'none'} : this.props.style;
    const outboxStyle = this.props.outboxStyle ? this.props.outboxStyle : style;

    let offsetPoint = this.props.offsetPoint ? this.props.offsetPoint : pointFromScalarFct(0);
    offsetPoint = this.props.additionalOffset ? offsetPoint.add(this.props.additionalOffset) : offsetPoint;
    let scalePoint = this.props.scalePoint ? this.props.scalePoint : pointFromScalarFct(1);

    const myAdjustTrasform = adjustTrasform(scalePoint, offsetPoint);

    const adjustedEditableImage = this.props.editableImage
    .updateOnTransform((rectangle)=>rectangle.updatePointsOnTransform(myAdjustTrasform))

    const annotations = adjustedEditableImage.get('annotations');
    const image = adjustedEditableImage.get('image');
    const src = image.get('src');
    const size = image.getSize().toJS();

    if (!size || !size.width || !size.height) {
      return <div/>
    }

    return <div style={{position:'relative'}}>
      <Container
            {...this.props}
          annotationsStartPriority={201}
          deemphasize={false}
          scalePoint={scalePoint}
          offsetPoint={offsetPoint}
          size={size}
          annotations={annotations}
        />

      <div style={outboxStyle}>
        <img crossOrigin='anonymous'
             ref='img'
             alt='picture'
             style={size}
             src={src}/>
      </div>
    </div>
  }
}
