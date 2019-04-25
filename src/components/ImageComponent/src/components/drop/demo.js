//import Dropzone from '../dropzone';
//import DropzonePreview from '../preview';
//import {Component} from 'react';
//let createRedux = require('redux').createRedux;
//let Provider = require('redux/react').Provider;
//let Connector = require('redux/react').Connector;
//let bindActionCreators = require('redux').bindActionCreators;
//let Immutable = require('immutable');
//import R from 'ramda';
//import stores from '../../stores/index';
//
//class DropzoneDemo extends Component {
//    render() {
//        return (
//            <Connector select={(stores) =>{return {images: stores.ImagesStore.images}}}>
//                {({importedImages, dispatch })=> {
//                    const imagesActions = bindActionCreators(ImagesActions, dispatch);
//
//                    return <div>
//                        <Dropzone onDrop={imagesActions.imagesImported} size={150}>
//                            <div style={{padding: 30}}>Try dropping some files here.</div>
//                        </Dropzone>
//                        <DropzonePreview images={importedImages}/>
//                    </div>
//                }}
//            </Connector>
//        );
//    }
//}
//
//const defaultValueStoreDecorator = (store, initialState)=> {
//    return (state, action)=> {
//        if (!state) {
//            return initialState;
//        }
//
//        return store(state, action)
//    }
//};
//
//const redux = createRedux({
//    ImagesStore: defaultValueStoreDecorator(stores.ImagesStore, {
//        lastId: 0,
//        images: Immutable.List([])
//    })
//});
//
//export default class App extends Component{
//    render() {
//        return (
//            <Provider redux={redux}>
//                <DropzoneDemo />
//            </Provider>
//        );
//    }
//}