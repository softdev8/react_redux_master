import styles from './Footer.module.scss';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import DashboardFooter from './DashboardFooter';
import LandingFooter from './LandingFooter';

class Footer extends Component {

  render() {

    const { className, theme, children } = this.props;

    const footerClassName = classnames(styles.footer, 'b-footer', className);

    if (children) {

      return (
        <footer theme={theme} className={footerClassName}>
          { children }
        </footer>
      );

    } else if (theme === 'landing') {

      return <LandingFooter theme={theme} className={footerClassName}/>;

    }

    return <DashboardFooter theme={theme} className={footerClassName}/>;

  }
}

Footer.propTypes = {
  children  : PropTypes.node,
  className : PropTypes.string,
  theme     : PropTypes.oneOf(['dashboard', 'landing']).isRequired,
};

export default Footer;
