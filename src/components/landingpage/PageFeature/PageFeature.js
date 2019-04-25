import styles from './PageFeature.module.scss';

import React, { Component } from 'react';

import { ReaderFeatureBlocks } from '../../../components';

class PageFeature extends Component {

  render() {

    const image = 'landing/imgs/header-bg4.png';
    const background = {
      backgroundImage: `url(${image})`
    };

    return (
      <section className={styles.feature}>
        <div className={styles['image-wrapper']} style={background}>
        </div>
        <ReaderFeatureBlocks />
      </section>
    );
  }
}

export default PageFeature;
