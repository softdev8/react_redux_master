/*eslint-disable */

import React, { Component } from 'react';
import R from 'ramda';
import { bindActionCreators } from 'redux';
import {  Connector } from 'react-redux';
import * as reducers from '../reducers';
import * as ImagesActions from '../actions/ImagesActions';
import * as AnnotationActions from '../actions/AnnotationActions';
import ImageSlide from '../image/image-slide';


export default class ImageComponentApp extends Component {
  render() {
    return (
      <Connector select={(stores) =>{
            const root = stores.root;
                return {
                  images: root.get('items'),
                  currentImage: root.get('currentImage'),
                };
            }}>
        {this.renderChild}
      </Connector>
    );
  }

  renderChild({currentImage, images, dispatch }) {
    const annotationActions = bindActionCreators(AnnotationActions, dispatch);
    const imagesActions = bindActionCreators(ImagesActions, dispatch);
    // const toSrc = (editableImage)=> editableImage.get('editableImage').get('image').get('src');

    const currentImageChecked = currentImage ? currentImage.get('editableImage') : null;

    // const imagesSources = R.map(toSrc)(images);

    return <ImageSlide
      images={R.map((editableImage)=> editableImage.get('editableImage'))(images)}
      currentImage={currentImageChecked}
      annotationSave={annotationActions.annotationSave}
      annotationDelete={annotationActions.annotationDelete}
      imageRotated={imagesActions.imageRotated}
      imageModification={imagesActions.imageModification}
      imagesAdded={imagesActions.imagesAdded}
      imageDelete={imagesActions.imageDelete}
      currentImageChanged={imagesActions.currentImageChanged}
      />;
  }
}
