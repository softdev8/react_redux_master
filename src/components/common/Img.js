import React from 'react'

import classnames from 'classnames';

class Img extends React.Component {
  render() {
    const style={};
    const classes = classnames({
      'img-circle': this.props.circle,
      'img-rounded': this.props.rounded,
      'img-thumbnail': this.props.thumbnail,
      'img-responsive': this.props.responsive,
    });
    if(!this.props.src.length) {
      this.props.src = '/imgs/blank.gif';
      style.backgroundColor = '#EEEEEE';
    }

    var props = {
      ...this.props,
      ...{
        style,
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <img {...props} />
    );
  }
}

Img.propTypes = {
  circle: React.PropTypes.bool,
  rounded: React.PropTypes.bool,
  thumbnail: React.PropTypes.bool,
  responsive: React.PropTypes.bool,
};

module.exports = Img;
