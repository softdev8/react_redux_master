'use strict';

import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom';
import Immutable from 'immutable'
import R from 'ramda'

import annotationOptions from '../../constants/annotation-options';
const {MARKER, HOTSPOT, DEEPER_IMAGE, SQUARE, CIRCLE, HIGHLIGHT} = annotationOptions;

import compareAnnotations from '../compareAnnotations'
import Annotation from '../Annotation'
import {getRandomColor} from '../router/utils'
import {annotationFct} from '../../records/annotation';
import {pointFct, pointFromScalarFct} from '../../records/point';
import {rectangleFct, rectangleFromOnePointFct, rectangleByPointsFct} from '../../records/rectangle';
import {kitty_ducks_image} from '../../../fixtures/fixtures-share'

const offset = (element) => {
  const doc = element && element.ownerDocument;

  if (!doc) {
    return;
  }

  const documentElem = doc.documentElement;
  const {top,left} = element.getBoundingClientRect();
  return {top,left};
}

export default class Container extends Component {
  constructor() {
    super();
    this.updateOffset = this.updateOffset.bind(this);
  }

  static propTypes = {
    updateOffset:PropTypes.func.isRequired,
    annotations: PropTypes.object.isRequired,
    scalePoint: PropTypes.object.isRequired,
    offsetPoint: PropTypes.object.isRequired,
    hidden: PropTypes.bool.isRequired,
    selectedId: PropTypes.number.isRequired,
    annotationsStartPriority: PropTypes.number.isRequired,

    // Optional
    mode: PropTypes.string,
  };

  static defaultProps = {
    selectedId: 0,
    scale: pointFromScalarFct(1),
    hidden: false,
  };

  // Listen for props in order to overwrite visible viewer with prop
  componentWillReceiveProps(nextProps) {

    if (this.props.mode != nextProps.mode) {
      const {size} = this.props; 
      this.props.annotationCancel({size});
    }
  }

  componentDidMount() {
    const component = findDOMNode(this);
    component.addEventListener("scroll", this.updateOffset);
    this.updateOffset();
  }

  componentWillUnmount() {
    const component = findDOMNode(this);
    component.addEventListener("scroll", this.updateOffset);
  }

  updateOffset() {
    if(this.props.updateOffset){
      this.props.updateOffset(offset(findDOMNode(this)))
    }
  }

  render() {
    let pA = this.props.pendingAnnotation && this.props.pendingAnnotation.toJS();

    let pAnnotationComponent = '';
    if (this.props.pendingAnnotation && !this.props.hidden) {
      pAnnotationComponent = <Annotation 
        annotation={this.props.pendingAnnotation}
        {...this.props}
        priority={this.props.annotationsStartPriority + this.props.annotations.size + 1}
        pending={true}
        drawing={pA.drawing}
        deemphasize={false}
        />;
    }

    const sortedAnnotations = this.props.annotations.sort(compareAnnotations);

    let annotations = '';
    if (!this.props.hidden) {
      annotations = sortedAnnotations.map((a, i) => {
        return (
          <Annotation 
            annotation={a}
            {...this.props}
            priority={this.props.annotationsStartPriority + i + 1}
            pending={false}
            ref={`annotation-${i}`}
            forbidClicks={this.props.isEditable || this.props.forbidClicks}
            shouldDisplayViewer={a.get('id') === this.props.visibleViewerId}
            deemphasize={this.props.deemphasize != undefined ?
                                this.props.deemphasize :
                                this.props.visibleViewerId !== 0 && a.get('id') !== this.props.visibleViewerId}
            />
        );
      });
    }

    const returnDataMethod = R.curry((cb, e)=> {
        e.stopPropagation();

        const {scalePoint, offsetPoint, isEditable, size, deepImageIndex, deepEditableImage} = this.props;
        const {clientX, clientY} = e;

        if(cb){
          cb({scalePoint, offsetPoint, clientX, clientY, isEditable, size, deepImageIndex, deepEditableImage})  
        }
    })

    return (
      <div ref='cdContainer' style={this.props.containerStyle}
           onMouseDown={returnDataMethod(this.props.onContainerMouseDown)}
           onMouseMove={returnDataMethod(this.props.onContainerMouseMove)}
           onMouseUp={returnDataMethod(this.props.onContainerMouseUp)}
        >
        {annotations}
        {pAnnotationComponent}
      </div>
    );
  }
}
