require('./ImageUploaderSlim.scss');

import React, {Component, PropTypes} from 'react';

import {Icons, Btn, SomethingWithIcon} from '../../index';

export default class ImageUploaderSlim extends Component {
  constructor(props, context) {
    super(props, context);

    this.onFileChange = this.onFileChange.bind(this);
  }

  render() {
    return    (<div className='b-image-slim-uploader'>
                <Btn primary className='image-upload-btn' onClick={this.onButtonClick}>
                  <SomethingWithIcon icon={Icons.photosIcon} text={ this.props.nonImageUpload ? 'Change File' : 'Change Image' }/>
                </Btn>
                <input type="file" className="form-control" onChange={this.onFileChange}/>
              </div>);

  }

  onButtonClick(e) {

  }

  onFileChange(e) {
    const files = e.target.files;

    if (!files.length) return;

    if (this.props.nonImageUpload) {
      const newData = {
        file      : files[0],
        metadata  : {
          sizeInBytes: files[0].size
        }
      };

      this.props.saveChanges(newData);
      return;
    }

    createThumbnail(files[0], imageInfo => {

      const newData = {
        file      : files[0],
        thumbnail : imageInfo.thumbnail,
        metadata  : imageInfo.metadata,
      };

      this.props.saveChanges(newData);
    });
  }
}

function createThumbnail(file, cb) {
  const reader = new FileReader;
  const image = new Image();

  reader.readAsDataURL(file);

  reader.onload = function (_file) {
    image.src    = _file.target.result;
    image.onload = function() {
      const imageInfo = {
        thumbnail: _file.target.result,

        metadata: {
          width: this.width,
          height: this.height,
          sizeInBytes: file.size,
        },
      };

      return cb(imageInfo);
    };
  };
}


ImageUploaderSlim.propTypes = {
  saveChanges     : PropTypes.func.isRequired,
  nonImageUpload  : PropTypes.bool
};
