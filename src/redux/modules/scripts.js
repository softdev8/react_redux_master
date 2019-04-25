import createLoadableResource from '../loadable' 
import {CALL_API_FETCH} from '../../middleware/apiFetch' 

const resourceName = 'scripts';

const {isLoaded:_isLoaded, reducer, actions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

/**
 * Load available spaces for this user
 */
export function load() {
  return {
  	
  }
}