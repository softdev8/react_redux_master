import React from 'react'

class NavBrand extends React.Component {
  render() {
    const props = {
      ...this.props,
      ...{
        to: '#',
        className: [this.props.className, 'navbar-brand'].join(' '),
      },
    };

    return (
      <a {...props}>
        {this.props.children}
      </a>
    );
  }
}

module.exports = NavBrand;
