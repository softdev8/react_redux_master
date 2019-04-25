import React from 'react'
import {findDOMNode} from 'react-dom';
const Label = require('./Label.js');
const Input = require('./Input.js');

import classnames from 'classnames';

const CRMixin = {
  propTypes: {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    inline: React.PropTypes.bool,
    defaultChecked: React.PropTypes.bool,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false,
      defaultChecked: false,
    };
  },

  getChecked() {
    return this.refs.input.getChecked();
  },

  setChecked(value) {
    this.refs.input.setChecked(value);
  },

  isChecked() {
    return this.getChecked() === true;
  },

  getValue() {
    return findDOMNode(this.refs.span).innerText;
  },

  preRender(type) {
    if(type !== 'radio' && type !== 'checkbox')
      throw Error('radio or checkbox required');

    const classes_obj = {
      disabled: this.props.disabled,
    };
    classes_obj[type] = true;
    const classes = classnames(classes_obj);

    const inputProps = {
      ...this.props,
      ...{
        ref: 'input',
        type,
        value: this.props.value,
        name: this.props.name,
        id: this.props.id,
        disabled: this.props.disabled,
        defaultChecked: this.props.defaultChecked,
      },
    };

    const input = <Input {...inputProps}/>;

    if(this.props.native)
      return input;

    const combined = <div>{input}<span ref='span'>{this.props.children}</span></div>;

    if(this.props.inline) {
      const labelProps = {
        ...this.props,
        ...{
          className: [this.props.className, `${type}-inline`].join(' '),
        },
      };

      return (
        <Label {...labelProps}>
          {combined}
        </Label>
      );
    }

    return (
      <div className={classes}>
        <Label>
          {combined}
        </Label>
      </div>
    );
  },
};

const Checkbox = React.createClass({
  mixins: [CRMixin],

  render() {
    return this.preRender('checkbox');
  },
});

module.exports = Checkbox;
