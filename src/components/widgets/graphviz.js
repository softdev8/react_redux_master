import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../helpers/widgetUtil';

const CaptionComponent = require('../CaptionComponent/CaptionComponent');
const CodeMirrorEditor = require('../helpers/codeeditor');

const Button = require('../common/Button');
import {SomethingWithIcon, Icons} from '../index';

import {Grid, Col, Row} from 'react-bootstrap';

const default_svg_string = '<svg width=\"89pt\" height=\"188pt\" viewBox=\"0.00 0.00 89.00 188.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 184)\"> <title>g<\/title> <!-- a --> <g id=\"node1\" class=\"node\"><title>a<\/title> <ellipse fill=\"none\" stroke=\"black\" cx=\"54\" cy=\"-162\" rx=\"27\" ry=\"18\"><\/ellipse> <text text-anchor=\"middle\" x=\"54\" y=\"-157.8\" font-family=\"Times,serif\" font-size=\"14.00\">a<\/text> <\/g> <!-- b --> <g id=\"node2\" class=\"node\"><title>b<\/title> <ellipse fill=\"none\" stroke=\"black\" cx=\"27\" cy=\"-90\" rx=\"27\" ry=\"18\"><\/ellipse> <text text-anchor=\"middle\" x=\"27\" y=\"-85.8\" font-family=\"Times,serif\" font-size=\"14.00\">b<\/text> <\/g> <!-- a&#45;&gt;b --> <g id=\"edge1\" class=\"edge\"><title>a-&gt;b<\/title> <path fill=\"none\" stroke=\"black\" d=\"M47.6014,-144.411C44.4864,-136.335 40.6663,-126.431 37.1654,-117.355\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"40.4045,-116.027 33.5403,-107.956 33.8735,-118.546 40.4045,-116.027\"><\/polygon> <\/g> <!-- c --> <g id=\"node3\" class=\"node\"><title>c<\/title> <ellipse fill=\"none\" stroke=\"black\" cx=\"54\" cy=\"-18\" rx=\"27\" ry=\"18\"><\/ellipse> <text text-anchor=\"middle\" x=\"54\" y=\"-13.8\" font-family=\"Times,serif\" font-size=\"14.00\">c<\/text> <\/g> <!-- b&#45;&gt;c --> <g id=\"edge2\" class=\"edge\"><title>b-&gt;c<\/title> <path fill=\"none\" stroke=\"black\" d=\"M33.3986,-72.411C36.5136,-64.3352 40.3337,-54.4312 43.8346,-45.3547\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"47.1265,-46.5458 47.4597,-35.9562 40.5955,-44.0267 47.1265,-46.5458\"><\/polygon> <\/g> <!-- c&#45;&gt;a --> <g id=\"edge3\" class=\"edge\"><title>c-&gt;a<\/title> <path fill=\"none\" stroke=\"black\" d=\"M57.6538,-36.0925C59.6758,-46.4315 61.9808,-59.9098 63,-72 64.3441,-87.9434 64.3441,-92.0566 63,-108 62.2834,-116.501 60.9311,-125.688 59.4884,-133.988\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"56.0309,-133.438 57.6538,-143.908 62.9142,-134.711 56.0309,-133.438\"><\/polygon> <\/g> <\/g> <\/svg>';
const default_graphviz_text = "digraph g {\r\n    bgcolor=\"transparent\"\r\n    a -> b\r\n    b -> c\r\n    c -> a\r\n}";

class GraphVizComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);

    this.state = {
      caption: props.content.caption ? props.content.caption : "",
      text: props.content.text,
      svg_string: props.content.svg_string,
      hasModified: false,
    };
  }

  componentDidMount() {
    if (this.props.mode == "edit") {
      this.updateSvg();
      findDOMNode(this.refs.graphvizPreviewArea).innerHTML = this.props.content.svg_string;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.caption = nextProps.content.caption;
    this.state.text = nextProps.content.text;
    this.state.svg_string = nextProps.content.svg_string;
  }

  componentDidUpdate() {
    if (this.props.mode == "edit") {
      this.updateSvg();
      findDOMNode(this.refs.graphvizPreviewArea).innerHTML = this.props.content.svg_string;
    }
  }

  generateSvgString() {
    return widgetUtil.generateSvgFromGraphviz(this.state.text);
  }

  handleCaptionChange(caption) {
    this.state.caption = caption;
  }

  handleEditorChange(editor) {
    //TODO: improve by diffing the contents.
    this.state.text = editor;
    this.state.hasModified = true;
  }

  handlePreview() {
    this.updateSvg();
  }

  saveComponent() {
    this.updateSvg();
    this.props.updateContentState({
      caption: this.state.caption,
      text: this.state.text,
      svg_string: this.state.svg_string,
    });

    //This is done only when graphviz component is hosted in a canvas view
    if(this.props.contentStateFinalized){
      this.props.contentStateFinalized();
    }
  }

  updateStates() {
    this.props.updateContentState({
      caption: this.state.caption,
      text: this.state.text,
      svg_string: this.state.svg_string,
    });
  }

  updateSvg() {
    if (!this.state.svg_string || this.state.hasModified) {
      this.state.svg_string = this.generateSvgString();
      this.updateStates();
    }
    this.state.hasModified = false;
  }

  render() {
    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    const readOnly = (this.props.mode != 'edit');
    let captionComponent = null;
    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.state.caption}
        readOnly={readOnly}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    const activeCodeContent = {content: this.state.text, language: 'haskell', theme: 'eclipse'};

    if (readOnly) {
      let tempHtml = {__html: this.props.content.svg_string};
      let width = widgetUtil.parseSvgWidth(this.props.content.svg_string);
      let displayGV = <div ref='dsRender' className='ed-ds-view'
                        dangerouslySetInnerHTML={tempHtml}
                        style={{display:'block', maxWidth:width, margin: widgetUtil.getMargin(compAlign)}}/>
      return (
        <div>
          <div style={{textAlign:compAlign}}>
            <div style={{display:'block'}}>
              {displayGV}
            </div>
          </div>
          {captionComponent}
        </div>
      );
    }

    // Edit mode
    return (
      <div>
        <Row>
          <Col lg={6}>
            <CodeMirrorEditor
              key='editor'
              codeContent={activeCodeContent}
              readOnly={false}
              onEditorChange={this.handleEditorChange}
              codeMirrorStyle={'cmcomp-editor-container-graphviz'}/>

            <div style={{margin:10}}>
              <Button outlined onlyOnHover bsStyle='primary' className='fav-btn' style={{margin: 3}} active={false}
                      onClick={this.handlePreview} onTouchEnd={this.handlePreview}>
                <SomethingWithIcon icon={Icons.eyeIcon}/>
                <span className='counts'>&nbsp;Preview</span>
              </Button>
            </div>
          </Col>
          <Col lg={6}>
            <div style={{textAlign:compAlign}} ref='graphvizPreviewArea' className='graphvizPreviewArea'></div>
          </Col>
        </Row>
        {captionComponent}
      </div>
    );
  }
}

GraphVizComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    text: default_graphviz_text,
    svg_string: default_svg_string,
  };
  return defaultContent;
};

module.exports = GraphVizComponent;
