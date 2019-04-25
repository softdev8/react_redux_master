import styles from './LandingFooterBottomPanel.module.scss';

import React, { Component } from 'react';

class LandingFooterBottomPanel extends Component {

  render() {

    return (
      <div className={styles.copyright}>
        <div className="container">
          <h4 className={styles.brand}>Educative.io</h4>
          <div className={styles.icons}>
            <a href="https://www.facebook.com/educativeinc"><i className="fa fa-facebook-square"/></a>
            <a  href="https://twitter.com/educativeinc"><i className="fa fa-twitter-square"/></a>
          </div>
          <p className={styles.copy}>
            Copyright © 2017 Educative.io. All rights reserved.<br/>
            <a href="/terms">Terms of use</a>&nbsp;&amp;&nbsp;<a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    );

  }
}

export default LandingFooterBottomPanel;
