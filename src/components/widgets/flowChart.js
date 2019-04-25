import React from 'react'
import {findDOMNode} from 'react-dom';
const TextArea = require('../common/TextArea');

import {Grid, Col, Row} from 'react-bootstrap';

const flowDescriptionString = 'st=>start: Start:>http://www.google.com[blank]\ne=>end:>http://www.google.com\nop1=>operation: My Operation\nsub1=>subroutine: My Subroutine\ncond=>condition: Yes \nor No?:>http://www.google.com\nio=>inputoutput: catch something...\n\nst->op1->cond\ncond(yes)->io->e\ncond(no)->sub1(right)->op1';


class FlowchartComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.state = {content: props.content, editor: null};
  }

  componentDidMount() {
    if (this.props.mode == "edit") {
      this.state.editor = CodeMirror.fromTextArea(
        findDOMNode(this.refs.flowDescriptionCodeEditor),
        {
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          theme: 'default',
        },
      );
      this.state.editor.on('change', this.handleEditorChange);
    }

    this.renderSeqDiagram();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.content !== nextProps.content || this.props.mode !== nextProps.mode
      || this.props.pageProperties !== nextProps.pageProperties;
  }

  componentDidUpdate() {
    if (this.props.mode == "edit") {
      if (this.state.editor == null) {
        this.state.editor = CodeMirror.fromTextArea(
          findDOMNode(this.refs.flowDescriptionCodeEditor),
          {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            theme: 'default',
          },
        );
        this.state.editor.on('change', this.handleEditorChange);
      }
    }
    else {
      this.state.editor = null;
    }

    this.renderSeqDiagram();
  }

  //handlePreview: function(event){
  //    this.renderSeqDiagram();
  //},
  handleChange(event) {
    this.state.content.flowDescription = event.target.value;
    this.forceUpdate();
  }

  handleEditorChange(editor, changeObj) {
    const newContent = editor.getValue();
    this.state.content.flowDescription = newContent;
    this.forceUpdate();

  }

  renderSeqDiagram() {
    if (this.state.content.flowDescription) {
      try {
        //findDOMNode(this.refs.canvas).innerHTML = '';

        if (this.dia) {
          this.dia.clean();
        }

        const options = {x: 0, y: 0};
        this.dia = flowchart.parse(this.state.content.flowDescription);
        this.dia.drawSVG(findDOMNode(this.refs.canvas), options);
      } catch (error) {
        console.log(error);
        findDOMNode(this.refs.canvas).innerHTML = error;
      }
    }
  }

  render() {
    let compAlign = 'left';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    const renderArea = <div style={{textAlign:compAlign}}>
      <div style={{overflow:'auto', width:'100%'}} ref="canvas"></div>
    </div>;

    if (this.props.mode === 'view') {
      return (
        <Row>
          <Col xs={12}>
            {renderArea}
          </Col>
        </Row>
      )
    } else {
      return (
        <div>
                        <TextArea ref='flowDescriptionCodeEditor'>
                          {this.state.content.flowDescription}
                        </TextArea>
          {renderArea}
        </div>
      )
    }
  }
}

FlowchartComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    style: 'simple',
    flowDescription: flowDescriptionString,
  };
  return defaultContent;
};

FlowchartComponent.propTypes = {
  content: React.PropTypes.shape({
    style: React.PropTypes.string,
    flowDescription: React.PropTypes.string,
  }),

  mode: React.PropTypes.oneOf(['view', 'edit']),
};

module.exports = FlowchartComponent;
