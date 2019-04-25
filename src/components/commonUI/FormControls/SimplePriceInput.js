import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import styles from './InputWithLabel.module.scss';

import SimpleLabelledInput from './SimpleLabelledInput';

export default class SimplePriceInput extends Component {

  static PropTypes = {
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    groupClass: PropTypes.string
  };

  constructor(props) {
    super(...arguments);
  }

  getValue() {
    return this.inputRef.getValue();
  }

  beforeBlurFormatter(raw) {
    return this.getFormattedPrice(raw, true);
  }

  beforeChangeFormatter(raw) {
    return this.getFormattedPrice(raw, false);
  }

  getFormattedPrice(price_s, enforceValueCorrection){
    if ((price_s == null) || (price_s == "")) {
      return '';
    }

    const price = parseInt(price_s.replace(/[^0-9]/g, ''));

    if (isNaN(price)) return;

    if (enforceValueCorrection) {
      if (price === 1) return 2;
      else if (price > this.props.maxPrice) return this.props.maxPrice;
      else if (price < this.props.minPrice) return this.props.minPrice;
    }

    return price;
  }

  render() {
    return (
      <SimpleLabelledInput
        className='dp-numberinput dp-numberinput-article form-control'
        groupClass={this.props.groupClass}
        placeholder={this.props.placeholder}
        label={this.props.label}
        value={this.props.value}
        ref={node => this.inputRef = node}
        disabled={this.props.disabled}
        beforeChangeFormatter={this.beforeChangeFormatter.bind(this)}
        beforeBlurFormatter={this.beforeBlurFormatter.bind(this)}
        handleBlur={this.props.onBlur}
        name={this.props.name}
      />
    );
  }
}
