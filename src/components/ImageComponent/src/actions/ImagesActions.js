/* @flow weak */
'use strict';

import R from 'ramda';
import $ from 'jquery';

import { createAction } from 'redux-actions';

const uploadImage = (base64ImageUrl)=>new Promise((resolve, reject)=> {


});

export const imageModification = (dataUrl, croppedRatioRect)=> {
  return (dispatch) => {
    dispatch(createAction('IMAGE_MODIFICATION')({dataUrl, croppedRatioRect}));
    dispatch(createAction('SAVE_CURRENT_IMAGE')());
  }
};

const getBlobPromise = (file)=>
  new Promise((resolve) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = ()=> {
      resolve(reader.result)
    };
  });

const getBlobImageSizePromise = (imageUrl)=>
  new Promise((resolve) => {
    $('<img>').on('load', function load() {
      resolve({width: this.width, height: this.height});
    }).attr('src', imageUrl);
  });


export const uploadImages = ()=> {
  return (dispatch, getState) => {
    const images = getState();

    images.forEach(
      (value, key) => {
        const base64ImageUrl = value.get('editableImage').get('image').get('src');
        uploadImage(base64ImageUrl)
          .then((server_src)=>dispatch(createAction('SAVE_CURRENT_IMAGE')({server_src, index: key})));
      }
    );
  }
};

export const imagesAdded = (files)=> {
  return (dispatch) => {

    const takeMaxFiles = R.identity;

    const addPreview = R.map((file)=> {
      file.preview = URL.createObjectURL(file);
      return file;
    });

    Promise.all(R.map((file)=>getBlobPromise(file)
        .then((dataUrl)=>
          getBlobImageSizePromise(dataUrl)
            .then((size)=> ({size, dataUrl}))
      )
    )(R.compose(addPreview, takeMaxFiles)(files)))
      .then((images)=> {
        R.forEach(({size, dataUrl})=> {
          dispatch({
            type: 'IMAGE_ADDITION',
            payload: {dataUrl, size},
          })

        })(images)
      });
  }
};
