/* @flow weak */

'use strict';

import Immutable from 'immutable';
import R from 'ramda';
import {handleActions} from 'redux-actions'
import {createImmutableDelegator} from 'redux-delegator'

import {rectangleByPointsAndSizeFct, rectangleBySizeFct} from '../records/rectangle';
import {pointFromSize} from '../records/point';
import {sizeFct} from '../records/size';
import $ from 'jquery';

import {editableImageFct} from '../records/editableImage'
import {NEW_CROP_INFO, CROPPER_CROP_MOUNTED,
  CROPPER_CROP_UNMOUNTED,
  CROPPER_MOVE,
  CROPPER_ZOOM,
  CROPPER_ROTATE,
  CROPPER_ENABLE,
  CROPPER_DISABLE,
  CROPPER_RESET,
  CROPPER_CLEAR,
  CROPPER_REPLACE} from '../constants/crop';

const imageCropReducer = handleActions({
  CROPPER_CROP_MOUNTED: (imageCrop, {payload:{imageCrop:newImageCrop, props}}) => {
    newImageCrop.cropper(props);
    return newImageCrop
  },

  CROPPER_CROP_UNMOUNTED: (imageCrop)=> {
    imageCrop.cropper('destroy');
    return {};
  },

  CROPPER_MOVE: (imageCrop, {payload:{offsetX, offsetY}})=>imageCrop.cropper('move', offsetX, offsetY),
  CROPPER_ZOOM: (imageCrop, {payload:{ratio}})=>imageCrop.cropper('zoom', ratio),
  CROPPER_ENABLE: (imageCrop)=>imageCrop.cropper('enable'),
  CROPPER_DISABLE: (imageCrop)=>imageCrop.cropper('disable'),
  CROPPER_RESET: (imageCrop)=>imageCrop.cropper('reset'),
  CROPPER_CLEAR: (imageCrop)=>imageCrop.cropper('clear'),

  CROPPER_REPLACE: (imageCrop, {payload:url})=>{
    imageCrop.cropper('replace', url)
    return imageCrop
  },
});

const imageCropReducerDelegation = (state, action)=>state.update('imageCrop', (imageCrop)=>imageCropReducer(imageCrop, action));

export default handleActions({
  NEW_CROP_INFO: (state)=> {
    // TODO FIX THIS HACK!!
    // if ($('.cropper-container').length > 1) {
    //   $('.cropper-container')[0].remove()
    // }
    const imageCrop = state.get('imageCrop');
    if (!imageCrop) return;

    const cropBox = imageCrop.cropper('getCropBoxData');
    const image = imageCrop.cropper('getImageData');
    const canvas = imageCrop.cropper('getCanvasData');

    return state
      .update('cropBoxRect', ()=>rectangleByPointsAndSizeFct(cropBox))
      .update('naturalImageSize', ()=>sizeFct({width: image.naturalWidth, height: image.naturalHeight}))
      .update('rotate', ()=>image.rotate)
      .update('imageRect', ()=>rectangleByPointsAndSizeFct(image))
      .update('canvasRect', ()=>rectangleByPointsAndSizeFct(canvas))
  },

  CROPPER_CROP_MOUNTED: imageCropReducerDelegation,
  CROPPER_CROP_UNMOUNTED: imageCropReducerDelegation,
  CROPPER_MOVE: imageCropReducerDelegation,
  CROPPER_ZOOM: imageCropReducerDelegation,
  CROPPER_ENABLE: imageCropReducerDelegation,
  CROPPER_DISABLE: imageCropReducerDelegation,
  CROPPER_RESET: imageCropReducerDelegation,
  CROPPER_CLEAR: imageCropReducerDelegation,
  CROPPER_REPLACE: imageCropReducerDelegation,

  NEW_CROPPER: (state, {payload})=>(state.update('imageCrop', ()=> {
    //state.get('imageCrop').cropper('destroy');
    return payload
  })),
}, Immutable.fromJS({
  imageCrop: {},
  cropBoxRect: {},
  naturalImageSize: {},
  rotate: 0,
  imageRect: rectangleBySizeFct({width: 0, height: 0}),
  canvasRect: rectangleBySizeFct({width: 0, height: 0}),
}));
