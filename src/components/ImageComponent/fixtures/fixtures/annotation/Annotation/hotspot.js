import {rectangleByPointsFct} from '../../../../src/records/rectangle'
import {annotationFct} from '../../../../src/records/annotation'

export default {
    annotation: annotationFct({
        rectangle: rectangleByPointsFct({left: 300, top: 300, right: 300, bottom: 300}),
        author: "Test User",
        timeStamp: "2015-05-22T14:47:01.125Z",
        type: "HOTSPOT",
        id: 4,
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