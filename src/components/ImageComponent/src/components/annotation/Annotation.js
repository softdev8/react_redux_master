'use strict';
import {Spring} from 'react-motion';
import React, {Component, PropTypes} from 'react'
import Content from '../Content';
import Input from '../Input';
import {pointFct, pointFromScalarFct} from '../../records/point';
import R from 'ramda'
import annotationOptions from '../../constants/annotation-options';
const {MARKER, HOTSPOT, DEEPER_IMAGE, SQUARE, CIRCLE, HIGHLIGHT} = annotationOptions;

import Marker from '../items/Marker';
import Square from '../items/Square';
import Circle from '../items/Circle';
import Highlight from '../items/Highlight';
import Hotspot from '../items/Hotspot';
import DeeperImage from '../items/DeeperImage';

const pointFromLeftTopFct = ({left, top})=>pointFct({x: left, y: top});
const pointFromClientFct = ({clientX, clientY})=>pointFct({x: clientX, y: clientY});

// Globals
let BUBBLEDIM = {width: 260, height: 120};     // Make the marker land at the tip of the pointer. Not sure how this varies between browsers/OSes

export default class Annotation extends Component {
  constructor() {
    super();
    this.renderOnCoords = this.renderOnCoords.bind(this);
  }

  static propTypes = {
    pending: PropTypes.bool.isRequired,
    drawing: PropTypes.bool.isRequired,
    annotationDelete: PropTypes.func.isRequired,
    shouldDisplayViewer: PropTypes.bool.isRequired,
    deemphasize: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    containerOffset: PropTypes.object.isRequired,

    //Optional
    timeStamp: PropTypes.instanceOf(Date),

    displayAnnotationViewer: PropTypes.func,
    hideAnnotationViewer: PropTypes.func,
    startDragAnnotation: PropTypes.func,
    draggingAnnotation: PropTypes.func,
    endDragAnnotation: PropTypes.func,
  };

  static defaultProps = {
    drawing: false,
    shouldDisplayViewer: false,
  };

  renderOnCoords({x1, x2, y1, y2,
    type, 
    id, 
    deepImageIndex, 
    deepImageColor, 
    rectangle, 
    drawing,
    moving,
    pendingAnnotation, 
    containerOffset, 
    content,
    author,
    timeStamp,
    other}) {
   
    let width = Math.abs(x1 - x2);
    let height = Math.abs(y1 - y2);

    // Figure out what direction the mouse is dragging. 1 === left to right, up to down
    const xDir = x2 - x1 >= 0 ? 1 : -1;
    const yDir = y2 - y1 >= 0 ? 1 : -1;

    const divStyle = {
      left: xDir === 1 ? x1 : x2,
      top: yDir === 1 ? y1 : y2,
    };

    // Default offsets based on height/width of bubble
    const offset = {
      vertical: -BUBBLEDIM.height - 10,
      horizontal: width / 2 - BUBBLEDIM.width / 2,
    };

    let IndicatorComponent;

    switch (type) {
      case MARKER:
        IndicatorComponent = Marker;
        offset.vertical -= 25;
        height = 0;
        offset.horizontal = -BUBBLEDIM.width / 2;
        break;

      case HOTSPOT:
        IndicatorComponent = Hotspot;
        break;

      case DEEPER_IMAGE:
        IndicatorComponent = DeeperImage;
        break;

      case SQUARE:
        IndicatorComponent = Square;
        break;

      case CIRCLE:
        // For circles, we need to use the biggest mouse value as diameter
        width = height = Math.max(width, height);
        IndicatorComponent = Circle;
        break;

      case HIGHLIGHT:
        divStyle.top = y1;  // Force back to y1, highlights must stay on same vertical height
        height = 21; // Force height of highlight to allow correct bubble placement
        IndicatorComponent = Highlight;
        break;
    }
 
    // If we are going to push above the viewport, invert the bubble and modify the offset to draw below
    let invert = y1 + offset.vertical - 10 + containerOffset.top - 200 <= 0;
    if (invert) {
      offset.vertical = height + 36;
    }

    // Check to see if we are going to draw past the left or right side of the viewport.
    let viewPortWidth = document.documentElement.clientWidth - containerOffset.left;

    let pushHorizontal = x1 + (width / 2 - BUBBLEDIM.width / 2) + containerOffset.left <= 0;
    let pullHorizontal = x1 + (width / 2 + BUBBLEDIM.width / 2) >= viewPortWidth;

    // If we need to push or pull the bubble, recalculate the offsets based on bubble size and
    // marker position. This was fun to figure out. The 5 is just there for additional padding.
    let additionalOffset;
    if (pushHorizontal) {
      additionalOffset = offset.horizontal + x1 - 5;
      offset.horizontal = offset.horizontal - additionalOffset;
      offset.shadow = type !== MARKER ? offset.shadow = x1 + width / 2 - 14 : offset.shadow = x1 - 14;
    }
    else if (pullHorizontal) {
      additionalOffset = viewPortWidth - (BUBBLEDIM.width + 5) - offset.horizontal - x1;
      offset.horizontal = offset.horizontal + additionalOffset;
      offset.shadow = type !== MARKER ? -offset.horizontal + width / 2 - 10 : -offset.horizontal - 10;
    }

    return <div style={divStyle} className={`cd-annotation ${type}`}
                onMouseDown={(e)=>
                {
                  e.stopPropagation();
                  if(this.props.moveAnnotationStart){
                    const {clientX, clientY} = e;
                    const {scalePoint, offsetPoint, size} = this.props;
                    this.props.moveAnnotationStart({id, clientX, clientY, scalePoint, offsetPoint, size})
                  }
                }} 
                onMouseOver={(e)=>
                {
                  e.stopPropagation();
                  if(this.props.displayAnnotationViewer){
                    this.props.displayAnnotationViewer(id);  
                  }
                
                }}
                onMouseOut={(e)=>
                {
                  e.stopPropagation();
                  if(this.props.hideAnnotationViewer){
                    this.props.hideAnnotationViewer(id);
                  }
                }} 
                onClick={(e)=>
                {
                  if (this.props.onDeepImageClick && type === DEEPER_IMAGE) {
                    this.props.onDeepImageClick(deepImageIndex)
                  }

                  // Allow markers to be placed inside shapes, but not on other markers
                  if (type === MARKER) e.stopPropagation();
                }}>

      {(!moving && !drawing && pendingAnnotation) ? 
        <Input 
               id={id}
               invert={invert}
               pushHorizontal={pushHorizontal} 
               pullHorizontal={pullHorizontal}
               offset={offset} 
               {...other} />
      : null}

      {IndicatorComponent ?
        <IndicatorComponent {...this.props} 
                            deepImageIndex={deepImageIndex} 
                            deepImageColor={deepImageColor} 
                            width={width} 
                            height={height}/>
      : null}

      {(!moving &&!drawing && !pendingAnnotation) ? 
        <Content 
                 id={id}
                 content={content}
                 author={author}
                 timeStamp={timeStamp}
                 invert={invert} 
                 pushHorizontal={pushHorizontal}
                 pullHorizontal={pullHorizontal}
                 offset={offset} 
                 {...other} />
      : null}
    </div>
  }

  render() {
    const deepImageIndex = this.props.annotation.get('deepImageIndex');
    const deepImageColor = this.props.annotation.get('deepImageColor');
    const id = this.props.annotation.get('id');
    const content = this.props.annotation.get('content');
    const author = this.props.annotation.get('author');
    const timeStamp = this.props.annotation.get('timeStamp');

    const rectangle = this.props.annotation.get('rectangle');
    const drawing = this.props.annotation.get('drawing');
    const moving = this.props.annotation.get('moving');
    const type = this.props.annotation.get('type');
    let {containerOffset, pendingAnnotation} = this.props
    containerOffset = containerOffset?containerOffset:{top:0,left:0};
    
    // Desctructing is on one line b/c vim indenting gets confused
    const {...other} = this.props;

    const {x1, x2, y1, y2} = rectangle.getPoints();
    
    return this.renderOnCoords({
      x1,
      x2,
      y1,
      y2,
      type,
      id,
      deepImageIndex,
      deepImageColor,
      rectangle,
      containerOffset,
      pendingAnnotation,
      drawing,
      moving,
      content,
      author,
      timeStamp,
      other,
    })
  }
};


