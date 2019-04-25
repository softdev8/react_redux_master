import React from 'react'
import {findDOMNode} from 'react-dom';
import {Grid, Col, Row} from 'react-bootstrap';

const sequenceDescription = 'Andrew->China: Says Hello\nNote right of China: China thinks about it\nChina-->Andrew: How are you?\nAndrew->>China: I am good thanks!';

class SequenceDiagramComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = {content: props.content};
  }

  componentDidMount() {
    this.renderSeqDiagram();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.content !== nextProps.content || this.props.mode !== nextProps.mode
      || this.props.pageProperties !== nextProps.pageProperties;
  }

  componentDidUpdate() {
    this.renderSeqDiagram();
  }

  //handlePreview: function(event){
  //    this.renderSeqDiagram();
  //},
  handleChange(event) {
    this.setState({sequenceDescription : event.target.value})
  }

  renderSeqDiagram() {
    if (this.state.content.sequenceDescription) {
      try {
        findDOMNode(this.refs.canvas).innerHTML = '';
        const options = {theme: this.state.content.style};
        this.dia = Diagram.parse(this.state.content.sequenceDescription);
        this.dia.drawSVG(findDOMNode(this.refs.canvas), options);
      } catch (error) {
        findDOMNode(this.refs.canvas).innerHTML = '<span class="text-danger">Invalid Sequence Description</span>';
      }
    }
  }

  render() {
    let compAlign = 'left';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    if (this.props.mode === 'view') {
      return (
        <Row>
          <Col xs={12}>
            <div ref="canvas" style={{textAlign:compAlign}}>
              <div></div>
            </div>
          </Col>
        </Row>
      )
    } else {
      return (
        <div>
          <div className="form-group">
            <textarea rows="10" className="form-control" onChange={this.handleChange}
                      value={this.state.content.sequenceDescription}></textarea>
          </div>

          <div style={{textAlign:compAlign}}>
            <div style={{overflow:'auto', width:'100%'}} ref="canvas"></div>
          </div>
        </div>
      )
    }
  }
}

SequenceDiagramComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    caption: '',
    style: 'simple',
    sequenceDescription,
  };
  return defaultContent;
};

SequenceDiagramComponent.propTypes = {
  content: React.PropTypes.shape({
    style: React.PropTypes.string,
    sequenceDescription: React.PropTypes.string,
  }),

  mode: React.PropTypes.oneOf(['view', 'edit']),
};

module.exports = SequenceDiagramComponent;
