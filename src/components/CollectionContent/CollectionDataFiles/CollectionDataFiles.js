import styles from './CollectionDataFiles.module.scss';

import React, { Component, PropTypes } from 'react';
import copy from 'copy-to-clipboard';
import { Button } from 'react-bootstrap';
import { ImageUploaderSlim2 } from '../../index';
import { showModal } from '../../../actions/index';
import formatFileSize from '../../../utils/formatFileSize';
import { ModalTypes } from '../../../constants';
import { connect } from 'react-redux';

@connect()
export default class FileComponent extends Component {

  static propTypes = {
    mode         : PropTypes.string.isRequired,
    dataFiles    : PropTypes.array.isRequired,
    updateImage  : PropTypes.func.isRequired,
    removeImage  : PropTypes.func.isRequired,
    dispatch     : PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.updateImage = this.updateImage.bind(this);
  }

  static getComponentDefault() {
    const defaultContent = {
      file_id: null,
      file_name: null,
      file_size: null
    };
    return defaultContent;
  }

  getDataFilesView() {
    let dataFilesView = null;

    const styleRemoveButton = {
      fontSize: 12,
      textTransform: 'none',
      color: '#d9534f', // $delete-color
      marginLeft: 10,
    };

    const styleCopyButton = {
      fontSize: 12,
      textTransform: 'none',
      color: '#4488ff',
    };

    dataFilesView = this.props.dataFiles.map((dataFile, index) => {
      let file = null;
      if (dataFile.file_id && dataFile.updated) {
        file = (
          <span>
            <span className={styles.pendingUploadFile}>
                <i>* {`${dataFile.file_name} (${formatFileSize(dataFile.file_size)})`} will be uploaded on SAVE.</i>
            </span>
            <Button
              style={styleRemoveButton}
              onClick={() => this.props.removeImage(index)}
            >
              Remove
            </Button>
          </span>);
      } else if (dataFile.file_id) {
        const filePath = `/udata/${dataFile.file_id}/${dataFile.file_name}`;
        file = (
          <div className={styles.uploadedFileWrapper}>
            <div className={styles.uploadedFile}>
              {`${dataFile.file_name} (${formatFileSize(dataFile.file_size)})`}
            </div>
            <div className={styles.uploadedFilePath}>
              {filePath}
            </div>
            <Button
              style={styleCopyButton}
              onClick={() => copy(filePath)}
            >
              Copy</Button>
            <Button
              style={styleRemoveButton}
              onClick={() => this.props.removeImage(index)}
            >
              Remove
            </Button>
          </div>);
      }

      return (
        <div key={index} className={styles.dataFiles}>
          {file}
        </div>
      );
    });

    if (dataFilesView) {
      dataFilesView = (
        <div className={styles.dataFilesWrapper}>{dataFilesView}</div>
      );
    }

    return dataFilesView;
  }

  updateImage(newImage) {
    const file = newImage.file;

    if (file.size > 1024 * 1024) {
      this.props.dispatch(showModal(ModalTypes.PROGRESS, { status:'ERROR', text:'Resource file should be less than 1 MB.' }));
    } else {
      this.props.updateImage(newImage);
    }
  }

  render() {
    const { mode } = this.props;

    if (mode !== 'write') {
      return null;
    }

    return (
      <div className={styles.collection_data_files_container}>
        <div className={styles.label}>Course assets</div>
        <div style={{ fontWeight:300, fontSize:16 }}>
          {`Need to use some files (json, css, images, etc.) in your lessons? Upload them here and reference them in the lessons.`}
          <div><i>{`E.g. <img src="/udata/4z5lx6BZ/file.png"/>`}</i></div>
        </div>
        {this.getDataFilesView()}
        <ImageUploaderSlim2 onChange={this.updateImage}/>
      </div>
    );
  }
}
