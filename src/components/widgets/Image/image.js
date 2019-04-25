import styles from './Image.module.scss';

import React,{Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
const serverUrl = require('../../../config-old').serverUrl;

import {Btn, SomethingWithIcon, ImageUploaderSlim} from '../../index';
import getImagePath from '../../../utils/getImagePath';
const CaptionComponent = require('../../CaptionComponent/CaptionComponent');

export default class ImageComponent extends Component {

  static PropTypes = {
    mode  : PropTypes.string.isRequired,
    content : PropTypes.object.isRequired,
  }

  static getComponentDefault () {
    const defaultContent = {
      image_id: null,
      style: 'responsive',
      caption: '',
    };
    return defaultContent;
  }

  constructor(props, context) {
    super(props, context);

    this.updateImage = this.updateImage.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);

    this.state = {
      updatedImage : null,
    }
  }

  componentDidMount(){
    if(this.props.mode == 'edit'){
      if(this.refs.uploader && this.props.content.image_id == null){
        $(findDOMNode(this.refs.uploader)).find("input").click();
      }
    }
  }

  onImageStyleChange(value, event) {
    this.props.updateContentState({
      style: value,
    });
  }

  updateImage(newImage){
    //TBD: When we write undo-redo we will remove the updated Image state and
    //instead use a file reader to get contents for this updated file from content.file
    this.setState({
      updatedImage: newImage.thumbnail,
    });

    this.props.updateContentState({
      file: newImage.file,
      image_id: null,
      metadata: newImage.metadata,
    });
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({
      caption,
    });
  }

  render(){
    const {mode, content, authorId, collectionId, pageId, isDraft} = this.props;
    const {updatedImage} = this.state;

    let isResponsive = false;
    if(!content.style || content.style == 'responsive'){
      isResponsive = true;
    }

    let image= "No Image selected";
    if(updatedImage){
      image = <img className={isResponsive ? styles.imgresponsive : styles.imgoriginal} src={updatedImage}/>;
    } else if(content.image_id){
      let imagePath = getImagePath(!!collectionId, isDraft, authorId, pageId, content.image_id, collectionId);
      image = <img className={isResponsive ? styles.imgresponsive : styles.imgoriginal} src={`${imagePath}.png`}/>;
    }

    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={this.props.mode!='edit'}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    let children;
    if(mode != 'edit'){
      children = <div style={{textAlign:'center'}}>{image}</div>;
    } else {
       children = <div>
                    <div className='edcomp-toolbar'>
                      <ImageUploaderSlim ref='uploader' saveChanges={this.updateImage} hasImage={!!image}/>
                      <Btn default className={styles.button} active={isResponsive} onClick={this.onImageStyleChange.bind(this, 'responsive')}>
                        <SomethingWithIcon icon='' text='Responsive' />
                      </Btn>
                      <Btn default className={styles.button} active={!isResponsive} onClick={this.onImageStyleChange.bind(this, 'original')}>
                        <SomethingWithIcon icon='' text='Original Size' />
                      </Btn>
                    </div>
                    <div style={{textAlign:'center'}}>{image}</div>
                  </div>;
    }

    return <div>
            {children}
            {captionComponent}
           </div>;
  }
}
