import React from 'react'

class NavHeader extends React.Component {
  render() {
    const props = {
      ...this.props,
      ...{
        className: [this.props.className, 'navbar-header'].join(' '),
      },
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = NavHeader;
