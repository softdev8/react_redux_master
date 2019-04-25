'use strict';

import React, {Component} from 'react'
import {findDOMNode} from 'react-dom';
import $ from 'jquery'

let Portal = require('react-portal');

export default class PortalDecorator extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.setState({parent: $(findDOMNode(this)).parent()})
  }

  render() {
    let myLeft = 0;
    let myTop = 0;

    if (this.state.parent) {
      const offset = this.state.parent.offset();
      myLeft = offset.left;
      myTop = offset.top;
    }

    return (
      <div>
        <Portal isOpened={true} closeOnEsc={true}>
          {this.props.children({left: myLeft, top: myTop})}
        </Portal>
      </div>
    )
  }
};
