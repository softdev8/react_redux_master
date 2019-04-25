import React, { Component, PropTypes } from 'react';

import FooterMenu from './FooterMenu';

class DashboardFooter extends Component {

  render() {

    const { className } = this.props;

    return (
      <footer className={className}>
        <FooterMenu theme={this.props.theme}/>
      </footer>
    );

  }
}

DashboardFooter.propTypes = {
  className : PropTypes.string,
  theme     : PropTypes.string
};

export default DashboardFooter;
