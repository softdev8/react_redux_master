import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { FormControl } from 'react-bootstrap';


export default class HighlightLines extends Component {

  static propTypes = {
    value: PropTypes.string,
    onChangeLines: PropTypes.func.isRequired
  };

  constructor() {
    super(...arguments);

    this.state = {
      isEditing: false
    }
  }

  changeToEditMode(e) {
    e.preventDefault();

    this.setState({
      isEditing: true
    });
  }

  onBlur() {
    this.setState({
      isEditing: false
    });
    this.props.onChangeLines(...arguments);
  }

  renderEditMode() {
    return (
      <FormControl
        placeholder="Enter line ranges to highlight                                                                                                                            1                                                                                                                                                                         5 9"
        rows="3"
        cols="25"
        ref={node => this.controlRef = node}
        componentClass="textarea"
        defaultValue={this.props.value}
        onBlur={this.onBlur.bind(this)}
      />
    );
  }

  renderReadMode() {
    return (
      <a onClick={this.changeToEditMode.bind(this)}>Highlight lines</a>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isEditing) {
      const control = findDOMNode(this.controlRef);

      control.focus();
    }
  }

  render() {
    return (
      <div style={{ display: 'inline-flex', marginRight: 15}}>
        { this.state.isEditing ? this.renderEditMode() : this.renderReadMode() }
      </div>
    );
  }
}