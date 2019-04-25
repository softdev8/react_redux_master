import React, {Component, PropTypes} from 'react';

import {PageCoverResponsive} from '../../index';

import styles from './ArticlePagesFeature.module.scss';

export default class ArticlePagesFeature extends Component {
  static PropTypes = {
    mode         : PropTypes.string,
    coverImage   : PropTypes.string,
    saveTempData : PropTypes.func.isRequired,
    isDemo       : PropTypes.bool.isRequired,
  };

  render() {
    const {coverImage, mode = 'read', isDemo} = this.props;
    const baseClassName = styles['article-feature'];
    const className     = coverImage ? baseClassName : `${baseClassName} ${styles.empty}`;

    return <div className={className}>
            <PageCoverResponsive mode={mode}
                                 isDemo={isDemo}
                                 image={coverImage} 
                                 saveTempData={this.props.saveTempData}/>
           </div>;
  }
}
