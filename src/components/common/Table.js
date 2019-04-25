import React from 'react'

import classnames from 'classnames';

class Table extends React.Component {
  render() {
    const classes = classnames({
      table: true,
      'table-hover': this.props.hover,
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-collapsed': this.props.collapsed,
      'table-condensed': this.props.condensed,
      'table-top-align': this.props.alignTop,
      'table-middle-align': this.props.alignMiddle,
      'table-bottom-align': this.props.alignBottom,
    });

    const props = {
      className: [this.props.className, classes].join(' '),
      defaultValue: this.props.children,
    };

    const table = (
      <table {...props}>
        {this.props.children}
      </table>
    );

    if(this.props.responsive) {
      return (
        <div className='table-responsive'>
          {table}
        </div>
      );
    } else return table;
  }
}

Table.propTypes = {
  hover: React.PropTypes.bool,
  striped: React.PropTypes.bool,
  bordered: React.PropTypes.bool,
  collapsed: React.PropTypes.bool,
  condensed: React.PropTypes.bool,
  responsive: React.PropTypes.bool,
  alignTop: React.PropTypes.bool,
  alignMiddle: React.PropTypes.bool,
  alignBottom: React.PropTypes.bool,
};

module.exports = Table;
