import createLoadableResource from '../loadable' 
import {CALL_API_FETCH} from '../../middleware/apiFetch' 
import { createAction } from 'redux-actions';

const resourceName = 'author/work';

const {isLoaded:_isLoaded, reducer, actions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

export function load() {
  return {
    [CALL_API_FETCH]: {
      types: actions,
      endpoint: resourceName,
      postProcess: JSON.parse,
    },
  };
}

export function clear() {
  return (dispath, getState) => {
    dispath(createAction(`${resourceName}/CLEAR`)());
  }
}