import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

import styles from './InputWithLabel.module.scss';

export default class LabelledInput extends Component {

  static PropTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    help: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    groupClass: PropTypes.string,
    isError: PropTypes.bool
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
    if(nextProps.value !== this.state.value && !nextProps.isError) {
      this.setState({
        value : nextProps.value,
      });
    }
  }

  handleChange() {
    this.setState({
      value: findDOMNode(this.inputRef).value,
    });
  }

  getValue() {
    return this.state.value;
  }

  renderLabel() {
    const { label, help } = this.props;

    return (
      <span className={styles['label-inn']}>
        <span className={styles['label-text']}>{ label }</span>
        <span className={styles['label-help']}>{ help }</span>
      </span>
    );
  }

  renderControl() {
    const {placeholder, type} = this.props;

    const styles = this.props.validate ? this.props.styleValidate : {};

    return <FormControl
        ref={(node) => this.inputRef = node}
        componentClass={type === "textarea" ? "textarea" : "input"}
        type={type}
        placeholder={placeholder}
        onChange={this.handleChange.bind(this)}
        value={this.state.value || ''}
        onBlur={this.props.handleBlur}
        onFocus={this.props.handleFocus}
        style={ styles }
        name={this.props.name}
        disabled={this.props.disabled}
      />
  }

  render() {
    const styles = {};
    if (this.props.isError) {
      styles.border = '1px solid rgba(244,137,77,.7)';
    }

    return (
      <FormGroup bsClass="form-group form-group-lg b-input-with-label" style={styles}>
        <ControlLabel>{this.renderLabel()}</ControlLabel>
        { this.props.children ? this.props.children : this.renderControl() }
      </FormGroup>
    );
  }
}
