import React from 'react'
import {findDOMNode} from 'react-dom';

//------------------------------------------------------------------------------
// SVG EDIT COMPONENT
//------------------------------------------------------------------------------

class SVGEditNonModalComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleSvgData = this.handleSvgData.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == 'view')
      return;

    const self = this;

    self.dialogFrame = findDOMNode(this.refs.dialogFrame);
    self.svgCanvas = new embedded_svg_edit(self.dialogFrame);

    const onloadFunc = function () {
      self.svgCanvas = new embedded_svg_edit(self.dialogFrame);
      self.svgCanvas.setSvgString(self.props.content.svg_string);
    };
    if (self.dialogFrame.attachEvent) {
      self.dialogFrame.attachEvent('onload', onloadFunc);
    } else {
      self.dialogFrame.onload = onloadFunc;
    }
  }

  handleSvgData(data, error) {
    if (error) {
      alert('error: can not get svg data');
    } else {
      this.props.updateContentState({svg_string: data});
      this.props.contentStateFinalized();
    }
  }

  saveComponent() {
    if (this.svgCanvas) {
      this.svgCanvas.getSvgString()(this.handleSvgData);
    }
  }

  render() {
    const readOnly = (this.props.mode != 'edit');

    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if (readOnly) {
      return (
        <div className="svg-edit-comp view-mode" style={{textAlign:compAlign}}>
          <div className="svg-image-container">
            <img src={`data:image/svg+xml;base64,${new Buffer(this.props.content.svg_string).toString('base64')}`}
                 style={svg_style}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="svg-edit-comp edit-mode">
          <div className="svg-edit-dialog" ref="dialogContainer">
            <iframe src="/method-draw/index.html" width="100%" height="600px" ref="dialogFrame"/>
          </div>
        </div>
      );
    }
  }
}

SVGEditNonModalComponent.getComponentCustom = function (svg_string) {
  const customContent = {
    version: '1.0',
    caption: '',
    width: 600,
    height: 600,
    svg_string,
  };
  return customContent;
};

SVGEditNonModalComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    width: 600,
    height: 600,
    svg_string: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"> </svg>',
  };
  return defaultContent;
};

module.exports = SVGEditNonModalComponent;
