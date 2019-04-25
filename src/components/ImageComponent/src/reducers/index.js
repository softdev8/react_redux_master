/* @flow weak */

'use strict';

import Immutable from 'immutable';
import R from 'ramda';
import {handleActions} from 'redux-actions'
import {createImmutableDelegator} from 'redux-delegator'

import {editableImageFct} from '../records/editableImage'
import {IMAGE_ADDITION, CURRENT_IMAGE_DELETION, CHANGE_CURRENT_IMAGE_INDEX, SAVE_CURRENT_IMAGE} from '../constants/images';
import {ANNOTATION_SAVE, ANNOTATION_DELETE} from '../constants/annotation';

const findIndexByPropVal = (collection, prop, val) => collection.findIndex((value) => value.get(prop) === val);
const updateCurrentEditableImage = (item, updateFunc)=> item.update('currentImage', (currentImage)=>
  currentImage.update('editableImage', updateFunc));

export { default as cropProcess } from '../cropperReducer'
export { default as annotationMove } from '../annotationMove'

const updateCurrentImageInItems = R.curry((currentImage, items)=> {
  const currentIndex = findIndexByPropVal(items, 'id', currentImage.get('id'));
  return items.set(currentIndex, currentImage);
});

const discardCurrentImage = (state)=> (
  state.update('currentImage', ()=> state.get('items').get(state.get('index')))
);

const changeCurentIndex = (state, {payload:index})=> (
  state.update('currentImage', ()=> state.get('items').get(index))
    .update('index', ()=> index)
);

const changeDeepImageIndex = (state, {payload:index})=> (
  state.update('deepImageIndex', ()=> index)
);

export const images = handleActions({
  IMAGE_ADDITION: (state, {payload:{dataUrl, size}})=> {
    const createNewImage = (id, dataUrl)=> {
      return Immutable.Map({
        id,

        editableImage: editableImageFct({
          image: {src: dataUrl, size},
          annotations: [],
        }),
      });
    };

    const newImageItem = createNewImage(state.get('lastId') + 1, dataUrl);

    return state.update('items', (oldImages)=>oldImages.push(newImageItem))
      .update('lastId', (lastId)=>Math.ceil(Math.max(newImageItem.get('id'), state.get('lastId'))))
      .update('currentImage', (currentImage)=>currentImage ? currentImage : newImageItem);
  },

  SAVE_IMAGE: (state, {payload:{index, server_src}})=> {
    return state
      .update('items', (oldImages)=>oldImages.update(index, (oldImage)=>oldImage.updateImageServerSrc(server_src)))
  },

  CURRENT_IMAGE_DELETION: (state)=> {
    const index = state.get('index');
    const setNearestImageAsCurrent = ()=> {
      const images = state.get('items');
      if (!images.count()) {
        return null;
      }
      return images.get(index - 1 < 0 ? 0 : index - 1);
    };

    return state
      .update('items', (oldImages)=>oldImages.delete(index))
      .update('currentImage', setNearestImageAsCurrent)
  },

  CHANGE_CURRENT_IMAGE_INDEX: changeCurentIndex,
  DISCARD_CURRENT_IMAGE: discardCurrentImage,
  '@@reduxReactRouter/locationDidChange': discardCurrentImage,

  ['RAW_IMAGE_MODIFICATION']: (state, {payload:{dataUrl}})=> (
    updateCurrentEditableImage(state, (editableImage)=> {
      return editableImage.updateImageSrc(dataUrl);
    })
  ),

  IMAGE_MODIFICATION: (state, {payload:{dataUrl, croppedRatioRect}})=> (
    updateCurrentEditableImage(state, (editableImage)=> {
      return editableImage.updateImageSrc(dataUrl).crop(dataUrl, croppedRatioRect);
    })
  ),

  ANNOTATION_DELETE: (state, {payload:{id}})=>
    updateCurrentEditableImage(state, (curImage)=>curImage.annotationDelete(id)),

  ANNOTATION_UPDATE: (state, {payload:{id, annotation:newAnnotation}})=>
    updateCurrentEditableImage(state, (curImage)=>curImage.updateAnnotation(id, ()=>newAnnotation)),

  ANNOTATION_SAVE: (state, {payload:{annotation, size}})=>
    updateCurrentEditableImage(state, (curImage)=>curImage.annotationSave(annotation, size)),

  SAVE_CURRENT_IMAGE: (state)=> {
    return state.update('items', updateCurrentImageInItems(state.get('currentImage')));
  },

  CURRENT_IMAGE_ROTATE: (state, {payload:degree})=> (
    updateCurrentEditableImage(state, (curImage)=>curImage.rotate(degree))
  ),

  PREVIOUS_IMAGE: (state)=> {
    const index = state.get('index');
    if (index <= 0) {
      return state;
    }

    return changeCurentIndex(state, {payload: index - 1})
  },

  NEXT_IMAGE: (state)=> {
    const index = state.get('index');
    const items = state.get('items');
    const count = items.count();
    if (index >= count - 1) {
      return state;
    }

    return changeCurentIndex(state, {payload: index + 1})
  },

  PREVIOUS_DEEP_IMAGE: (state)=> {
    const index = state.get('deepImageIndex');
    if (index <= 0) {
      return state;
    }

    return changeDeepImageIndex(state, {payload: index - 1})
  },

  NEXT_DEEP_IMAGE: (state)=> {
    const index = state.get('deepImageIndex');
    const items = state.get('items');
    const count = items.count();
    if (index >= count - 1) {
      return state;
    }

    return changeDeepImageIndex(state, {payload: index + 1})
  },
}, Immutable.fromJS({lastId: 0, items: [], index: 0, deepImageIndex: 0, currentImage: null}));


