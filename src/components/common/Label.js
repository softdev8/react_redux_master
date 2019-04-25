import React from 'react'
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';

const ColMixin = require('./ColMixin');

const Label = React.createClass({
  propTypes: {
    inline: React.PropTypes.bool,
    control: React.PropTypes.bool,
  },

  mixins: [ColMixin],

  getLabelDOMNode() {
    return findDOMNode(this.refs.label);
  },

  render() {
    this.preRender();
    const classes = classnames({
      'control-label': this.props.control,
      inline: this.props.inline,
    });
    this.classes += ` ${classes}`;

    var props = {
      ...this.props,
      ...{
        ref: 'label',
        hidden: null,
        className: [this.props.className, this.classes].join(' '),
      },
    };

    return (
      <label {...props}>
        {this.props.children}
      </label>
    );
  },
});

module.exports = Label;
