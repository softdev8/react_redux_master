'use strict';

import '../../../../css/web/css/style.css'

import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames'

export default class Square extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    deemphasize: PropTypes.bool.isRequired,
  };

  render() {
    let divStyle = {
      height: this.props.height,
      width: this.props.width,
      zIndex: this.props.priority,
    };

    let classes = сlassNames({
      'cd-square': true,
      deemphasize: this.props.deemphasize,
    });

    return <div style={divStyle} className={classes}>
      {this.props.children}
    </div>
  }
}
