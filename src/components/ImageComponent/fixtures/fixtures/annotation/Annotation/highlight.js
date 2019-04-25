import {rectangleByPointsFct} from '../../../../src/records/rectangle'
import {annotationFct} from '../../../../src/records/annotation'

export default  {
     annotation: annotationFct({
        rectangle: rectangleByPointsFct({left:200, top:200, right:300, bottom:300}),
        author: "Test User",
        timeStamp: "2015-05-22T14:47:08.700Z",
        content: "Greeen!",
        type: "HIGHLIGHT",
        id: 3
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

