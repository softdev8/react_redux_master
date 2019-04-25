import {editableImageFct} from '../../../../src/records/editableImage'
import {annotationFct} from '../../../../src/records/annotation'
import {pointFct} from '../../../../src/records/point'
import {annotations} from '../../annotation/ContainerDemo/all'
import {go} from '../../../fixtures-share'
import R from 'ramda'

import Deeperimage from '../../annotation/Annotation/deeperimage'
import Highlight from '../../annotation/Annotation/highlight'
import Hotspot from '../../annotation/Annotation/hotspot'
import Marker from '../../annotation/Annotation/marker'
import Square from '../../annotation/Annotation/square'

const size = {width: 600, height: 200};
const oldSize = {width: 500, height: 500};

const createImage = (dataUrl)=> (
     editableImageFct({
      image: {src: dataUrl, size:oldSize},
       annotations:[
          Deeperimage.annotation,
         Highlight.annotation,
         Hotspot.annotation,
         Marker.annotation,
         Square.annotation
       ]
    })
);

const editableImage = createImage(go)
  .adjustSize(oldSize, size);

export default {
  editableImage
};