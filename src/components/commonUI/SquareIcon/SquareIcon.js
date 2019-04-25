require('./SquareIcon.scss');

import React, {Component, PropTypes} from 'react';

export default class SquareIcon extends Component {

  static PropTypes = {
    icon : PropTypes.object,
  };

  render() {

    const {icon} = this.props;

    const baseClassName = 'b-square-icon';

    const className = this.props.className ? `${baseClassName} ${this.props.className}` : baseClassName; 

    return  <i className={className}>
              { icon }
            </i>;
  }
}