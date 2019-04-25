import styles from './FooterAction.module.scss';

import React, { Component } from 'react';

class FooterAction extends Component {

  render() {

    return (
      <div className={styles.action}>
        <div className={`container ${styles.inn}`}>
          <div className={styles.col_left}>
            <h4>Become an author</h4>
            <p>Writing articles is absolutely free. You can price your content or keep it free.</p>
          </div>
          <div className={styles.col_right}>
            <a href="/signup" className={styles.button}>Create account</a>
          </div>
        </div>
      </div>
    );
  }
}

FooterAction.propTypes = {};

export default FooterAction;
