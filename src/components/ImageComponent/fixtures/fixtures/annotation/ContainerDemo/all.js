import Deeperimage from '../Annotation/deeperimage'
import Highlight from '../Annotation/highlight'
import Hotspot from '../Annotation/hotspot'
import Marker from '../Annotation/marker'
import Square from '../Annotation/square'

import {pointFct} from '../../../../src/records/point'

export default {
    annotations:[
        Deeperimage.annotation,
        Highlight.annotation,
        Hotspot.annotation,
        Marker.annotation,
        Square.annotation
    ],
    pending: false,
    drawing: false,
    containerOffset: {
        top: 0,
        left: 0
    }, 
    updateOffset:(obj)=>{
      console.log('updateOffset')
      console.log(obj)
    },
    displayAnnotationViewer:(obj)=>{
      console.log('displayAnnotationViewer')
      console.log(obj)
    },
    hideAnnotationViewer:(obj)=>{
      console.log('hideAnnotationViewer')
      console.log(obj)
    },
    annotationsStartPriority:0,
    isEditable:true,
    scalePoint: pointFct({x:1, y:1}),
    offsetPoint: pointFct({x:0, y:0}),
    hidden: false,
    onSelect: ()=>{},
    onDeselect: ()=>{},
    onSave: ()=>{},
    onDevare: ()=>{}
};