import styles from './AuthorPageFeature.module.scss';

import React, { Component } from 'react';
import { AuthorFeatureBlocks } from 'components';

class PageFeature extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const image = 'landing/imgs/header-bg8.jpg';
    const background = {
      backgroundImage: `url(${image})`
    };
    return (
      <section className={styles.feature}>
        <div className={styles['image-wrapper']} style={background}>
        </div>
        <AuthorFeatureBlocks />
      </section>
    );
  }
}

export default PageFeature;
