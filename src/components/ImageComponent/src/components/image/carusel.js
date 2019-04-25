import React, {Component} from 'react'
import R from 'ramda'
import assign from 'object-assign'
import {rectangleBySizeFct} from '../../records/rectangle';
import pure from 'react-pure-component';
import ImageOnSteroids from '../ImageOnSteroids'
import WithArrows from '../WithArrows'
import View  from 'react-flexbox';

export default class Carusel extends Component {
  render() {
    const {
      currentImage,
      images,
      indexChanged,
      width,
      height
      } = this.props;

    const createCaruselImage = (image, index) => {
      let style = {width: 150, height: 150, display: 'inline-block'};

      if (currentImage === image) {
        style = assign(style, {border: '1px solid blue'});
      }

      const editableImage = image.get('editableImage');
      return <div onClick={()=>indexChanged(index)} style={style}>
        <ImageOnSteroids
          
          editableImage={editableImage.adjustSize(editableImage.getSize().toJS(), style)}
          size={style}
          canAnnotate={false}/>
      </div>;
    };

    let i = 0;
    let caruselItems = R.map((image)=>createCaruselImage(image, i++))(images);


    return (
      <WithArrows
        style={{width:'100%'}}
        onLeftClick={this.props.onLeftClick}
        onRightClick={this.props.onRightClick}
        >
        <div>
          {caruselItems}
        </div>
      </WithArrows>
    )
  }
}

