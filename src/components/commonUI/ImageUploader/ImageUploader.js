import React, { Component, PropTypes } from 'react';
import './ImageUploader.scss';
import { Icons, Btn } from '../../index';

export default class BannerUploader extends Component {
  static PropTypes = {
    saveChanges : PropTypes.func.isRequired,
    hasImage    : PropTypes.bool.isRequired,
    isDemo      : PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.onFileChange = this.onFileChange.bind(this);
    this.removeImage  = this.removeImage.bind(this);
  }

  render() {
    const { children, hasImage, isDemo } = this.props;

    if(children) {
      return  <div className='b-image-uploader'>
                {!isDemo && <input type='file' 
                       className='form-control' 
                       onChange={!isDemo ? this.onFileChange : ()=>{}}/>
                }
                { children }
              </div>;

    } else {
      return  <div className='b-image-uploader'>    
                {!isDemo && <input type='file' 
                       className='form-control' 
                       onChange={this.onFileChange}/>
                }
                {
                  !isDemo ? 
                  (
                    <div>
                      { Icons.photosIcon }
                      <span className='b-image-uploader-def-title'><nobr>click to add a banner</nobr></span> 
                      <br/>
                      <span className='b-image-uploader-def-subtitle'><nobr>For best results, min 1920px by 1080px</nobr></span> 
                      { hasImage ? 
                        (<Btn className='b-btn_white-border b-btn-remove'
                              onClick={this.removeImage}
                              text='remove image'/>
                        ) : null}
                    </div>
                  ) : 
                  (
                    <div>
                      Banners are not available in Demo Mode.
                    </div>
                  )
                }
              </div>;
    }
  }

  onFileChange(e) {
    const files = e.target.files;

    if (!files.length) return;


    createThumbnail(files[0], imageInfo => {
      const newData = {
        file      : files[0],
        thumbnail : imageInfo.thumbnail,
        metadata  : imageInfo.metadata,
      };

      this.props.saveChanges(newData);
    });
  }

  removeImage(e) {
    const newData = {
      file      : null,
      thumbnail : null,
    };

    this.props.saveChanges(newData);
  }
}

function createThumbnail(file, cb) {
  const reader = new FileReader;
  const image = new Image();

  reader.readAsDataURL(file);

  reader.onload = function(_file) {
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
