'use strict';

import '../../../../css/web/css/style.css'

import React, {Component, PropTypes} from 'react'
import сlassNames from 'classnames';
import Square from '../Square';

export default class DeeperImage extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    deemphasize: PropTypes.bool.isRequired,
  };

  render() {
    let divStyle = {
      height: this.props.height,
      width: this.props.width,
      zIndex: this.props.priority,
    };

    let imageStyle = divStyle;

    imageStyle.width -= 3;
    imageStyle.height -= 3;

    imageStyle.width = imageStyle.width >= 0 ? imageStyle.width : 0;
    imageStyle.height = imageStyle.height >= 0 ? imageStyle.height : 0;

    imageStyle.backgroundColor = this.props.deepImageColor;

    let classes = сlassNames({
      'cd-image': true,
      deemphasize: this.props.deemphasize,
    });

    return <div style={divStyle} className={classes}>
      <Square {...this.props} onHover={this.onHover} onClick={this.onClick}>
        <div className="deeper-image" style={imageStyle}/>
      </Square>
    </div>
  }
}
//<img src={this.props.src} style={imageStyle}/>
