import styles from './File.module.scss';

import React, { Component, PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import { FormControl } from 'react-bootstrap';
import { ImageUploaderSlim, SomethingWithIcon, Icons } from '../../index';
import getImagePath from '../../../utils/getImagePath';

export default class FileComponent extends Component {

  static getComponentDefault () {
    const defaultContent = {
      image_id: null,
      file_name: null,
      text: ''
    };
    return defaultContent;
  }

  static propTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.updateImage = this.updateImage.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);

    this.state = {
      updatedFile : null
    };
  }

  componentDidMount(){
    if (this.props.mode === 'edit') {
      if (this.uploaderRef && this.props.content.image_id === null) {
        $(findDOMNode(this.uploaderRef)).find("input").click();
      }
    }
  }

  onImageStyleChange(value, event) {
    this.props.updateContentState({
      style: value
    });
  }

  updateImage(newImage) {

    //TBD: When we write undo-redo we will remove the updated Image state and
    //instead use a file reader to get contents for this updated file from content.file
    this.setState({
      updatedFile: newImage.file
    });

    this.props.updateContentState({
      file: newImage.file,
      file_name: newImage.file.name,
      image_id: null,
      metadata: newImage.metadata
    });
  }

  handleTextChange(e) {
    this.props.updateContentState({
      text: e.target.value
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.content.image_id === null && nextProps.content.image_id !== null) {
      this.setState({
        updatedFile: null
      });
    }
  }

  render() {
    const { mode, content, authorId, collectionId, pageId, isDraft } = this.props;
    const { updatedFile } = this.state;

    const readOnly = mode !== 'edit';

    let input = null;

    if (readOnly) {
      input =  (<span className={ styles.downloadText } style={{ fontSize:'18px'}}>
                <SomethingWithIcon icon={ Icons.attachmentIcon }/>
                { content.text ? content.text : content.file_name }
              </span>);
    } else {
      input =  (<FormControl placeholder="Text to show on Link. If nothing specified filename will be used" value={ content.text }
        className="cmcomp-caption" onBlur={this.handleTextChange} onChange={this.handleTextChange}
      />);
    }

    let file = 'No File selected';

    if (updatedFile) {
      file = (<span>
            {input}<i> (*File will be uploaded on Save: {updatedFile.name})</i>
        </span>);
    } else if (content.image_id) {
      const filePath = getImagePath(!!collectionId, isDraft, authorId, pageId, content.image_id, collectionId) + '/' + content.file_name;
      file = <a href={filePath} target='_blank'>{input}</a>;
    }


    let children;
    if (readOnly) {
      children = <div className={ styles.file }>{file}</div>;
    } else {
      children = (<div>
                    <div className="edcomp-toolbar">
                      <ImageUploaderSlim ref={node => this.uploaderRef = node} saveChanges={this.updateImage} hasImage={!!file} nonImageUpload />
                    </div>
                    <div className={ styles.file }>{ file }</div>
                  </div>);
    }

    return (<div>
            {children}
           </div>);
  }
}
