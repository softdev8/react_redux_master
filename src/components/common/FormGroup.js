import React from 'react'

import classnames from 'classnames';

class FormGroup extends React.Component {
  render() {
    const classes = classnames({
      'form-group': true,
      error: this.props.error,
      success: this.props.success,
      warning: this.props.warning,
      feedback: this.props.feedback,
      'form-group-lg': this.props.lg,
      'form-group-sm': this.props.sm,
    });

    var props = Object.assign(
      this.props,
      {
        className: [this.props.className, classes].join(' '),
      },
    );

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

FormGroup.propTypes = {
  lg: React.PropTypes.bool,
  sm: React.PropTypes.bool,
  error: React.PropTypes.bool,
  success: React.PropTypes.bool,
  warning: React.PropTypes.bool,
  feedback: React.PropTypes.bool,
};

module.exports = FormGroup;
