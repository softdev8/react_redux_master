import React, {Component, PropTypes} from 'react';

import FooterMenu from './FooterMenu';
import LandingFooterTopPanel from './LandingFooterTopPanel';
import LandingFooterBottomPanel from './LandingFooterBottomPanel';

export default class LandingFooter extends Component {

  static PropTypes = {
    className: PropTypes.string,
  };

  render() {

    const {className} = this.props;

    return  <footer className={className}>
              <LandingFooterTopPanel/>
              <FooterMenu type='landing'/>
              <LandingFooterBottomPanel/>
            </footer>;

  }
}