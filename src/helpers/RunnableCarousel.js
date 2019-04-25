import React, { Component} from 'react';
import CommonUtility from './CommonUtility';
import styles from '../components/helpers/runnable.module.scss';
import { Glyphicon, Carousel, CarouselItem, CarouselCaption } from 'react-bootstrap';

export default class RunnableCarousel extends Component {

  constructor(props) {
    super(props);
    CommonUtility.downloadFile = CommonUtility.downloadFile.bind(this);
  }

  render() {
    const { activeIndex, direction, handleSelect, executionResult, execResultDiv } = this.props;

    let imgSrc = null;
    let file_array = executionResult.output_files.files;

    let file_data = file_array.map((file, index) => {
      const ext = file.substr(file.indexOf('.')+1);
      imgSrc = executionResult.output_files.rootPath + "/"+file;
      if(CommonUtility.checkImageExt(ext)){
        return  <Carousel.Item key = {index}>
                  <div>
                      <div className={styles.execution_file}><img id={"imgFile" +index} className={styles.img_center} src={imgSrc} /></div>
                  </div>
                </Carousel.Item>
      }
      else{
        return  <Carousel.Item key = {index}>
                  <div className={styles.dwnld_btn_center}>
                    <button id={imgSrc} className={styles.dwnld_btn} onClick={CommonUtility.downloadFile}><i className="fa fa-download" aria-hidden="true"></i> {file} </button>
                  </div>
                </Carousel.Item>
      }
    })

    return (
      <Carousel className="carousel_style" activeIndex={activeIndex}
        direction={direction} onSelect={handleSelect} wrap={false}>
          {file_data}
        <Carousel.Item>
          {execResultDiv}
        </Carousel.Item>
      </Carousel>
    );
  }
}
