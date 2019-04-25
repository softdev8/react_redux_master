import createLoadableResource from './loadable' 
import {CALL_API_FETCH} from '../middleware/apiFetch' 
import { pushState } from 'redux-router';
import {parsePakoFunc} from '../../pakoUtils';

const resourceName = 'page';

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
        endpoint: resourceName + "/{0}/{1}".format(userId, pageId),

        errorHook: (res) => {
			if(res.error.status == "403"){
				res.dispatch(pushState(null, '/page/preview/{0}/{1}'.format(res.router.params.user_id, res.router.params.page_id)));
			}
			return;
		},

        postProcess: parsePakoFunc,
    },
})