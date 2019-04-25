import {rectangleByPointsFct} from '../../../../src/records/rectangle'
import {annotationFct} from '../../../../src/records/annotation'

export default  {
    annotation: annotationFct({
        rectangle : rectangleByPointsFct({left:400, top:400, right:500, bottom:600}),
        author: "Test User",
        timeStamp: "2015-05-22T14:46:46.501Z",
        content: "I\'m a rectangle!",
        type: "SQUARE",
        id: 6,
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
