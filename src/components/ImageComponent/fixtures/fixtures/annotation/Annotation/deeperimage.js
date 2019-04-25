import {rectangleByPointsFct} from '../../../../src/records/rectangle'
import {imageFct} from '../../../../src/records/image'
import {kitty_ducks_image} from '../../../fixtures-share'
import {annotationFct} from '../../../../src/records/annotation'

export default {
    annotation: annotationFct({
        rectangle: rectangleByPointsFct({left: 20, top: 50, right: 1500, bottom: 300}),
        isFullsize: true,
        animate: true,
        image: { src: kitty_ducks_image },
        author: "Test User",
        timeStamp: "2015-05-22T14:47:01.125Z",
        type: "DEEPER_IMAGE",
        id: 2
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