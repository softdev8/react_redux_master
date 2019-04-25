import { handleActions } from 'redux-actions';

const initialState = { isLoading: false };

export default handleActions({
  SET_LOADER_STATE : (
    state,
    { payload },
  ) => ({
    ...state,
    isLoading: payload.isLoading,
  }),
}, initialState);
