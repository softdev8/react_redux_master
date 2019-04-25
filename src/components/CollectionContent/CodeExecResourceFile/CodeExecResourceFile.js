import styles from './CodeExecResourceFile.module.scss';

import React, { Component, PropTypes } from 'react';
import { ImageUploaderSlim, Btn } from '../../index';
import { showModal } from '../../../actions/index';
import formatFileSize from '../../../utils/formatFileSize';
import { ModalTypes } from '../../../constants';
import { connect } from 'react-redux';

@connect()
export default class FileComponent extends Component {

  static propTypes = {
    mode         : PropTypes.string.isRequired,
    content      : PropTypes.object.isRequired,
    collectionId : PropTypes.string.isRequired,
    updateImage  : PropTypes.func.isRequired,
    dispatch     : PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.updateImage = this.updateImage.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onRemoveImage() {
    this.props.updateImage({
      file_id: null,
      file_name: null,
      file_size: null
    });
  }

  static getComponentDefault() {
    const defaultContent = {
      file_id: null,
      file_name: null,
      file_size: null
    };
    return defaultContent;
  }

  updateImage(newImage) {
    const file = newImage.file;
    const name = file.name;
    const size = file.size;
    const resFileMaxSizeBytes = 5 * 1024 * 1024;

    if ((size > resFileMaxSizeBytes) || (!name.endsWith('.tar.gz'))) {
      this.props.dispatch(showModal(ModalTypes.PROGRESS, { status:'ERROR', text:'Resource file should be a gzip(.tar.gz) and <= 5 MB in size' }));
    } else {
      this.props.updateImage(newImage);
    }
  }

  render() {
    const { mode, content, collectionId } = this.props;

    if (mode !== 'write') {
      return null;
    }

    let file = 'No File selected';
    let fileSelected = true;

    if (content.file_id && content.updated) {
      file = (<span>
            <i>* {`${content.file_name} (${formatFileSize(content.file_size)})`} will be uploaded on Save.</i>
        </span>);
    } else if (content.file_id) {
      const filePath = `/api/author/collection/${collectionId}/image/${content.file_id}`;
      file = <a href={filePath} target="_blank">{`${content.file_name} (${formatFileSize(content.file_size)})`}</a>;
    } else {
      fileSelected = false;
    }

    return (
      <div className={styles.code_exec_res_file_container}>
        <div className={styles.label}>Code execution resource file</div>
        <div style={{ fontWeight:300, fontSize:16 }}>{`Upload a gzip tarball (max. 5 MB) for code executions. Contents of data.tar.gz will be extracted to the current directory during code executions.`}</div>
        <div style={{ fontWeight:400, fontSize:16, fontStyle: 'italic' }}>{`e.g. tar -czpf data.tar.gz <file1> <folder1> <file2>`}</div>
        <div className="edcomp-toolbar">
          <ImageUploaderSlim ref="uploader" saveChanges={this.updateImage} hasImage={!!file} nonImageUpload />
          { fileSelected &&
              <Btn secondary small onClick={this.onRemoveImage}>
              Remove File
              </Btn>
          }
          <span style={{ marginLeft:20 }}>{ file }</span>
        </div>
      </div>);
  }
}
