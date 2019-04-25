import createLoadableResource from './loadable' 
import {CALL_API_FETCH} from '../middleware/apiFetch' 

const resourceName = 'pagePreview';

const {isLoaded:_isLoaded, reducer, actions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

/**
 * Load available spaces for this user
 */
export const load = (
    userId,
    pageId,
) => ({
    [CALL_API_FETCH]: {
        types: actions,
        endpoint: "page/{0}/{1}/props".format(userId, pageId),

        errorHook : (error) => {
			console.log(error);
		},

        postProcess: JSON.parse,
    },
})