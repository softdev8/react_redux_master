import React, { Component, PropTypes } from 'react';

import FooterMenu from './FooterMenu';
import LandingFooterBottomPanel from './LandingFooterBottomPanel';

class LandingFooter extends Component {

  render() {

    const { className } = this.props;

    return (
      <footer className={className}>
        <FooterMenu theme="landing"/>
        <LandingFooterBottomPanel/>
      </footer>
    );

  }
}

LandingFooter.propTypes = {
  className: PropTypes.string
};

export default LandingFooter;
