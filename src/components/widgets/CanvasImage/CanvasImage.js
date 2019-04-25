import styles from './CanvasImage.module.scss';

import React,{Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {Btn, SomethingWithIcon, ImageUploaderSlim} from '../../index';

export default class ImageComponent extends Component {

  static PropTypes = {
    content : PropTypes.object.required,
  };

  static getComponentDefault () {
    const defaultContent = {
      image_data: null,
    };
    return defaultContent;
  }

  constructor(props, context) {
    super(props, context);

    this.updateImage = this.updateImage.bind(this);
  }

  componentDidMount(){
    if(this.props.mode == 'edit'){
      if(this.refs.uploader && this.props.content.image_data == null){
        $(findDOMNode(this.refs.uploader)).find("input").click();
      }
    }
  }

  updateImage(newImage){
    this.props.updateContentState({
      image_data: newImage.thumbnail,
    });
  }

  render(){
    const {content} = this.props;

    let image= "No Image selected";
    if(content.image_data){
      image = <img className={styles.imgoriginal} src={content.image_data}/>;
    }

    return <div>
              <div className='edcomp-toolbar'>
                    <ImageUploaderSlim ref='uploader' saveChanges={this.updateImage} hasImage={!!image}/>
              </div>
              <div style={{textAlign:'center'}}>{image}</div>
           </div>;
  }
}