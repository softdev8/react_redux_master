import styles from './ProfilePicture.module.scss';

import React, {Component, PropTypes} from 'react';

import {ImageUploader,
        Icons, Btn} from '../../index';

export default class ProfilePicture extends Component {

  static PropTypes = {
    picture  : PropTypes.string,
    mode     : PropTypes.string,
    saveTempData : PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.updateTempFeature  = this.updateTempFeature.bind(this);
    this.removeProfileImage = this.removeProfileImage.bind(this);
  }

  render() {

    const {picture, mode = 'read', className} = this.props;

    const baseClassName = styles['profile-picture'];

    let profilePictureClass = picture ? baseClassName : `${baseClassName} ${styles.empty}`;

    profilePictureClass += ` ${styles[mode]}`;

    if(className) {
      profilePictureClass += ` ${className}`;
    }

    const backgroundSrc = `url(${picture})`;

    if(!picture && mode == 'read') return null;

    return  <div className={profilePictureClass}>

              { picture ? <div className={styles.image} style={{backgroundImage: backgroundSrc}}/> : null }

              { mode == 'write' ? this.renderImageUploader(!!picture) : null }

            </div>;
  }

  renderImageUploader(hasImage) {

    const removeBtn = <Btn className='b-btn_green-border b-btn-remove'
                           onClick={this.removeProfileImage}
                           text='remove image'/>;

    return  <ImageUploader saveChanges={this.updateTempFeature}>
              {Icons.profileIcon}
              <span className='b-image-uploader-def-title'>
                click to add a profile picture
              </span><br/>
              <span className='b-image-uploader-def-subtitle'>
                For best effects, upload a square photo
              </span>
              { hasImage ? removeBtn : null }
            </ImageUploader>;
  }

  updateTempFeature(newPicture) {
    const dataToSave = {
      profile_thumbnail : newPicture.thumbnail,
      profile_image     : newPicture.file,
      metadata          : newPicture.metadata,
    }

    this.props.saveTempData(dataToSave);
  }

  removeProfileImage(e) {

    const newData = {
      file      : null,
      thumbnail : null,
    };

    this.updateTempFeature(newData);
  }
}