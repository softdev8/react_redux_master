import styles from './SocialPanel.module.scss';

//Legacy Code
import React from 'react';

const ShareButton = require('share-button');

export default class extends React.Component {
  componentDidMount() {
    new ShareButton({
      networks: {
        facebook: {
          appId: "530312767132745",
        },

        email: {
          enabled: false,
        },
      },
    });
  }

  render() {
    return (
      <share-button className={styles.shareButton}></share-button>
    );
  }
};