import React from 'react'
import { findDOMNode } from 'react-dom';

const CaptionComponent = require('../CaptionComponent/CaptionComponent');

import PureComponent from 'react-pure-render/component'
import {Modal, ModalHeader, ModalBody} from '../common/Modal';
import {FormControl} from 'react-bootstrap';
import {SomethingWithIcon, Icons} from '../index';

const SvgEditModal = require('../helpers/svgEditModal');
const Button = require('../common/Button');
const ModalManager = require('../common/ModalManager');

//------------------------------------------------------------------------------
// SVG EDIT COMPONENT
//------------------------------------------------------------------------------

class SVGEditComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSvgData = this.handleSvgData.bind(this);
    this.onCaptionChange = this.onCaptionChange.bind(this);
    this.onHeightChange = this.onHeightChange.bind(this);
    this.onWidthChange = this.onWidthChange.bind(this);
  }

  componentDidMount() {
    this.updateSize();
  }

  componentDidUpdate() {
    this.updateSize();
  }

  updateSize() {
    if (this.props.mode === 'edit') {
      findDOMNode(this.heightInputRef).value= this.props.content.height;
      findDOMNode(this.widthInputRef).value= this.props.content.width;
    }
  }

  handleSvgData(data, error) {
    if (error) {
      alert('error: can not get svg data');
    } else {
      this.props.updateContentState({svg_string:data});
    }
    ModalManager.remove();
  }

  onCaptionChange(caption) {
    this.props.updateContentState({caption});
  }

  onCloseClick() {
    ModalManager.remove();
  }

  onHeightChange(event) {
    this.props.updateContentState({height: event.target.value});
  }

  onWidthChange(event) {
    this.props.updateContentState({width: event.target.value});
  }

  render() {
    const readOnly = (this.props.mode != 'edit');

    let captionComponent = null;

    if (this.props.disableCaption == null || this.props.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={readOnly}
        onCaptionChange={this.onCaptionChange}/>;
    }

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    const svg_style = {
      width: `${this.props.content.width}px`,
      height: `${this.props.content.height}px`,
    };

    if (readOnly) {
      return (
        <div className="svg-edit-comp view-mode" style={{textAlign:compAlign}}>
          <div className="svg-image-container">
            <img src={`data:image/svg+xml;base64,${new Buffer(this.props.content.svg_string).toString('base64')}`}
                 style={svg_style}/>
          </div>
          {captionComponent}
        </div>
      );
    } else {
      const handleSvgData = this.handleSvgData;
      var svg_string = this.props.content.svg_string;
      class MyModal extends PureComponent {
        constructor(){
          super()
          this.open = this.open.bind(this);
        }
        open(){
          this.componentRef.openModal();
        }
        render(){
          return <SvgEditModal ref={node => this.componentRef = node} handleSvgData={handleSvgData} svg_string={svg_string}/>;
        }
      }

      return (
        <div className="svg-edit-comp edit-mode">
          <div className='edcomp-toolbar'>
            <div style={{padding:1}}>
              <span style={{marginLeft:5}}>Width:</span>
              <FormControl ref={node => this.widthInputRef = node} style={{marginLeft:8, width:'50px', display:'inline', paddingLeft:3, paddingRight: 3}}
                     onBlur={this.onWidthChange}/>
              <span style={{marginLeft:5}}>Height:</span>
              <FormControl ref={node => this.heightInputRef = node} style={{marginLeft:8, width:'50px', display:'inline', paddingLeft:3, paddingRight: 3}}
                     onBlur={this.onHeightChange}/>
              <Button style={{marginLeft:15, float:'right'}} sm outlined bsStyle='darkgreen45'
                      onClick={ModalManager.create.bind(this, MyModal)}>
                <SomethingWithIcon icon={Icons.paintBrushIcon}/>
                Modify Drawing
              </Button>
            </div>
          </div>
          <div style={{textAlign:compAlign}}>
            <div className="svg-image-container">
              <img src={`data:image/svg+xml;base64,${new Buffer(this.props.content.svg_string).toString('base64')}`}
                   style={svg_style}/>
            </div>
          </div>
          {captionComponent}
        </div>
      );
    }
  }
}

SVGEditComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    width: 600,
    height: 600,
    svg_string: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"> </svg>',
  };
  return defaultContent;
};

module.exports = SVGEditComponent;
