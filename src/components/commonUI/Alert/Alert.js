import React from 'react'
import classnames from 'classnames'

// var Button = require('./Button');

class Alert extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hidden: false,
    };
  }

  handleClose() {
    this.setState({hidden: true});
  }

  render() {
    const classes = classnames({
      alert: true,
      hidden: this.state.hidden,
      'alert-info': this.props.info,
      'alert-danger': this.props.danger,
      'alert-success': this.props.success,
      'alert-warning': this.props.warning,
      'alert-dismissible': this.props.dismissible,
    });

    let children = this.props.children;

    if(this.props.dismissible) {
      children = (
        <div>
          {this.props.children}
        </div>
      );
    }

    var props = {
      role: 'alert',
      className: [this.props.className, classes.trim()].join(' '),

      style: {
        marginBottom: this.props.collapseBottom ? 0 : null,
      },
    }

    return (
      <div {...props}>
        {children}
      </div>
    );
  }
}

Alert.propTypes = {
  info: React.PropTypes.bool,
  danger: React.PropTypes.bool,
  success: React.PropTypes.bool,
  warning: React.PropTypes.bool,
  dismissible: React.PropTypes.bool,
  collapseBottom: React.PropTypes.bool,
};

module.exports = Alert;
