require('./ModalHeader.scss');

import React, { Component, PropTypes } from 'react';

export default class ModalHeader extends Component {

  static PropTypes = {
    title : PropTypes.string,
  };

  render() {

    let text;

    const { title, children } = this.props;

    if (title && (typeof title === 'string')) {
      text = title;
    }

    const defaultChild = <h3 className="b-modal-header__title"> {text} </h3>;

    return  (<div className="b-modal-header">
              { children || defaultChild }
            </div>);
  }
}

ModalHeader.propTypes = {
  title    : PropTypes.string,
  children : PropTypes.arrayOf(PropTypes.element)
};
