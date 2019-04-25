require('./Button.scss');

import React, {Component, PropTypes} from 'react';

const baseClassName = 'b-btn';

export default class Btn extends Component {

  static PropTypes = {
    className : PropTypes.string,
    text      : PropTypes.string,
    type      : PropTypes.string,
    btnStyle  : PropTypes.string,

    // orange button
    primary   : PropTypes.bool,

    // green button
    secondary : PropTypes.bool,

    // transparent
    default   : PropTypes.bool,

    // as link
    link      : PropTypes.bool,

    large     : PropTypes.bool,
    medium    : PropTypes.bool,
    small     : PropTypes.bool,
    active    : PropTypes.bool,
  };

  render() {

    const {action_secondary, action, link, 'default': _default, large, small,
      medium, secondary, btnStyle, text, active, primary, ...props} = this.props;

    let className = this.props.className ? `${this.props.className} ${baseClassName}`
                                         : baseClassName;

    if(primary || btnStyle == 'primary') {
      className += ' b-btn_primary';
    }

    if(secondary || btnStyle == 'secondary') {
      className += ' b-btn_secondary';
    }

    if(action || btnStyle == 'action') {
      className += ' b-btn_action';
    }

    if(action_secondary || btnStyle == 'action_secondary') {
      className += ' b-btn_action_secondary';
    }

    if(link || btnStyle == 'link') {
      className += ' b-btn_link';
    }

    if(_default || btnStyle == 'default') {
      className += ' b-btn_default';
    }

    if(small) {
      className += ' b-btn_sm';
    }

    if(medium) {
      className += ' b-btn_md';
    }

    if(large) {
      className += ' b-btn_lg';
    }

    if(active) className += ' active';

    const type    = this.props.type || 'button';

    const content = this.props.children || text || 'Button';

    return  <button {...props} className={className} type={type}>
              { content }
            </button>;

  }
}