'use strict';

import '../../../../css/web/css/font-awesome.css'
import '../../../../css/web/css/style.css'

import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames'

export default class Marker extends Component {
  static propTypes = {
    deemphasize: PropTypes.bool.isRequired,
  };

  render() {
    let divStyle = {
      zIndex: this.props.priority,
    };

    let classes = сlassNames({
      'cd-marker': true,
      deemphasize: this.props.deemphasize,
    });

    return <div style={divStyle} className={classes}>
      <i className='fa fa-map-marker'></i>
    </div>
  }
}
