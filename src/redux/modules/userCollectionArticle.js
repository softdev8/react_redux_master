import createLoadableResource from './loadable'
import {CALL_API_FETCH} from '../middleware/apiFetch'
import { pushState } from 'redux-router';
import { parsePakoFunc } from '../../pakoUtils';

const resourceName = 'userCollectionArticle';

const {isLoaded:_isLoaded, reducer, actions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

/**
 * Load available spaces for this user
 */
export const load = (
    userId,
    collectionId,
    pageId,
) => ({
    [CALL_API_FETCH]: {
        types: actions,
        endpoint: "collection/{0}/{1}/page/{2}".format(userId, collectionId, pageId),

        errorHook : (res) => {
			if(res.error.status == "403"){
				res.dispatch(pushState(null, '/collection/page/{0}/{1}/{2}/preview'.format(res.router.params.user_id, res.router.params.collection_id, res.router.params.page_id)));
			}
			return;
		},

        postProcess: parsePakoFunc,
    },
})
