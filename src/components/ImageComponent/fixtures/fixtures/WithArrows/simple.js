import {editableImageFct} from '../../../src/records/editableImage'
import {annotationFct} from '../../../src/records/annotation'
import {pointFct} from '../../../src/records/point'
import {annotations} from '../annotation/ContainerDemo/all'
import {go} from '../../fixtures-share'
import R from 'ramda'
import React from 'react'
import pure from 'react-pure-component';

import Deeperimage from '../annotation/Annotation/deeperimage'
import Highlight from '../annotation/Annotation/highlight'
import Hotspot from '../annotation/Annotation/hotspot'
import Marker from '../annotation/Annotation/marker'
import Square from '../annotation/Annotation/square'
import ImageOnSteroidsResizableByParent from '../../../src/components/image/ImageOnSteroidsResizableByParent'

const createImage = (dataUrl)=> (
  editableImageFct({
    image: {src: dataUrl, size: {width: 500, height: 500}},
    annotations: [
      Deeperimage.annotation,
      Highlight.annotation,
      Hotspot.annotation,
      Marker.annotation,
      Square.annotation
    ]
  })
);

const editableImage = createImage(go);

export default {
  children: <ImageOnSteroidsResizableByParent 
    updateOffset={(obj)=>{
      console.log('updateOffset')
      console.log(obj)
    }}
    displayAnnotationViewer={(obj)=>{
      console.log('displayAnnotationViewer')
      console.log(obj)
    }}
    hideAnnotationViewer={(obj)=>{
      console.log('hideAnnotationViewer')
      console.log(obj)
    }}
    editableImage={editableImage} 
    containerOffset={{
          top: 0,
          left: 0
    }}/>
};