import createLoadableResource from '../loadable';
import {CALL_API_FETCH} from '../../middleware/apiFetch';
import { createAction } from 'redux-actions';

const resourceName = 'author/profile';

const {isLoaded:_isLoaded, reducer, actions, createActions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

export const load = authorID => ({
    [CALL_API_FETCH]: {
        types: actions,
        endpoint: authorID? `${resourceName}/${authorID}` : resourceName,

        errorHook : (error) => {
			return;
		},

        postProcess: JSON.parse,
    },
})

export function clear() {
  return (dispatch, getState) => {
    dispatch(createAction(`${resourceName}/CLEAR`)());
  }
}