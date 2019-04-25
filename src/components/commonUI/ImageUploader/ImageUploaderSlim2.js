require('./ImageUploaderSlim.scss');

import React, { Component, PropTypes } from 'react';

import { Icons, Btn, SomethingWithIcon } from '../../index';

export default class ImageUploaderSlim extends Component {
  constructor(props, context) {
    super(props, context);
    this.onFileChange = this.onFileChange.bind(this);
  }

  onFileChange(e) {
    const files = e.target.files;
    if (!files.length) return;

    this.props.onChange({
      file     : files[0],
      metadata : {
        sizeInBytes : files[0].size
      }
    });
  }

  render() {
    return    (
      <div className="b-image-slim-uploader">
        <Btn primary className="image-upload-btn" onClick={ () => {} }>
          <SomethingWithIcon icon={Icons.photosIcon} text={'Add file'} />
        </Btn>
        <input type="file" className="form-control" onChange={this.onFileChange} />
      </div>
    );
  }
}

ImageUploaderSlim.propTypes = {
  onChange : PropTypes.func.isRequired
};
