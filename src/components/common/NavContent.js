import React from 'react'

import classnames from 'classnames';

class NavContent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      collapse: props.collapse || false,
    };
  }

  collapse() {
    this.setState({
      collapse: true,
    });
  }

  expand() {
    this.setState({
      collapse: false,
    });
  }

  render() {
    const isCollapse = this.state.collapse ? true : false;
    const classes = classnames({
      'navbar-content': true,
      collapse: isCollapse,
      'navbar-collapse': isCollapse,
    });

    const props = {
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

NavContent.propTypes = {
  collapse: React.PropTypes.bool,
};

module.exports = NavContent;
