'use strict';

import '../../../../css/web/css/style.css'

import React, {Component, PropTypes} from 'react'
import Square from '../Square';

export default class Hotspot extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    link: PropTypes.string,
    deemphasize: PropTypes.bool.isRequired,
  };

  onHover() {
  }

  onClick() {
  }

  constructor() {
    super();

    this.onHover = this.onHover.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return <Square {...this.props} onHover={this.onHover} onClick={this.onClick}/>
  }
}
