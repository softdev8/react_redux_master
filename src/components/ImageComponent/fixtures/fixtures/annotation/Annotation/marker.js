import {rectangleByPointsFct} from '../../../../src/records/rectangle'
import {annotationFct} from '../../../../src/records/annotation'

export default  {
    annotation: annotationFct({
        rectangle : rectangleByPointsFct({left:300, top:300, right:1500, bottom:300}),
        author: "Test User",
        timeStamp: "2015-05-22T14:46:24.550Z",
        content: "Like this one!",
        type: "MARKER",
        id: 5,
    }),
    pending: false,
    drawing: false,
    containerOffset: {
        top: 0,
        left: 0
    },
    editAnnotation() {
    },
    hideAnnotationViewer() {
    },
    displayAnnotationViewer() {
    },
    devareAnnotation() {
    },
    shouldDisplayViewer() {
    }
};