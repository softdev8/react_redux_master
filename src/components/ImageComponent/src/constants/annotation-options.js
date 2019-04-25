/* @flow weak */

import {invertObject} from '../router/utils'

const constants = {
  MARKER: 'MARKER',
  SQUARE: 'SQUARE',
  HIGHLIGHT: 'HIGHLIGHT',
  DEEPER_IMAGE: 'DEEPER_IMAGE',
  HOTSPOT: 'HOTSPOT',
  CIRCLE: 'CIRCLE',
};

export default constants;

export const annotationPathsMap = {
  MARKER: 'marker',
  SQUARE: 'square',
  HIGHLIGHT: 'highlight',
  DEEPER_IMAGE: 'deeper-image',
  HOTSPOT: 'hotspot',
  CIRCLE: 'circle',
};

export const annotationInvertPathsMap = invertObject(annotationPathsMap)
