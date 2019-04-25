import { handleActions } from 'redux-actions';
// import Immutable from 'immutable';

const initialState = {
  searchString : '',
  isResetable  : true,
};

export default handleActions({
  DO_SEARCH : (state, { searchString, resetable }) => {
    return {
      ...state,
      isResetable: resetable,
      searchString,
    };
  },

  FINISH_SEARCH : (state, { resetable = true }) => {
    return {
      ...state,
      isResetable: resetable,
      searchString : '',
    };
  },

  // reset search on page transition
  '@@reduxReactRouter/routerDidChange': (state) => {
    if (!state.isResetable) {
      return state;
    }

    return initialState;
  },
}, initialState);
