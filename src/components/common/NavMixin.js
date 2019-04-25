import React from 'react'

import classnames from 'classnames';

const NavMixin = {
  propTypes: {
    left: React.PropTypes.bool,
    right: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      left: false,
      right: false,
    };
  },

  getInitialState() {
    return {
      children: [],
    };
  },

  classnames(obj) {
    obj['navbar-left'] = this.props.left;
    obj['navbar-right'] = this.props.right;
    return classnames(obj);
  },

  preRender(ComponentClass, obj) {
    const classes = this.classnames(obj);

    const props = {
      ...this.props,
      ...{
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <ComponentClass {...props}>
        {this.state.children}
      </ComponentClass>
    );
  },
};

module.exports = NavMixin;
