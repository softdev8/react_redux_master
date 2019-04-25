import 'react-toggle/style.css'

import assign from 'object-assign';
import pure from 'react-pure-component';
import thunk from 'redux-thunk';
import R from 'ramda';
import { routerStateReducer, reduxRouteComponent, transitionTo } from '../../external/redux-react-router';
import { LOCATION_DID_CHANGE } from '../../external/redux-react-router/actionTypes';
import MemoryHistory from 'react-router/lib/MemoryHistory.js';
import { createStore, compose, applyMiddleware, combineReducers} from 'redux';
import { Connector , Provider} from 'react-redux';
import React, { Component } from 'react';
import { Router, Route, Link, Redirect } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';
import View  from 'react-flexbox';

// import { CompositeMonitor, debugPanelDecorator } from 'redux-devtools-monitor-dock';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, LogMonitor } from 'redux-devtools/lib/react';
import { DebugPanel , DirectionPanel } from '../../external/redux-devtools/DebugPanel';

import * as reducers from '../../reducers';

// import DiffMonitor from 'redux-devtools-diff-monitor';
// import SliderMonitor from 'redux-slider-monitor';
// import {TestMonitor} from 'redux-devtools-gentest-plugin';
import {CreateNamedComponent, clone, radPure} from '../utils';
import {logger} from '../middlewares';

import annotationOptions, {annotationPathsMap} from '../../constants/annotation-options';

console.warn = ()=> {
};

const {MARKER, HOTSPOT, DEEPER_IMAGE, SQUARE, CIRCLE, HIGHLIGHT} = annotationOptions;
import {
  ConnectedAnnotateOptionsRadio,
  ConnectedCarusel,
  ConnectedCropActivePane,
  ConnectedDropzone,
  ConnectedEditModeRadio,
  ConnectedPreview,
  ConnectedToggleWithOnChangeFixed,
  ConnectedAnnotateActivePane,
  ConnectedModeToggle,
  ConnectedCropOptions,
  ConnectedDeleteButton,
  ConnectedDeepImageOptions
  } from '../connections';

import {
  BottomStyle,
  TopStyle,
  PaneStyle,
  OptionsStyle,
  dropZoneStyle,
  CaruselStyle,
  ToggleModeStyle,
  ModeToggleOptionsStyle,
  AnnotateOptionsStyle,
  EditOptionsStyle,
  SelectImageStyle
  } from '../styles';

const finalReducers = assign(
  {},
  {
    router: (state = {}, action) => routerStateReducer(state, action),
  },
  reducers,
);

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  //devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)), 
)(createStore);

const finalReducer = combineReducers(finalReducers);
const store = finalCreateStore(finalReducer);

store.dispatch({
  type: 'IMAGE_ADDITION',
  payload: {dataUrl: require('../../../fixtures/../fixtures/fixtures-share').go, size: {width: 114, height: 115}},
});

store.dispatch({
  type: 'IMAGE_ADDITION',

  payload: {
    dataUrl: require('../../../fixtures/../fixtures/fixtures-share').kitty_ducks_image,
    size: {width: 114, height: 115},
  },
});

// store.dispatch({
//   type: 'IMAGE_ADDITION',
//   payload: {dataUrl: require('../../../fixtures/../fixtures/fixtures-share').go, size: {width: 114, height: 115}}
// });

// store.dispatch({
//   type: 'IMAGE_ADDITION',
//   payload: {
//     dataUrl: require('../../../fixtures/../fixtures/fixtures-share').kitty_ducks_image,
//     size: {width: 114, height: 115}
//   }
// });

// store.dispatch({
//   type: 'IMAGE_ADDITION',
//   payload: {dataUrl: require('../../../fixtures/../fixtures/fixtures-share').go, size: {width: 114, height: 115}}
// });

// store.dispatch({
//   type: 'IMAGE_ADDITION',
//   payload: {
//     dataUrl: require('../../../fixtures/../fixtures/fixtures-share').kitty_ducks_image,
//     size: {width: 114, height: 115}
//   }
// });

// store.dispatch({
//   type: 'IMAGE_ADDITION',
//   payload: {dataUrl: require('../../../fixtures/../fixtures/fixtures-share').go, size: {width: 114, height: 115}}
// });

const ModeToggleOptions = radPure(({selectImage}) => (
  <View column style={ModeToggleOptionsStyle}>
    <ConnectedModeToggle/>
    {selectImage ?
      <View row style={SelectImageStyle}>
        {clone(selectImage)}
      </View>
      : null}
  </View>
));

const ToggleMode = radPure(() => {
  return <View row style={ToggleModeStyle}>
    <View column style={{alignItems: 'flex-end'}}>
      <View row style={{alignItems: 'center'}}>Edit Mode</View>
    </View>
    <View/>
    <View>
      <ConnectedToggleWithOnChangeFixed/>
    </View>
  </View>
});

const AnnotateOptions = radPure(({children}) => (
  <View column style={AnnotateOptionsStyle}>
    <View row>
      AnnotateOptions
    </View>
    <View row>
      <ConnectedAnnotateOptionsRadio/>
    </View>
    {clone(children)}
  </View>
));

const EditOptions = radPure(({subEditOptions}) => (
  <View column style={EditOptionsStyle}>
    <View auto row>
      EditOptions
    </View>
    <View auto row style={{alignItems: 'center'}}>
      <ConnectedDeleteButton/>
    </View>
    <View row>
      <ConnectedEditModeRadio/>
      {subEditOptions ? <View row>
        {clone(subEditOptions)}
      </View> : null}
    </View>
  </View>
));

const Bottom = radPure(({dropZone, carusel}) => {
    if (!dropZone && !carusel) {
      return null;
    }
    return <View row style={BottomStyle}>
      {dropZone ? <View column style={dropZoneStyle}>
        {clone(dropZone)}
      </View> : null}
      {carusel ? <View column style={CaruselStyle}>
        {clone(carusel)}
      </View> : null}
    </View>
  }
);

const Top = radPure(({router}) => (
  <ToggleMode isEditMode={true} transitionTo={router}/>
));

const Body = radPure(({options, pane, router}) => (
  <View row style={TopStyle}>
    {pane ? <View column style={PaneStyle}>
      {clone(pane)}
    </View> : null}
    {options ? <View column style={OptionsStyle}>
      {clone(options)}
    </View> : null}
  </View>
));

const AppContent = pure(({top, body, bottom}) => {
  return <View column className="AppContent" style={{width:'100%', height:'100%'}}>
    {top ? clone(top) : null}
    {clone(body)}
    {clone(bottom)}
  </View>
});

const styleDecorator = R.curry((style, Component)=>(
  pure((props)=>(
    <Component {...props} style={style}/>
  ))
));

const wrapperDecorator = R.curry((style, Component)=>(
  pure((props)=>(
    <div style={style}>
      <Component {...props} />
    </div>
  ))
));

const fixVerticalScroll = {height: '100%', overflow: 'scroll'};
const fixHorizontalScroll = {width: '100%', overflow: 'scroll'};
const blackColorAndWordBreak = {color: 'white', backgroundColor: 'black', wordWrap: 'break-word'};

class App extends Component {
  render() {
    const ConnectedContent = <Connector select={s =>s}>{(props)=> (
      <AppContent {...this.props} {...props}/>
    )}</Connector>;

    if (false) {
      return (<Connector select={s =>s}>{(props)=> (
        <DevTools store={store}
                  monitor={CompositeMonitor}
                  monitors={{
                    //'log': wrapperDecorator(blackColorAndWordBreak)(wrapperDecorator(fixVerticalScroll)(LogMonitor)),
                    diff: wrapperDecorator(fixVerticalScroll)(DiffMonitor),
                  }}

                  content={ConnectedContent}
          />)}
      </Connector>)
    } else {
      return <div style={{width:'100%', height:'100%'}}>{ConnectedContent}</div>
    }
  }
}

// this is for reloading
const HistoryWrapper = (history)=> {
  class HistoriedRouter extends Component {
    constructor(props) {
      super(props);
      this.history = history;
    }

    render() {
      return (
        <Router history={this.history}>
          {this.props.children}
        </Router>
      );
    } 
  }
  return HistoriedRouter
};

const DelegatePaneComponent = pure(({pane}) =>(pane ? clone(pane) : null));

// handle the 'scrolltop' event on an entire document
$(document).on('scrolltop', function() {
    console.log('')
});

export default radPure(({hasToggle, mode, content}) => {
  const {height} = content;
  const HistoriedRouter = HistoryWrapper(new MemoryHistory([mode === 'view' ? '/preview' : '/edit/annotate/marker']));

  return <div style={{height, overflow: 'hidden'}}>
    <HistoriedRouter history={history}>
      <Route ignoreScrollBehavior component={reduxRouteComponent(store)}>
        <Route ignoreScrollBehavior component={App}>
          <Route ignoreScrollBehavior components={{top: (hasToggle ? Top : null), body: Body, bottom: Bottom}}>
            <Route ignoreScrollBehavior path="preview"
                   components={{
                     pane: ConnectedPreview,
                   }}/>
            <Route ignoreScrollBehavior path="edit"
                   components={{
                     carusel: ConnectedCarusel,
                     dropZone: ConnectedDropzone,
                     options: EditOptions,
                     pane: DelegatePaneComponent,
                   }}>
              <Route ignoreScrollBehavior path="crop-rotate"
                     components={{subEditOptions: ConnectedCropOptions, pane: ConnectedCropActivePane}}/>
              <Route ignoreScrollBehavior path="annotate"
                     components={{subEditOptions: ModeToggleOptions, pane: ConnectedAnnotateActivePane}}>
                <Route ignoreScrollBehavior path={annotationPathsMap[DEEPER_IMAGE]}
                       components={{selectImage: ConnectedDeepImageOptions}}></Route>
                <Route ignoreScrollBehavior path={annotationPathsMap[MARKER]} component={CreateNamedComponent(MARKER)}></Route>
                <Route ignoreScrollBehavior path={annotationPathsMap[SQUARE]} component={CreateNamedComponent(SQUARE)}></Route>
                <Route ignoreScrollBehavior path={annotationPathsMap[HOTSPOT]} component={CreateNamedComponent(HOTSPOT)}></Route>
                <Route ignoreScrollBehavior path={annotationPathsMap[HIGHLIGHT]} component={CreateNamedComponent(HIGHLIGHT)}></Route>
              </Route>
            </Route> 
          </Route>
        </Route>
      </Route>
    </HistoriedRouter>
  </div>
});


