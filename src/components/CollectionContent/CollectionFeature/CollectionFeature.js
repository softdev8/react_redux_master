import styles from './CollectionFeature.module.scss';

import React, {Component, PropTypes} from 'react';

import {PageCoverResponsive} from '../../index';

export default class CollectionFeature extends Component {

  static PropTypes = {
    mode     : PropTypes.string,
    coverImage   : PropTypes.string,
    saveTempData : PropTypes.func.isRequired,
  };

  render() {
    const {coverImage, mode = 'read'} = this.props;
    const baseClassName = styles['collection-feature'];
    const className     = coverImage ? baseClassName : `${baseClassName} ${styles.empty}`;

    return  <div className={className}>

              <PageCoverResponsive  mode={mode} 
                          image={coverImage} 
                          saveTempData={this.props.saveTempData}/>

              { this.props.children }
            </div>;
  }

}
