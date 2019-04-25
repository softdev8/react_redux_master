import React from 'react'

import classnames from 'classnames';

class Container extends React.Component {
  render() {
    const classes = classnames({
      container: this.props.fixed,
      'container-fluid': this.props.fluid,
    });
    var props = {
      ...this.props,
      ...{
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

Container.propTypes = {
  fluid: React.PropTypes.bool,
  fixed: React.PropTypes.bool,
};

module.exports = Container;
