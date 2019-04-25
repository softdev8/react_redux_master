'use strict';

import '../../../../css/web/css/style.css'

import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames'

export default class Highlight extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    deemphasize: PropTypes.bool.isRequired,
  };

  render() {
    let divStyle = {
      width: this.props.width,
      zIndex: this.props.priority,
    };

    let classes = сlassNames({
      'cd-highlight': true,
      deemphasize: this.props.deemphasize,
    });

    return <div style={divStyle} className={classes}></div>

  }
}
