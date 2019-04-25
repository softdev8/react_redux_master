import { createAction } from 'redux-actions';

export const search = (params) => (dispatch) => {
  createAction(dispatch({
    type : 'DO_SEARCH',
    ...params,
  }));
};

export const finishSearch = () => (dispatch) => {
  createAction(dispatch({
    type : 'FINISH_SEARCH',
  }));
};
