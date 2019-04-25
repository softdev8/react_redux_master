import { handleActions } from 'redux-actions';

const ReactGA = require('react-ga');
const debug = window.DEBUG || false;
const trackingId = debug ? 'UA-68399453-3' : 'UA-68399453-1';

ReactGA.initialize(trackingId, {
  debug
});

const initialState = {};

export const addAnalytics = (payload) => {
  ReactGA.pageview(payload.payload.location.pathname);
};

export default handleActions({
  '@@reduxReactRouter/routerDidChange': (state, payload) => {
    addAnalytics(payload);
    return state;
  },
  'user/info/LOAD_SUCCESS': (state, payload) => {
    ReactGA.set({ userId: payload.result.user_id });
    return state;
  }
}, initialState);
