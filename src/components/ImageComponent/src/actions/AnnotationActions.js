/* @flow weak */

'use strict';
import { createAction } from 'redux-actions';
import R from 'ramda'
import { 
         CREATE_MARKER,
         PENDING_ANNOTATION_CREATION_MOVE,
         MOVE_ANNOTATION,
         PENDING_ANNOTATION_CREATION_START,
         PENDING_ANNOTATION_CREATION_END
       } from '../constants/annotation';

const isPropEq = R.curry((propName, targetVal, state)=>{
 const {annotationMove} = state;
 return annotationMove.get(propName) == targetVal;
})
   
const isEqMode = isPropEq('mode');

const hasProp =  R.curry((targetProp, state)=>{
 const {annotationMove} = state;
 return !!annotationMove.get(targetProp); 
})

const pendingAnnotationHasProp = R.curry((targetProp, state)=>{
 const {annotationMove} = state;
 const pendingAnnotation = annotationMove.get('pendingAnnotation');
 return pendingAnnotation && !!pendingAnnotation.get(targetProp); 
})

const conditionalAC = R.curry((cond, ac, obj)=>
  (dispatch, getState) => {
    if (!cond(obj, getState())) {
      return;
    }   

    const acResult = ac(obj);
    
    typeof acResult === "function" ? acResult(dispatch, getState) : dispatch(acResult)
  }
)
const editableAC = conditionalAC((obj)=>!!obj.isEditable)

const pendingAnnotationAc = (val)=>conditionalAC((obj, state)=>hasProp('pendingAnnotation')(state) === val)

export const annotationSave = ({content, size})=> {
  return (dispatch, getState) => {
    const pendingAnnotation = getState().annotationMove.get('pendingAnnotation');

    const annotation = pendingAnnotation
      .set('content', content)
      .set('timeStamp', new Date())

    dispatch(createAction('ANNOTATION_SAVE')({annotation, size}));
    dispatch(createAction('SAVE_CURRENT_IMAGE')());
  }
};

export const annotationDelete = (id)=> {
  return (dispatch) => {
    dispatch(createAction('ANNOTATION_DELETE')({id}));
    dispatch(createAction('SAVE_CURRENT_IMAGE')());
  }
};

export const updateAnnotation = ({id, annotation})=> {
  return (dispatch) => {
    dispatch(createAction('ANNOTATION_UPDATE')({id, annotation}));
    dispatch(createAction('SAVE_CURRENT_IMAGE')());
  }
};

export const annotationEdit = conditionalAC(({id}, state)=> !!id)
(({id, size}) => {
  return (dispatch, getState) => {
    dispatch(setPendingAnnotation({id, size}))
    dispatch(createAction('SET_VISIBLE_VIEWER')(id))
  }
})


export const annotationCancel = pendingAnnotationAc(true)
(({size}) => {
  return (dispatch, getState) => {
    const {annotationMove} = getState();
    const pendingAnnotation = annotationMove.get('pendingAnnotation');
    if(pendingAnnotation.get('id')){
      const newAnnotation = pendingAnnotation.set('moving', false);
      dispatch(createAction('ANNOTATION_SAVE')({annotation:newAnnotation, size}));
      dispatch(createAction('SAVE_CURRENT_IMAGE')());
    }

    dispatch(createAction('SET_PENDING_ANNOTATION')(null))
  }
})

export const displayAnnotationViewer = conditionalAC((id, state)=> !!id && !pendingAnnotationHasProp('moving')(state))
((id)=> {
  return (dispatch, getState) => {
    const {annotationMove} = getState();
    const viewerHideTimer = annotationMove.get('viewerHideTimer');

    clearTimeout(viewerHideTimer);
    dispatch(createAction('SET_VISIBLE_VIEWER_TIMER')(null))
    dispatch(createAction('SET_VISIBLE_VIEWER')(id))
  }
})

export const hideAnnotationViewer = () =>{
    return (dispatch, getState) => {
      const {annotationMove} = getState();
      const pendingAnnotation = annotationMove.get('pendingAnnotation');
      const viewerHideTimer = annotationMove.get('viewerHideTimer');

      clearTimeout(viewerHideTimer);

      const newViewerHideTimer = setTimeout(() => {
        dispatch(createAction('SET_VISIBLE_VIEWER_TIMER')(null))
        dispatch(createAction('SET_VISIBLE_VIEWER')(null))
      }, 300);

      dispatch(createAction('SET_VISIBLE_VIEWER_TIMER')(newViewerHideTimer))
  }
}

export const moveAnnotationStart = R.compose(
  editableAC,
  pendingAnnotationAc(false),
  conditionalAC((obj, state)=> !pendingAnnotationHasProp('drawing')(state))
)((obj)=>{
  return (dispatch, getState) => {
    dispatch(setPendingAnnotation(obj));
    dispatch(createAction('MOVE_ANNOTATION')(obj));
  }
})

const moveCond = (obj, state)=> !pendingAnnotationHasProp('drawing')(state) && pendingAnnotationHasProp('moving')(state); 

export const moveAnnotation = R.compose(
  editableAC,
  pendingAnnotationAc(true),
  conditionalAC(moveCond)
)
(createAction('MOVE_ANNOTATION'))

export const moveAnnotationEnd = R.compose(
  editableAC,
  pendingAnnotationAc(true),
  conditionalAC(moveCond)
)
(({id, size})=> {
  return (dispatch, getState) => {
    const {annotationMove} = getState();
    const pendingAnnotation = annotationMove.get('pendingAnnotation');
    const newAnnotation = pendingAnnotation.set('moving', false);

    dispatch(createAction('ANNOTATION_SAVE')({annotation:newAnnotation, size}));
    dispatch(createAction('SET_PENDING_ANNOTATION')(null))
    dispatch(createAction('SAVE_CURRENT_IMAGE')());
  }
})

export const pendingAnnotationCreationStart = R.compose(
  pendingAnnotationAc(false),
  conditionalAC((obj, state)=> !pendingAnnotationHasProp('moving')(state))
)(
(obj)=>{
  return (dispatch, getState) => {
    // console.log('###')
    // const {images} = getState();
    // obj.deepEditableImage = images.get('deepEditableImage');
    // obj.deepImageIndex = images.get('deepImageIndex');
    dispatch(createAction('PENDING_ANNOTATION_CREATION_START')(obj))
  }
})

export const pendingAnnotationCreationMove = R.compose(
  pendingAnnotationAc(true),
  conditionalAC((obj, state)=> hasProp('pressed')(state))
)(createAction('PENDING_ANNOTATION_CREATION_MOVE'))

export const pendingAnnotationCreationEnd = R.compose(
  pendingAnnotationAc(true),
  conditionalAC((obj, state)=> !pendingAnnotationHasProp('moving')(state))
)(createAction('PENDING_ANNOTATION_CREATION_END'))

export const onContainerMouseUp = editableAC(
(obj)=>{
  return (dispatch, getState) => {
    dispatch(createAction('CONTAINER_MOUSE')('UP'));
    dispatch(pendingAnnotationCreationEnd(obj))
    dispatch(moveAnnotationEnd(obj))
  }
})

export const onContainerMouseMove = editableAC(
(obj)=>{
  return (dispatch, getState) => {
   // dispatch(createAction('CONTAINER_MOUSE')('MOVE'));
    dispatch(pendingAnnotationCreationMove(obj))
    dispatch(moveAnnotation(obj))
  }
})

export const onContainerMouseDown = editableAC(
(obj)=>{
  return (dispatch, getState) => {
    dispatch(createAction('CONTAINER_MOUSE')('DOWN'));
    dispatch(pendingAnnotationCreationStart(obj));
  }
})

export const setPendingAnnotation = pendingAnnotationAc(false)(
({id, size})=>{
  return (dispatch, getState) => {
    const {images} = getState()
    const currentImage = images.get('currentImage')
    const annotations = currentImage.get('editableImage').get('annotations') 
    const annotation = annotations.find((value) => value.get('id') === id);
    const origImgSize = currentImage.get('editableImage').getSize().toJS();
    const annotationToSave = annotation.adjustSize(origImgSize, size)

    dispatch(createAction('ANNOTATION_DELETE')({id}))
    dispatch(createAction('SET_PENDING_ANNOTATION')(annotationToSave))
  }
})

export const setMode = (obj)=>createAction('SET_MODE')(obj);
export const updateOffset = (obj)=>createAction('UPDATE_OFFSET')(obj);
export const createMarker = (obj)=>createAction('CREATE_MARKER')(obj);
