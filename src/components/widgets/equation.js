import React from 'react'
import {findDOMNode} from 'react-dom';
import {FormControl} from 'react-bootstrap';

const katex = require('katex');

class EquationComponent extends React.Component {

  static getComponentDefault = function () {
    const defaultContent = {
      version: '1.0',
      caption: '',
      size: '3',
      eqContent: 'c = \\pm\\sqrt{a^2 + b^2}',
    };
    return defaultContent;
  };

  static propTypes = {
    mode: React.PropTypes.oneOf(['view', 'edit']).isRequired,

    content: React.PropTypes.shape({
      caption: React.PropTypes.string.isRequired,
      eqContent: React.PropTypes.string.isRequired,
    }),
  };

  constructor(props, context) {
    super(props, context);
    this.handleEqChange = this.handleEqChange.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);

    this.state = {
      eqContent: props.content.eqContent,
      size: props.content.size,
    };
  }

  componentDidMount() {
    this.renderEq();
  }

  componentDidUpdate() {
    this.renderEq();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      eqContent: nextProps.content.eqContent,
      size: nextProps.content.size,
    });
  }

  handleEqChange(event) {
    this.setState({eqContent:event.target.value});
  }

  onSizeChange(event) {
    this.setState({size:event.target.value});
  }

  renderEq() {
    if (this.state.eqContent) {
      try {
        katex.render(this.state.eqContent, findDOMNode(this.refs.eq));
      } catch (error) {
        findDOMNode(this.refs.eq).innerHTML = '<span class="text-danger">Invalid Equation</span>';
      }
    }
  }

  saveComponent() {
    this.props.updateContentState({
      eqContent:this.state.eqContent,
      size: this.state.size,
    });
  }

  render() {
    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    const eqRenderArea = this.state.eqContent ? (
      <div ref="eq"></div>
    ) : null;
    let equationContent = null;
    switch (parseInt(this.state.size)) {
      case 1:
        equationContent = <h1 style={{margin:0}}>{eqRenderArea}</h1>;
        break;

      case 2:
        equationContent = <h2 style={{margin:0}}>{eqRenderArea}</h2>;
        break;

      case 3:
        equationContent = <h3 style={{margin:0}}>{eqRenderArea}</h3>;
        break;

      case 4:
        equationContent = <h4 style={{margin:0}}>{eqRenderArea}</h4>;
        break;

      case 5:
        equationContent = <h5 style={{margin:0}}>{eqRenderArea}</h5>;
        break;

      case 6:
        equationContent = <h6 style={{margin:0}}>{eqRenderArea}</h6>;
        break;

      default:
        equationContent = <h3 style={{margin:0}}>{eqRenderArea}</h3>;
    }


    return (
      <div style={{ overflow: 'auto' }}>
        {this.props.mode === 'edit' ? (
          <div className='edcomp-toolbar'>
            <div style={{padding:1}}>
              <span style={{marginLeft:5, marginRight:5}}>Size:</span>
              <FormControl
                className='input-sm fg-black75'
                style={{display:'inline-block',width:60}}
                componentClass='select'
                value={this.state.size}
                onChange={this.onSizeChange}>
                <option value="1">h1</option>
                <option value="2">h2</option>
                <option value="3">h3</option>
                <option value="4">h4</option>
                <option value="5">h5</option>
                <option value="6">h6</option>
              </FormControl>
            </div>
          </div>
        ) : null}

        <div style={{textAlign:compAlign}} className='fg-black75'>
          {this.props.mode === 'edit' ? (
            <div className="form-group">
              <textarea className="form-control" rows="2" value={this.state.eqContent}
                        onChange={this.handleEqChange}></textarea>
            </div>
          ) : null}

          {equationContent}
        </div>
      </div>
    );
  }
}

module.exports = EquationComponent;
