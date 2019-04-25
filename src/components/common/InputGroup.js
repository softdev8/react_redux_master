import React from 'react'

import classnames from 'classnames';

class InputGroup extends React.Component {
  render() {
    const classes = classnames({
      'input-group': true,
      'input-group-lg': this.props.lg,
      'input-group-sm': this.props.sm,
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

InputGroup.propTypes = {
  lg: React.PropTypes.bool,
  sm: React.PropTypes.bool,
};

module.exports = InputGroup;
