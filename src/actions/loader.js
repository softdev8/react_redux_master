import { createAction } from 'redux-actions';

export const setLoaderState = (isLoading) => (dispatch) => {
  dispatch(createAction('SET_LOADER_STATE')(isLoading));
};
