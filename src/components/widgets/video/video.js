import styles from './video.module.scss';

import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from './ReactPlayer';

import {FormControl} from 'react-bootstrap';

const CaptionComponent = require('../../CaptionComponent/CaptionComponent');


export default class VideoComponent extends Component{
  static getComponentDefault () {
    const defaultContent = {
      version: '1.0',
      height: '450px',
      url: '',
    };
    return defaultContent;
  }

  constructor(props, context){
    super(props, context);

    this.handleCaptionChange     = this.handleCaptionChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleVideoSourceChange = this.handleVideoSourceChange.bind(this);
    this.handleVideoHeightChange = this.handleVideoHeightChange.bind(this);
    this.updateUrlIfNeeded = this.updateUrlIfNeeded.bind(this);
  }

  updateUrlIfNeeded(){
    if(this.props.mode=='edit'){
      const input_ref =  this.props.content.url == null || this.props.content.url == ''? this.url_input_emptyRef : this.url_inputRef;
      const domNode = findDOMNode(input_ref);
      domNode.value = this.props.content.url;
      $(domNode).focus();

      if(this.height_inputRef){
        findDOMNode(this.height_inputRef).value = this.props.content.height;
      }
    }
  }

  componentDidMount(){
    this.updateUrlIfNeeded();
  }

  componentDidUpdate(){
    this.updateUrlIfNeeded();
  }

  handleCaptionChange(caption) {
    this.props.updateContentState({
      caption,
    });
  }

  handleKeyUp(e) {
    if (e.key == 'Enter') {
      if(e.target.name == 'url'){
        this.handleVideoSourceChange(e);
      } else {
        this.handleVideoHeightChange(e);
      }
    }
  }


  handleVideoSourceChange(e) {
    if(e.target.value == this.props.content.url){
      return;
    }

    this.props.updateContentState({
      url: e.target.value,
    });
  }

  handleVideoHeightChange(e){
    if(e.target.value == this.props.content.url){
      return;
    }

    this.props.updateContentState({
      height: e.target.value,
    });
  }

  render(){
    const {mode, content, authorId, collectionId, pageId, isDraft} = this.props;
    let captionComponent = null;

    if (this.props.config == null || this.props.config.disableCaption == null || this.props.config.disableCaption != true) {
      captionComponent = <CaptionComponent
        caption={this.props.content.caption}
        readOnly={this.props.mode!='edit'}
        onCaptionChange={this.handleCaptionChange}/>;
    }

    const contentEmpty = content.url == null || content.url == '';

    let editorMarkerForViewMode = null;
    if(this.props.mode == 'view' && this.props.config && this.props.config.inEditor){
      editorMarkerForViewMode = <p className={styles.editText}>Click here to edit Video</p>;
    }

    let children;
    if(mode == 'edit'){

      if(contentEmpty){
        children = <div>
                  <FormControl
                        ref={node => this.url_input_emptyRef = node}
                        name='url'
                        placeholder='Paste a Youtube or Vimeo video link and press Enter'
                        onBlur={this.handleVideoSourceChange}
                        onKeyUp={this.handleKeyUp} />
              </div>;
      } else {
         children = <div>
                      <div className='edcomp-toolbar' style={{display: 'flex', alignItems: 'center'}}>
                        <span className={styles.label}>Video Source:</span>
                        <FormControl
                          style={{width: '450px'}}
                          className={styles.input}
                          ref={node => this.url_inputRef = node}
                          name='url'
                          placeholder='Paste a Youtube or Vimeo video link and press Enter'
                          onBlur={this.handleVideoSourceChange}
                          onKeyUp={this.handleKeyUp} />
                        <span className={styles.label}>Height:</span>
                        <FormControl
                          style={{width: '70px'}}
                          className={styles.heightInput}
                          ref={node => this.height_inputRef = node}
                          name='height'
                          onBlur={this.handleVideoHeightChange}
                          onKeyUp={this.handleKeyUp} />
                      </div>
                    </div>;
        }
    }

    return <div>
            {children}
            {editorMarkerForViewMode}
            {!contentEmpty?
              <div style={{textAlign:'center'}}>
                <ReactPlayer url={content.url} height={content.height}/>
              </div> : null}
            {!contentEmpty ? captionComponent : null}
           </div>;
  }
}