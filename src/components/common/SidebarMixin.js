import React from 'react'

import Dispatcher from './Dispatcher'

import classnames from 'classnames';

let openState = (!Modernizr.touch) ? (localStorage.getItem('sidebar-open-state') === 'true' ? true : false) : false;
const SidebarMixin = {
  getInitialState() {
    return {
      open: openState,
    };
  },

  sidebarStateChangeCallback(open) {
    if(this.state.open === open) return;
    if(open !== undefined)
      openState = open;
    else
      openState = !this.state.open;
    this.setState({
      // toggle sidebar
      open: openState,
    });
    localStorage.setItem('sidebar-open-state', openState);
  },

  componentWillMount() {
    Dispatcher.on('sidebar', this.sidebarStateChangeCallback);
  },

  componentWillUnmount() {
    Dispatcher.off('sidebar', this.sidebarStateChangeCallback);
  },
};



module.exports = SidebarMixin;
