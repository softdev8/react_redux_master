require('./SomethingWithIcon.scss');

import React, {Component, PropTypes} from 'react';

export default class SomethingWithIcon extends Component {

  static PropTypes = {
    icon : PropTypes.node.isRequired,
    text : PropTypes.string,
    iconNotification : PropTypes.object,
    iconTop    : PropTypes.bool,
    iconLeft   : PropTypes.bool,
    iconRight  : PropTypes.bool,
    iconBottom : PropTypes.bool,
  };

  render() {
    const { icon, text, iconBottom, iconRight,
            iconLeft, iconTop } = this.props;

    const baseIconClassName = 'b-some-with-icon-icon';
    const baseWrapperClass  = 'b-some-with-icon';
    let iconClassName = typeof icon == 'string' ? `${baseIconClassName} ${icon}` : baseIconClassName;
    let wrapperClass  = baseWrapperClass;

    if(iconTop || iconBottom || iconRight)
      wrapperClass += ' flex';

    if(iconTop) wrapperClass += ' icon-top';
    else if(iconRight) wrapperClass += ' icon-right';
    else if(iconBottom) wrapperClass += ' icon-bottom';

    return (
      <span className={wrapperClass}>
        <i className={iconClassName}>
          { typeof icon !== 'string' ? icon : null }
          { this.props.iconNotification || null }
        </i>
        { text ? <span className='b-some-with-icon-text'>{ text }</span> : null }
      </span>
    );
  }

}
