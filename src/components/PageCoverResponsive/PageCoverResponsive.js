import React, {Component, PropTypes} from 'react';

import {ImageUploader} from '../index';

import styles from './PageCoverResponsive.module.scss';

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

    let imageStyle;
    if(mode == 'write'){
      imageStyle = {width:'100%', minHeight:'300px'};
    } else {
      imageStyle = {width:'100%'};
    }

    return <div className={className}>
              { image && 
                <img src={image} style={imageStyle}/> 
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
