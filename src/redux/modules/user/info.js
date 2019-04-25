import createLoadableResource from '../loadable';
import {CALL_API_FETCH} from '../../middleware/apiFetch';
import { createAction } from 'redux-actions';

const resourceName = 'user/info';

const {isLoaded:_isLoaded, reducer, actions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

/**
 * Load available spaces for this user
 */
export function load(errorWhitelist) { 
  return {
    [CALL_API_FETCH]: {
      types: actions,
      endpoint: resourceName,
      errorWhitelist,
      postProcess: JSON.parse,
    },
  };
}

export function clear() {
  return (dispatch, getState) => {
    dispatch(createAction(`${resourceName}/CLEAR`)());
  }
}