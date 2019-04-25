/* @flow weak */

/*eslint-env node, es6*/

import { createStore, applyMiddleware, compose } from 'redux';
import { api, apiFetch, apiError, apiResult, ajax } from './middleware';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import Routes from '../routes';
import createHistory from 'history/lib/createBrowserHistory';
import { POP } from 'history/lib/Actions'
import createUseScroll from 'scroll-behavior/lib/utils/createUseScroll'
import setScrollRestoration from 'scroll-behavior/lib/utils/setScrollRestoration'
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';
import { persistState } from 'redux-devtools';
import { DevTools } from '../containers';

const loggerMiddleware = createLogger({
  actionTransformer: (action) =>
  {
    if(action && action.error && action.error.stack){
      return action.error.stack;
    }
    return action;
  },
});

/**
 * This creates redux store for entire app, all app business logic including api calls will depend on returned store.
 * The store has the following middleware applied to it:
 * * clientMiddleware
 *
 * If in development mode (__DEVELOPMENT__ global) and in client (__CLIENT__) global, and
 * devtools enabled (__DEVTOOLS__), this function also enables redux-devtools for the store.
 * Also, if in dev tools are enabled
 * the persistState() store enhancer is used, which allows you to persist debug sessions across page reloads.
 * It lets you write ?debug_session=<name> in address bar to persist debug sessions
 *
 */
function useScrollToTop(createHistory) {
  let unsetScrollRestoration

  function updateScroll({ action }) {
    // scroll-container - collection viewer content layout
    const elem = document.getElementsByClassName('scroll-container')[0] || document.getElementById('app-container')
    // If we didn't manage to disable the default scroll restoration, and it's
    // a pop transition for which the browser might restore scroll position,
    // then let the browser update to its remembered scroll position first,
    // before we set the actual correct scroll position.
    if (action === POP && !unsetScrollRestoration) {
      setTimeout(() => elem.scrollTop = 0)
      return
    }

    elem.scrollTop = 0
  }

  function start() {
    // This helps avoid some jankiness in fighting against the browser's
    // default scroll behavior on `POP` transitions.
    unsetScrollRestoration = setScrollRestoration('manual')
  }

  function stop() {
    /* istanbul ignore if: not supported by any browsers on Travis */
    if (unsetScrollRestoration) {
      unsetScrollRestoration()
    }
  }

  return createUseScroll(updateScroll, start, stop)(createHistory)
}
const reduxRouterStoreEnhancer = reduxReactRouter({
  createHistory: useScrollToTop(createHistory),
})

export default function createApiClientStore(client, data) {
  // const middleware = clientMiddleware(client);
  let finalCreateStore;

  if (window.DEBUG) {
    const finalApplyMiddleware = applyMiddleware(
                                             apiFetch,
                                             ajax,
                                             api,
                                             apiResult,
                                             apiError,
                                             thunkMiddleware,
                                             promiseMiddleware,
                                             loggerMiddleware);


    finalCreateStore = compose(
      // loggerMiddleware https://github.com/fcomb/redux-logger
      finalApplyMiddleware,
      reduxRouterStoreEnhancer,
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    const finalApplyMiddleware = applyMiddleware(
                                             apiFetch,
                                             ajax,
                                             api,
                                             apiResult,
                                             apiError,
                                             thunkMiddleware,
                                             promiseMiddleware);

    finalCreateStore = compose(
      finalApplyMiddleware,
      reduxRouterStoreEnhancer
    )(createStore);
  }

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);

  if (window.DEBUG && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
