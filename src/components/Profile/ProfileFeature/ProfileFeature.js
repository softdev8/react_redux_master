import styles from './ProfileFeature.module.scss';

import React, {Component, PropTypes} from 'react';

import {PageCover} from '../../index';

export default class ProfileFeature extends Component {

  static PropTypes = {
    mode       : PropTypes.string,
    coverImage : PropTypes.string,
  };

  render() {

    let {coverImage, mode = 'read'} = this.props;

    let className = styles['profile-feature'];

    className += ` ${styles[mode]}`;

    if(!coverImage) className += ` ${styles.empty}`;

    return  <div className={className}>

              <PageCover mode={mode} 
                         image={coverImage} 
                         className={styles.cover}
                         saveTempData={this.props.saveTempData}/>

            </div>;
  }

}
