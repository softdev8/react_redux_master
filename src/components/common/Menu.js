import React from 'react'
import {findDOMNode} from 'react-dom';

import classnames from 'classnames';
const Menu = React.createClass({
  propTypes: {
    noTimer: React.PropTypes.bool,
    autoHide: React.PropTypes.bool,
    alwaysInactive: React.PropTypes.bool,
    alignLeft: React.PropTypes.bool,
    alignRight: React.PropTypes.bool,
    onItemSelect: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onShown: React.PropTypes.func,
    onHide: React.PropTypes.func,
    onHidden: React.PropTypes.func,
    bsStyle: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      autoHide: false,
      bsStyle: 'default',
      onItemSelect() {},
      onShow() {},
      onShown() {},
      onHide() {},
      onHidden() {},
    };
  },

  getInitialState() {
    return {
      menuItems: [],

      ul: {
        display: 'none',
      },
    };
  },

  componentWillMount() {
    const menuItems = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    let count = 0;
    for(let i=0; i < menuItems.length; i++) {
      const component = React.cloneElement(
        menuItems[i],
        {
          parent: this,
          autoHide: this.props.autoHide,
          alwaysInactive: this.props.alwaysInactive,
          key: i,
          count: ((menuItems[i].props.hasOwnProperty('href') && !menuItems[i].props.hasOwnProperty('disabled') ) ? ++count : null),
        },
      );
      menuItems[i] = component;
    }
    this.count = count;
    this.setState({menuItems});
  },

  componentDidMount() {
    const parent = $(findDOMNode(this.refs.ul)).parent('.dropdown, .btn-group, .input-group-btn, .b-tab');
    $('body').bind(`click.menu.${this._reactInternalInstance._currentElement.ref}`, e => {
      if(parent.find(e.target).length)
        return;
      this.hide();
    });
    $('body').bind(`mouseover.menu.${this._reactInternalInstance._currentElement.ref}`, e => {
      clearTimeout(this.timer);
      if(parent.find(e.target).length)
        return;
      if(this.props.noTimer)
        return this.hide();
      this.timer = setTimeout(() => {
        try {
          this.hide();
        } catch(e) {}
      }, 500);
    });
  },

  componentWillUnmount() {
    $('body').unbind(`click.menu.${this._reactInternalInstance._currentElement.ref}`);
    $('body').unbind(`mouseover.menu.${this._reactInternalInstance._currentElement.ref}`);
  },

  activateItem(count, cb) {
    let active = false;
    let item = null;
    const menuItems = this.state.menuItems;
    for(let i=0; i < menuItems.length; i++) {
      item = menuItems[i];
      active = (item.props.count === count ? true : false);
      menuItems[i] = React.cloneElement(item, {active, key: item.key});
    }
    this.setState({menuItems}, cb);
  },

  activeItem: null,
  count: 0,

  getActiveItem() {
    if(this.activeItem)
      return this.activeItem;
    else
      return {};
  },

  getActiveItemProps() {
    return this.getActiveItem().props || {};
  },

  handleKeyDown(e) {
    e.preventDefault();
    if(e.key === 'ArrowDown') { // down arrow
      var newCount = 1;
      if(this.activeItem) newCount = this.activeItem.props.count + 1;
      if(newCount > this.count) newCount = 1;
      this.activateItem(newCount);
    } else if(e.key === 'ArrowUp') { // up arrow
      var newCount = this.count;
      if(this.activeItem) newCount = this.activeItem.props.count - 1;
      if(newCount < 1) newCount = this.count;
      this.activateItem(newCount);
    } else if(e.key === 'Escape') { // escape
      this.hide();
      this.toggle.focus();
    } else if(e.key === 'Enter') { // return
      this.props.onItemSelect(this.getActiveItemProps(), this);
      $(e.target).find('>.div-b-tab').trigger('click');
    }
  },

  handleKeyUp(e) {
    e.preventDefault();
  },

  hide(cb) {
    if(!this.isMounted()) return;
    this.props.onHide();
    this.state.ul.display = 'none';
    this.setState(this.state, () => {
      try {
        this.toggle.unpress();
      } catch(e) {}

      if(cb) cb();
      this.props.onHidden();
    });
  },

  selectItem(key, value) {
    let item = null;
    let active = false;
    const menuItems = this.state.menuItems;
    for(let i=0; i < menuItems.length; i++) {
      active = false;
      item = menuItems[i];
      if(item.props[key] === value) {
        active = true;
      }
      menuItems[i] = React.cloneElement(
        item,
        {
          active,
          key: item.key,
        },
      );
    }
    this.setState({menuItems});
  },

  setToggle(toggle) {
    this.toggle = toggle;
  },

  show(cb) {
    if(!this.isMounted()) return;
    this.props.onShow();
    this.state.ul.display = 'block';
    this.setState(this.state, () => {
      if(this.activeItem) {
        this.activeItem.focus();
      }
      if(cb) cb();
      this.props.onShown();
      setTimeout(function() {
        $(window).trigger('resize');
      }, 15);
    });
  },

  timer: null,
  toggle: null,

  render() {
    const classesObj = {
      'dropdown-menu': true,
      'dropdown-menu-left': this.props.alignLeft,
      'dropdown-menu-right': this.props.alignRight,
    };

    const bsStyles=this.props.bsStyle.split(',');
    for(let i=0; i < bsStyles.length; i++) {
      classesObj[`menu-${bsStyles[i].trim()}`] = true;
    }

    const classes = classnames(classesObj);

    var props = {
      ...this.props,
      ...{
        role: 'menu',
        style: this.state.ul,
        onKeyUp: this.handleKeyUp,
        onKeyDown: this.handleKeyDown,
        'aria-labelledby': this._reactInternalInstance._currentElement.ref,
        className: [this.props.className, (classes.length ? classes : null)].join(' '),
      },
    };

    return (
      <ul {...props} ref='ul'>
        {this.state.menuItems}
      </ul>
    );
  },
});

module.exports = Menu;
