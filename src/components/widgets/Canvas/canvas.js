import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';

import CaptionComponent from '../../CaptionComponent/CaptionComponent';
import CanvasComponentInternal from './CanvasComponentInternal';

export default class Canvas extends Component{
  //HACK: This method isn't called for Canvas component to avoid a cyclic dependency of ComponentMeta and Canvas

  constructor(props, context) {
    super(props, context);
    this.saveComponent  = this.saveComponent.bind(this);
    this.setSvg = this.setSvg.bind(this);
  }

  static getComponentDefault () {
    const defaultContent = {
      version: '1.0',
      width: 600,
      height: 400,
      objectsDict: {},
      svg_string: '',
      canvasJSON: '',
      caption: '',
    };
    return defaultContent;
  }


  saveComponent () {
    if(this.props.mode == 'edit'){
      if(this.refs.dropTargetCanvas.decoratedComponentInstance.saveComponent){
        this.refs.dropTargetCanvas.decoratedComponentInstance.saveComponent();
      }
    }
  }


  componentDidMount () {
    if (this.props.mode == 'view') {
      this.setSvg(this.props.content.svg_string);
    }
  }

  componentDidUpdate () {
    if (this.props.mode == 'view') {
      this.setSvg(this.props.content.svg_string);
    }
  }

  setSvg (svg_str) {
    let domNode = findDOMNode(this.refs.canvasSvgRenderArea);
    domNode.innerHTML = svg_str;
    $($(domNode)[0].lastChild).css({ width: "100%", height : "100%", 'max-width': this.props.content.width });
  }


  render(){
    const readOnly = (this.props.mode != 'edit');

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if(readOnly){
      let canvasCaption = "";
      if (this.props.content.caption) {
        canvasCaption = this.props.content.caption;
      }
      const captionComponent = <CaptionComponent caption={canvasCaption} onCaptionChange={this.onCaptionChange}
                                               readOnly={readOnly}/>;
      return (
        <div style={{textAlign:compAlign}}>
          <div key='canvas-wrapper-view' className='canvas-wrapper'>
            <div ref='canvasSvgRenderArea' className='canvas-svg-viewmode'></div>
            {captionComponent}
          </div>
        </div>
      );
    } else {
      return <CanvasComponentInternal ref='dropTargetCanvas' {...this.props} />
    }
  }
}

// Canvas.propTypes = {
//   mode: React.PropTypes.object.isRequired,
//   content: {
//     width: React.PropTypes.number,
//     height: React.PropTypes.number,
//     objectsDict: React.PropTypes.object.isRequired
//   }
// }

// export default Canvas;

