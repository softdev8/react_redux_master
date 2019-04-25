/* @flow weak */
import React from 'react';
import { Connector } from 'react-redux';
import R from 'ramda';
import { transitionTo } from '../../external/redux-react-router';

import {radPure, clone, CreateNamedComponent, mapDispatchFunc} from '../utils';

import ToggleWithOnChangeFixed  from '../toggle';

import ModeToggle from '../annotation/ModeToggle';
import Dropzone from '../drop/Dropzone';
import Carusel from '../image/carusel';
import {rectangleByPointsAndSizeFct} from '../../records/rectangle';
import { bindActionCreators } from 'redux';

import * as ImagesActions from '../../actions/ImagesActions';
import * as CropActions from '../../actions/CropActions';
import * as AnnotationActions from '../../actions/AnnotationActions';

import { Annotate, CropRotate } from '../image/editImageModes';
import { Shape, Deepimage, Hotspot} from '../../constants/annotation-options';

import createRadio from '../radio'

import CropperPane from '../image/CropperPane';
import ImageOnSteroids from '../image/ImageOnSteroids';
import AnnotationImagePane from '../image/AnnotationImagePane';
import ImageOnSteroidsResizableByParent  from '../image/ImageOnSteroidsResizableByParent';
import WithArrows  from '../WithArrows';

import annotationOptions, {annotationPathsMap, annotationInvertPathsMap} from '../../constants/annotation-options';
import { createAction } from 'redux-actions';
const EditModeRadio = createRadio(Annotate, [Annotate, CropRotate]);
import View  from 'react-flexbox';
import {ResizeByParent} from 'react-size-decorator';
import {pointFct, pointFromSize} from '../../records/point';
import {sizeFct} from '../../records/size';

const selectEditableImage = ({images}) => {
  const currentImage = images.get('currentImage');
  const editableImage = currentImage ? currentImage.get('editableImage') : null;
  return editableImage;
};

const selectDeepEditableImage = ({images}) => {
  const deepImageIndex = images.get('deepImageIndex');
  const deepEditableImage = images ? images.get('items').get(deepImageIndex).get('editableImage') : null;
  return deepEditableImage;
};

export const ConnectedDropzone = radPure(() => (
  <Connector select={s => s}>
    {({dispatch})=> {
      const actions = bindActionCreators(ImagesActions, dispatch);
      return <Dropzone onDrop={actions.imagesAdded} size='100%'>
        <div style={{padding: 30}}>Try dropping some files here.</div>
      </Dropzone>
    }}
  </Connector>
));

export const ConnectedDeepImageOptions = radPure(({}) => (
  <Connector select={(s)=>({editableImage: selectDeepEditableImage(s)})}>{({editableImage, dispatch}) =>
    <ResizeByParent>
      {({width, height})=>(
        <div>
          <WithArrows style={{width, height}}
                      onLeftClick={()=>dispatch(createAction('PREVIOUS_DEEP_IMAGE')())}
                      onRightClick={()=>dispatch(createAction('NEXT_DEEP_IMAGE')())}
            >
            <ImageOnSteroidsResizableByParent editableImage={editableImage}/>
          </WithArrows>
        </div>
      )}
    </ResizeByParent>
  }</Connector>
));

const {MARKER, HOTSPOT, DEEPER_IMAGE, SQUARE, CIRCLE, HIGHLIGHT} = annotationOptions;

const connectedModeToggleSelector = ({router:{pathname}}) => {
  const getMode = (pathname) => {
    const match = /\/edit\/annotate\/(.*?)\/?$/.exec(pathname)
    return match ? match[1] : null
  };

  const mode = annotationInvertPathsMap[getMode(pathname)];
  return mode
};

export const ConnectedModeToggle = radPure(() => (
  <Connector select={(s)=>({mode:connectedModeToggleSelector(s)})}>
    {({dispatch, mode})=>
      <ModeToggle mode={mode}
                  switchMode={(mode)=>
                    {
                      dispatch(createAction('SET_MODE')(mode))
                    return mapDispatchFunc(R.compose(
           dispatch,
           transitionTo,
           (annotationType)=>`/edit/annotate/${annotationPathsMap[annotationType]}`
           ))(annotationOptions)(mode)
         }
          }/>
    }
  </Connector>
));

export const ConnectedToggleWithOnChangeFixed = radPure(()=>
  (
    <Connector select={s =>s}>{(props) => {
      const { dispatch , router:{pathname}} = props;

      return <ToggleWithOnChangeFixed
        defaultChecked={pathname.indexOf('/edit')>0}
        onToggle={mapDispatchFunc(R.compose(dispatch, transitionTo))({
          false:'/edit/annotate/marker',
          true:'/preview',
        })}
        />
    }}
    </Connector>
  ));

export const ConnectedCropOptions = radPure(()=>
    (
      <Connector select={s =>s}>{({ dispatch }) => {
        const actions = bindActionCreators(CropActions, dispatch);

        return <View column>
          <View row>
            <View column>
              <button onClick={()=>actions.imageRotateRequest(270)}>rotate -90</button>
            </View>
            <View column>
              <button onClick={()=>actions.imageRotateRequest(90)}>rotate 90</button>
            </View>
          </View>
          <View row>
            <View column>
              <button onClick={()=>actions.imageCropRequest()}>crop</button>
            </View>
          </View>
        </View>
      }}
      </Connector>
    )
);

export const ConnectedDeleteButton = radPure(()=>
  (
    <Connector select={s =>s}>{({ dispatch }) => (
      <button onClick={()=>dispatch(createAction('CURRENT_IMAGE_DELETION')())}>delete</button>
    )}
    </Connector>
  ));

export const ConnectedEditModeRadio = radPure(()=>
  (
    <Connector select={s =>s}>{({ dispatch }) => (
      <EditModeRadio changeMode={mapDispatchFunc(R.compose(dispatch, transitionTo))({
        Annotate:'/edit/annotate/marker',
        CropRotate:'/edit/crop-rotate',
      })
      }/>)}
    </Connector>
  ));

export const ConnectedCarusel = radPure(() =>
    <Connector select={s => s}>{({dispatch, images, editMode}) =>
      <ResizeByParent>
        {({width, height})=>
          <Carusel
            width={width}
            height={height}
            onLeftClick={()=>dispatch(createAction('PREVIOUS_IMAGE')())}
            onRightClick={()=>dispatch(createAction('NEXT_IMAGE')())}
            indexChanged={(index)=>dispatch(createAction('CHANGE_CURRENT_IMAGE_INDEX')(index))}
            currentImage={images.get('currentImage')}
            images={images.get('items')}
            isEditMode={editMode}
            />
        }
      </ResizeByParent>
    }</Connector>
);

const writeProps = (selector) => radPure((props) => (
  <div>{selector(props)}</div>
));

const connectedCropActivePaneSelector = (s) => {
  const {cropProcess} = s;
  const imageCrop = cropProcess.get('imageCrop');
  const naturalImageSize = cropProcess.get('naturalImageSize');
  const cropBoxRect = cropProcess.get('cropBoxRect');
  const imageRect = cropProcess.get('imageRect');
  const canvasRect = cropProcess.get('canvasRect');
  const editableImage = selectEditableImage(s);

  return {naturalImageSize, imageCrop, cropBoxRect, imageRect, canvasRect, editableImage}
};

export const ConnectedCropActivePane = radPure(() => (
  <Connector select={connectedCropActivePaneSelector}>
    {(selectedStateAndDispatch) =>
      {
        const {dispatch, editableImage, imageCrop, ...selectedState} = selectedStateAndDispatch;
        return <ResizeByParent>
        {({width, height})=> {
          const {newCropInfo, ...actions} = bindActionCreators(CropActions, dispatch);
          const scaledEditableImage = editableImage ?
            editableImage.adjustSize(editableImage.getSize().toJS(),
              {width, height}) : null;

          return editableImage && width && height ? <div style={{position:'absolute'}}>
            <CropperPane
              {...selectedState} 
              {...actions}
              style={{width,height}}
              original_editable_image={editableImage}
              editableImage={scaledEditableImage}
              noAnimation={true}
              $img={imageCrop}
              crop={()=>setTimeout(()=>newCropInfo(), 0)}        
              cropperMounted={(imageCrop, props)=>dispatch(createAction('CROPPER_CROP_MOUNTED')({imageCrop, props}))}
              cropperUnmounted={()=>dispatch(createAction('CROPPER_CROP_UNMOUNTED')())}
              forbidClicks={true}
              /></div> : null;
        }}
      </ResizeByParent>
    }
    }
  </Connector>));

const connectedPreviewSelector = (s) => {
  const {images, annotationMove} = s;
  return {
    visibleViewerId: annotationMove.get('visibleViewerId'),
    editableImage:selectEditableImage(s),
  };
};

export const ConnectedPreview = radPure(() => (
  <Connector select={connectedPreviewSelector}>
    {(selectedStateAndDispatch) =>
    {
     const {dispatch, ...selectedState} = selectedStateAndDispatch;
     const actions = bindActionCreators(AnnotationActions, dispatch);
     return <ResizeByParent>
        {({width, height})=>(
          <WithArrows style={{width, height}}
                      onLeftClick={()=>dispatch(createAction('PREVIOUS_IMAGE')())}
                      onRightClick={()=>dispatch(createAction('NEXT_IMAGE')())}
            >
            <ImageOnSteroidsResizableByParent 
              {...actions}
              onDeepImageClick={(index)=>dispatch(createAction('CHANGE_CURRENT_IMAGE_INDEX')(index))}
              {...selectedState}/>
          </WithArrows>
        )}
      </ResizeByParent>
    }
  }
  </Connector>
));

const connectedAnnotateActivePaneSelector = (s) => {
  const {images, annotationMove} = s;
  return {
    deepImageIndex: images.get('deepImageIndex'),
    deepEditableImage: selectDeepEditableImage(s),
    pendingAnnotation: annotationMove.get('pendingAnnotation'),
    visibleViewerId: annotationMove.get('visibleViewerId'),
    editableImage: selectEditableImage(s),
    mode: connectedModeToggleSelector(s),
    containerOffset: annotationMove.get('containerOffset'),
  };
};

export const ConnectedAnnotateActivePane = radPure(() => (
  <Connector select={connectedAnnotateActivePaneSelector}>
    {(selectedStateAndDispatch) =>
      {
      const {dispatch, editableImage, ...selectedState} = selectedStateAndDispatch;
      return <ResizeByParent>
        {({width, height})=> {
          const actions = bindActionCreators(AnnotationActions, dispatch);

          const scaledEditableImage = editableImage ?
            editableImage.adjustSize(editableImage.getSize().toJS(), {width, height}) 
            : null;

          const sizePoint = pointFromSize(sizeFct({width, height}));
          const oldSizePoint = pointFromSize(sizeFct(editableImage.getSize().toJS()));

          const scalePoint = sizePoint.divide(oldSizePoint);

          return editableImage ? <div style={{position:'absolute'}}>
            <AnnotationImagePane
              {...actions}
              {...selectedState}
              editableImage={scaledEditableImage}
              isEditable={true}
              canAnnotate={true}
              forbidClicks={true}
              scale={scalePoint}
              style={{width,height}}
              /></div> : null;
        }}
      </ResizeByParent>
    }
    }</Connector>
));
