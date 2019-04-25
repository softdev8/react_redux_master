import styles from './SequenceDiagrams.module.scss'
import SequenceDiagramsType from './SequenceDiagramsType'
import React from 'react'
import {findDOMNode} from 'react-dom';
import * as widgetUtil from '../../helpers/widgetUtil';
import {SomethingWithIcon, Icons} from '../../index';
import {Grid, Col, Row} from 'react-bootstrap';
import scriptLoader from 'react-async-script-loader'

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');
const CodeMirrorEditor = require('../../helpers/codeeditor');
const Button = require('../../common/Button');

const default_svg_string = '<?xml version="1.0" encoding="utf-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="461" height="317" xmlns:xlink="http://www.w3.org/1999/xlink"><source><![CDATA[Andrew->China: Says Hello Note right of China: China thinks China-->Andrew: How are you? Andrew->>China: I am good thanks!]]></source><desc></desc><defs><marker viewBox="0 0 5 5" markerWidth="5" markerHeight="5" orient="auto" refX="5" refY="2.5" id="markerArrowBlock"><path d="M 0 0 L 5 2.5 L 0 5 z"></path></marker><marker viewBox="0 0 9.6 16" markerWidth="4" markerHeight="16" orient="auto" refX="9.6" refY="8" id="markerArrowOpen"><path d="M 9.6,8 1.92,16 0,13.7 5.76,8 0,2.286 1.92,0 9.6,8 z"></path></marker></defs><g class="title"></g><g class="actor"><rect x="10" y="20" width="77.609375" height="38" stroke="#000000" fill="#ffffff" style="stroke-width: 2;"></rect><text x="20" y="45" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="20">Andrew</tspan></text></g><g class="actor"><rect x="10" y="259.84375" width="77.609375" height="38" stroke="#000000" fill="#ffffff" style="stroke-width: 2;"></rect><text x="20" y="284.84375" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="20">Andrew</tspan></text></g><line x1="48.8046875" x2="48.8046875" y1="58" y2="259.84375" stroke="#000000" fill="none" style="stroke-width: 2;"></line><g class="actor"><rect x="198.0234375" y="20" width="68" height="38" stroke="#000000" fill="#ffffff" style="stroke-width: 2;"></rect><text x="208.0234375" y="45" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="208.0234375">China</tspan></text></g><g class="actor"><rect x="198.0234375" y="259.84375" width="68" height="38" stroke="#000000" fill="#ffffff" style="stroke-width: 2;"></rect><text x="208.0234375" y="284.84375" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="208.0234375">China</tspan></text></g><line x1="232.0234375" x2="232.0234375" y1="58" y2="259.84375" stroke="#000000" fill="none" style="stroke-width: 2;"></line><g class="signal"><text x="92.40625" y="88.890625" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="92.40625">Says Hello</tspan></text><line x1="48.8046875" x2="232.0234375" y1="96.21875" y2="96.21875" stroke="#000000" fill="none" style="stroke-width: 2; marker-end: url(&quot;#markerArrowBlock&quot;);"></line></g><g class="note"><rect x="252.0234375" y="116.21875" width="125.21875" height="47.1875" stroke="#000000" fill="#ffffff" style="stroke-width: 2;"></rect><text x="257.0234375" y="136.21875" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="257.0234375">China thinks</tspan><tspan dy="1.2em" x="257.0234375"></tspan></text></g><g class="signal"><text x="82.8046875" y="194.296875" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="82.8046875">How are you?</tspan></text><line x1="232.0234375" x2="48.8046875" y1="201.625" y2="201.625" stroke="#000000" fill="none" style="stroke-width: 2; stroke-dasharray: 6, 2; marker-end: url(&quot;#markerArrowBlock&quot;);"></line></g><g class="signal"><text x="58.8046875" y="232.515625" style="font-size: 16px; font-family: &quot;Andale Mono&quot;, monospace;"><tspan x="58.8046875">I am good thanks!</tspan></text><line x1="48.8046875" x2="232.0234375" y1="239.84375" y2="239.84375" stroke="#000000" fill="none" style="stroke-width: 2; marker-end: url(&quot;#markerArrowOpen&quot;);"></line></g></svg>';
const default_sequence_text = "Andrew->China: Says Hello\nNote right of China: China thinks\nChina-->Andrew: How are you?\nAndrew->>China: I am good thanks!";
const default_diagram_type = 'simple'
const editor_div = 'web-sequence-diagram-editor-div'
const diagram_types = [{
    type: 'simple',
    title: 'Simple',
  }, {
    type: 'hand',
    title: 'Hand drawn'
  }]

class SequenceDiagrams extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      caption: props.content.caption ? props.content.caption : "",
      text: props.content.text,
      svg_string: props.content.svg_string,
      diagram_type: props.content.diagram_type,
      hasModified: false,
      errMessage: '',
      render: true
    };

    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.updateDiagram = this.updateDiagram.bind(this);
    this.handleDiagramType = this.handleDiagramType.bind(this);
  }

  componentDidMount() {
    this.drawDiagram()
  }

  componentDidUpdate() {
    this.drawDiagram()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.shallowCompare(this, nextProps, nextState);
  }

  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
    return true;
  }

  shallowCompare(instance, nextProps, nextState) {
    return (
      !this.shallowEqual(instance.props, nextProps) ||
      !this.shallowEqual(instance.state, nextState)
    );
  }

  drawDiagram() {
    findDOMNode(this.refs.sequencePreviewArea).innerHTML = '';
    findDOMNode(this.refs.sequencePreviewArea).innerHTML = this.state.svg_string;
  }

  updateDiagram() {
    if (this.state.errMessage == '') {
        this.drawDiagram()
    }
    this.setState({
      render: !this.state.render
    })
  }

  getDiagramTitle(type) {
    for(let i = 0; i < diagram_types.length; i++) {
      if (diagram_types[i].type == type)
        return diagram_types[i].title;
    }
  }
  handleDiagramType(type) {
    this.state.diagram_type = type
    this.generateSvgFromSequenceDiagram();
  }

  handleCaptionChange(caption) {
    this.state.caption = caption
  }

  handleEditorChange(editor) {
    this.state.text = editor
    this.generateSvgFromSequenceDiagram();
  }

  generateSvgFromSequenceDiagram() {
    if (!this.props.isScriptLoadSucceed || !this.props.isScriptLoaded) {
      return;
    }

    widgetUtil.generateSvgFromSequenceDiagram(this.state.text, this.state.diagram_type, editor_div, (result) => {
      if (result.err) {
        this.state.errMessage = result.errMessae;
        this.state.hasModified = true
      }
      else {
        this.state.errMessage = ''
        this.state.svg_string = result.svg_string
      }
    });
  }

  saveComponent() {
    findDOMNode(this.refs.sequencePreviewArea).innerHTML = '';
    this.updateSvg();
    this.props.updateContentState({
      caption: this.state.caption,
      text: this.state.text,
      svg_string: this.state.svg_string,
      diagram_type: this.state.diagram_type
    });
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

    if (readOnly) {
      return (
        <div>
          <div style={{textAlign:compAlign}} ref='sequencePreviewArea' className='diagramPreviewArea'></div>
          {captionComponent}
        </div>
      );
    }

    // Edit mode
    const activeCodeContent = {content: this.state.text, language: 'markdown', theme: 'eclipse'};

    const preview = ( this.state.errMessage == "") ? (
      <Col lg={ 6 }>
        <div className={styles.title_area}>
        <span className={styles.title}> UML Sequence Diagram </span>
          <Button className={styles.button} onClick={this.updateDiagram} bsSize="xsmall">Update</Button>
        </div>
        <div style={{textAlign:compAlign}} ref='sequencePreviewArea' className='diagramPreviewArea'></div>
      </Col>
    ) : (<Col lg={ 6 }>
        <div className={styles.title_area}>
        <span className={styles.title}> UML Sequence Diagram </span>
          <Button className={styles.button} onClick={this.updateDiagram} bsSize="xsmall">Update</Button>
        </div>
        <div style={{textAlign:compAlign}} ref='sequencePreviewArea' className='diagramPreviewArea' hidden></div>
      </Col>
    )

    const errMessage = (this.state.errMessage != '' ) && (
      <div className={styles.error}>
          {this.state.errMessage}
      </div>
    )
    return (
      <div>
        <div id={editor_div} style={{position: 'absolute', top: '-10000px'}}></div>
        <Row>
          <Col lg={6}>
            <div>
              <div className={styles.title_area}>
                <span className={styles.title}>Sequence Diagram Text</span>
              </div>
              <CodeMirrorEditor
                key='editor'
                codeContent={activeCodeContent}
                readOnly={false}
                onEditorChange={this.handleEditorChange}
                codeMirrorStyle={'cmcomp-editor-container-graphviz'}/>
              <SequenceDiagramsType
                handleDiagramType={this.handleDiagramType}
                diagram_types={diagram_types}
                diagram_type={this.state.diagram_type}
              />

            </div>
          </Col>
          {preview}
        </Row>
        {errMessage}
        {captionComponent}
      </div>
    );
  }
}

SequenceDiagrams.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    text: default_sequence_text,
    svg_string: default_svg_string,
    diagram_type: default_diagram_type,
  };
  return defaultContent;
};

const scripts = window.DEBUG ?
    [
      'http://localhost:4444/static/dist/js/vendor/sequence-diagram/webfont.js',
      'http://localhost:4444/static/dist/js/vendor/sequence-diagram/underscore-min.js',
      'http://localhost:4444/static/dist/js/vendor/sequence-diagram/snap.svg-min.js',
      'http://localhost:4444/static/dist/js/vendor/sequence-diagram/sequence-diagram-min.js',
     ] : [
      '/js/vendor/sequence-diagram/webfont.js',
      '/js/vendor/sequence-diagram/underscore-min.js',
      '/js/vendor/sequence-diagram/snap.svg-min.js',
      '/js/vendor/sequence-diagram/sequence-diagram-min.js',
     ];

export default scriptLoader(
    ...scripts
)(SequenceDiagrams);
