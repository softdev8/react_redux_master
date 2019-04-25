import React, {Component, PropTypes} from 'react';

import {ImageUploader} from '../index';

import styles from './PageCover.module.scss';

export default class PageCover extends Component {
  static PropTypes = {
    mode  : PropTypes.string,
    image : PropTypes.string,
    saveTempData : PropTypes.func,
    isDemo: PropTypes.bool.isRequired,
  };

  render() {
    const {image, mode = 'read', isDemo} = this.props;
    const baseClassName = styles['page-cover'];

    let className = this.props.className ? `${baseClassName} ${this.props.className}` : baseClassName;
    let style = {};

    if(image) {
      style.backgroundImage = `url(${image})`;
    } else {
      className += ` ${styles.empty}`;
    }

    className += ` ${styles[mode]}`;

    return  <div className={className}>
              { image && 
                <div className={styles.image} style={style}/> 
              }
              { mode === 'write' &&
                  <ImageUploader saveChanges={({thumbnail, file, metadata})=>{
                                                this.props.saveTempData({
                                                  cover_thumbnail : thumbnail,
                                                  cover_image     : file,
                                                  metadata,
                                                });
                                              }}
                                 hasImage={!!image}
                                 isDemo={isDemo}
                                 />  
              }
            </div>;
  }
}
