/* @flow weak */
/*eslint-disable */

import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import thunk from 'redux-thunk';
import { Provider} from 'react-redux';
import * as reducers from '../reducers';
import ImageComponentApp from '../image-app';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

const reducer = combineReducers(reducers);
const store = finalCreateStore(reducer);

export default class App extends Component {
  render() {
    return (<div>
      <Provider store={store}>
        {() => <ImageComponentApp />}
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store}
                  monitor={LogMonitor}/>
      </DebugPanel>
    </div>
    );
  }
}