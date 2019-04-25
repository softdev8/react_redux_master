import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

import styles from './InputWithLabel.module.scss';

export default class SimpleLabelledInput extends Component {

  static PropTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    styleValidate: PropTypes.object,
    name: PropTypes.string,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(...arguments);

    const { value = '' } = props;

    this.state = {
      value,
      isFocused: false,
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== undefined && nextProps.value !== this.state.value) {
      this.setState({
        value : nextProps.value,
      });
    }
  }

  handleChange() {
    const raw = findDOMNode(this.inputRef).value;
    const oldValue = this.state.value;
    const value = this.props.beforeChangeFormatter ? this.props.beforeChangeFormatter(raw) : raw;

    this.setState({
      value: value === undefined ? oldValue : value
    });
  }

  handleBlur(e) {
    let value;

    if (this.props.beforeBlurFormatter) {
      value = this.props.beforeBlurFormatter(findDOMNode(this.inputRef).value);

      this.setState({
        value
      });
    }

    if (this.props.handleBlur) {
      if (value) e.target.value = value;
      this.props.handleBlur(e);
    }
  }

  getValue() {
    return this.state.value;
  }

  renderControl() {
    const {placeholder, type} = this.props;

    return <FormControl
      bsClass={this.props.className}
      ref={(node) => this.inputRef = node}
      type={type}
      placeholder={placeholder}
      onChange={this.handleChange.bind(this)}
      value={this.state.value}
      onBlur={this.handleBlur.bind(this)}
      onFocus={this.props.handleFocus}
      style={ this.props.validate ? this.props.styleValidate : {}}
      name={this.props.name}
      disabled={this.props.disabled}
    />
  }

  render() {

    if (!this.props.label) {
      return this.renderControl();
    }

    const groupClass = this.props.groupClass ? this.props.groupClass : 'form-group b-input-with-label_simple';

    return (
      <FormGroup bsClass={groupClass}>
        <ControlLabel>{this.props.label}</ControlLabel>
        {this.renderControl()}
      </FormGroup>
    );
  }
}
