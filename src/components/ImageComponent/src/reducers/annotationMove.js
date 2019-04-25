import Immutable from 'immutable';
import {handleActions} from 'redux-actions'
import R from 'ramda'
import {rectangleFct, rectangleFromOnePointFct, rectangleByPointsFct} from '../records/rectangle';
import {annotationFct} from '../records/annotation';
import {getRandomColor} from '../router/utils'
import {pointFct, pointFromScalarFct} from '../records/point';
import { 
         CREATE_MARKER,
         PENDING_ANNOTATION_CREATION_MOVE,
         MOVE_ANNOTATION,
         PENDING_ANNOTATION_CREATION_START,
         PENDING_ANNOTATION_CREATION_END,
         SET_PENDING_ANNOTATION
       } from '../constants/annotation';

const pointFromClientFct = ({clientX, clientY})=>pointFct({x: clientX, y: clientY});
const pointFromLeftTopFct = ({left, top})=>pointFct({x: left, y: top});

const adjustTrasform = R.curry((scalePoint, offsetPoint, point)=>(
  point.divide(scalePoint)
    .add(offsetPoint)
));

const SizeOfMarkerPoint = pointFct({x: 14, y: 24});

export default handleActions({
  CONTAINER_MOUSE:(state, {payload: mouseMode})=>{
    let _state = state.set('mouseMode', mouseMode)
    if(mouseMode == 'DOWN'){
      return _state.set('pressed', true)
    }
    if(mouseMode == 'UP'){
      return _state.set('pressed', false)
    }
    return _state;
  },

  SET_MODE:(state, {payload: mode})=>{
    return state.set('mode', mode)
  },

  SET_VISIBLE_VIEWER_TIMER:(state, {payload: viewerHideTimer})=>{
    return state.set('viewerHideTimer', viewerHideTimer)
  },

  SET_VISIBLE_VIEWER:(state, {payload: visibleViewerId})=>{
    return state.set('visibleViewerId', visibleViewerId)
  },

  SET_PENDING_ANNOTATION:(state, {payload: pendingAnnotation})=>{
    return state.set('pendingAnnotation', pendingAnnotation)
  },

  ANNOTATION_SAVE:(state)=>{
    return state.set('pendingAnnotation', null)
  },

  UPDATE_OFFSET:(state, {payload: offset})=>{
    return state.set('containerOffset', offset)
  },

  MOVE_ANNOTATION_END: (state, {payload:{scalePoint}})=> {
     return state.update('pendingAnnotation', 
      (pendingAnnotation)=>pendingAnnotation.update('rectangle', 
        (rect)=>rect.updatePointsOnTransform((point)=>point.divide(scalePoint))
      ).set('moving', false)
    )
  },

  MOVE_ANNOTATION: (state, {payload:{clientX, clientY, scalePoint, offsetPoint}})=> {
    const {mode, containerOffset} = state.toJS();
    const pendingAnnotation = state.get('pendingAnnotation');

    const myAdjustTransform = adjustTrasform(scalePoint, offsetPoint);
    const clientPoint = pointFromClientFct({clientX, clientY});

    const oldRectangle = pendingAnnotation.get('rectangle')
    const _pendingRectangle = oldRectangle.scale(scalePoint).add(offsetPoint);
   
    const newRectangle = _pendingRectangle
        .subtract(pointFromLeftTopFct(containerOffset))
        .subtract(_pendingRectangle.getTopLeftPoint())
        .add(clientPoint
          .add(_pendingRectangle.getTopLeftPoint())
          .subtract(_pendingRectangle.getCenterPoint()
            .add(pointFct({x: 0, y: -10}))
        ) 
      );

    return state.update('pendingAnnotation', (pendingAnnotation)=>
      pendingAnnotation.set('moving', true)
      .set('rectangle', newRectangle)
    )
  },

  PENDING_ANNOTATION_CREATION_START: (state, {payload})=> {
    const {containerOffset, mode} = state.toJS();
    const {clientX, clientY, deepEditableImage, deepImageIndex, scalePoint, offsetPoint} = payload;
    
    const myAdjustTransform = adjustTrasform(scalePoint, offsetPoint);

    const point = myAdjustTransform((pointFromClientFct({clientX, clientY})
      .subtract(pointFromLeftTopFct(containerOffset))));

    const annotationData = {
      rectangle: rectangleFromOnePointFct(point)
        .updatePointsCoordsOnTransform((coord)=>Math.round(coord)),
      drawing: true,
      type: mode,
    };

    if (mode == 'DEEPER_IMAGE') {
      annotationData.deepImageColor = getRandomColor();
      annotationData.image = {src: deepEditableImage.get('image').get('src')};
      annotationData.deepImageIndex = deepImageIndex;
    }

    return state
      .set('pendingAnnotation', annotationFct(annotationData))
  },

  PENDING_ANNOTATION_CREATION_MOVE: (state, {payload:{clientX, clientY, scalePoint, offsetPoint}})=> {
    const pendingAnnotation = state.get('pendingAnnotation');
    const {containerOffset, mode} = state.toJS();

    const myAdjustTransform = adjustTrasform(scalePoint, offsetPoint);

    const annotation = pendingAnnotation
      .update('rectangle',
      (rect)=>{
        const newPoint = myAdjustTransform((pointFromClientFct({clientX, clientY}).subtract(pointFromLeftTopFct(containerOffset))))

        const _rect = mode === 'MARKER'
        ?
        rect.updatePoint1(newPoint).updatePoint2(newPoint.add(SizeOfMarkerPoint))
        :
        rect.updatePoint2(newPoint);
  
        return _rect.updatePointsCoordsOnTransform(Math.round)
      }
    ); 

    return state.set('pendingAnnotation', annotation);
  },

  PENDING_ANNOTATION_CREATION_END: (state, {payload:{clientX, clientY, scalePoint, offsetPoint}})=> {
    const pendingAnnotation = state.get('pendingAnnotation');
    const {containerOffset, mode} = state.toJS();

    const myAdjustTransform = adjustTrasform(scalePoint, offsetPoint);

    let annotation = pendingAnnotation
      .set('drawing', false)
      .update('rectangle',
      (rect)=>rect.updatePoint2(myAdjustTransform((pointFromClientFct({clientX, clientY})
          .subtract(pointFromLeftTopFct(containerOffset))))
      ).updatePointsCoordsOnTransform(Math.round)
    )

    let newAnnotation;

    if (annotation.get('rectangle').getX2() < annotation.get('rectangle').getX1()) {
      newAnnotation = annotation
        .update('rectangle',
        (rect)=>(
          rect.updateX1(rect.getX2())
            .updateX2(rect.getX1())
        )
      );
      annotation = newAnnotation;
    }

    if (annotation.get('rectangle').getY2() < annotation.get('rectangle').getY1()) {
      newAnnotation = annotation
        .update('rectangle',
        (rect)=>(
          rect.updateY1(rect.getY2())
            .updateY2(rect.getY1())
        )
      );

      annotation = newAnnotation;
    }

    // Only save the pending change if the mark is bigger than a single point
    // In this case, vertical or horizontal lines are allowed
    const resAnnotation = Math.abs(annotation.get('rectangle').getSquare()) < 1 &&  mode !== 'MARKER' ? null : annotation;
    return state.set('pendingAnnotation', resAnnotation.set('drawing', false))
  },
}, Immutable.fromJS({mode:'MARKER'}));