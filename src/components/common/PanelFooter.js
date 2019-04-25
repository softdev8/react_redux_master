import React from 'react'

import classnames from 'classnames';

class PanelFooter extends React.Component {
  render() {
    const classes = classnames({
      'rubix-panel-footer': true,
      noRadius: this.props.noRadius,
    }).trim()
    var props = {
      ...this.props,
      ...{
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <div {...props} >
        {this.props.children}
      </div>
    );
  }
}

module.exports = PanelFooter;