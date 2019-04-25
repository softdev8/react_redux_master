import React from 'react'

const NavMixin = require('./NavMixin');

import classnames from 'classnames';

const Nav = React.createClass({
  propTypes: {
    onItemSelect: React.PropTypes.func,
  },

  mixins: [NavMixin],

  getDefaultProps() {
    return {
      onItemSelect() {},
    };
  },

  componentWillMount() {
    const children = React.Children.map(this.props.children, function(child, i) {
      return React.withContext(this._reactInternalInstance._currentElement._context, () => React.cloneElement(
        child,
        {
          parent: this,
          key: i,
        },
      ));
    }, this);
    this.setState({
      children,
    });
  },

  componentWillReceiveProps(nextProps) {
    const children = React.Children.map(nextProps.children, function(child, i) {
      return React.withContext(this._reactInternalInstance._currentElement._context, () => React.cloneElement(
        child,
        {
          parent: this,
          key: i,
        },
      ));
    }, this);
    this.setState({
      children,
    });
  },

  activeItem: null,

  deactivateAll(cb) {
    const children = React.Children.map(this.props.children, function(child, i) {
      return React.cloneElement(
        child,
        {
          parent: this,
          active: false,
          key: i,
        },
      );
    }, this);
    this.setState({
      children,
    }, cb)
  },

  getActiveItem() {
    if(this.activeItem)
      return this.activeItem;
    else
      return {};
  },

  getActiveItemProps() {
    return this.activeItem().props || {};
  },

  selectItem(key, value, cb) {
    let active = false;
    const children = React.Children.map(this.props.children, function(child, i) {
      if(!this.state.children[i].props.dropdown) {
        active = false;
        if(child.props[key] === value) active = true;
        return React.withContext(this._reactInternalInstance._currentElement._context, () => React.cloneElement(
          child,
          {
            parent: this,
            active,
            key: i,
          },
        ));
      }
    }, this);
    this.setState({
      children,
    }, cb);
  },

  render() {
    return this.preRender(
      'ul',
      {
        nav: true,
        'navbar-nav': true,
      },
    );
  },
});

module.exports = Nav;
