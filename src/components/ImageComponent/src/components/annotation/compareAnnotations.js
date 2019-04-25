import R from 'ramda'

import annotationOptions from '../../constants/annotation-options';
const {MARKER, DEEPER_IMAGE, HIGHLIGHT} = annotationOptions;

// Sorting the annotations: largest area to smallest area, then highlights, then markers
// This allows us to assign a priority with biggest shapes being lowest in order to
// calculate a z-index that stacks them accordingly
export default (a1, a2) => {
  const typePriorityCompare = R.curry((type, a1, a2)=> {
    if (a1.get('type') === a2.get('type')) return 0;
    if (a1.get('type') === type) return 1;
    return -1;
  });

  if (a1.get('drawing') || a2.get('drawing')) {
    if (a1.get('drawing') === a2.get('drawing')) return 0;
    if (a1.get('drawing')) return 1;
    return -1;
  }

  if (a1.get('type') === DEEPER_IMAGE || a2.get('type') === DEEPER_IMAGE) {
    return typePriorityCompare(DEEPER_IMAGE)(a1, a2);
  }
  if (a1.get('type') === MARKER || a2.get('type') === MARKER) {
    return typePriorityCompare(MARKER)(a1, a2);
  }
  if (a1.get('type') === HIGHLIGHT || a2.get('type') === HIGHLIGHT) {
    return typePriorityCompare(HIGHLIGHT)(a1, a2);
  }

  return a2.get('rectangle').getSquare() - a1.get('rectangle').getSquare();
};