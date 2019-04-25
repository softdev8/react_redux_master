import React from 'react'

class InputGroupAddon extends React.Component {
  render() {
    const props = {
      ...this.props,
      ...{
        className: [this.props.className, 'input-group-addon'].join(' '),
      },
    };

    return (
      <div {...props}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = InputGroupAddon;
