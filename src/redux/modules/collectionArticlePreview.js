import createLoadableResource from './loadable';
import {CALL_API_FETCH} from '../middleware/apiFetch';
import { pushState } from 'redux-router';

const resourceName = 'collectionArticlePreview';

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
    endpoint: "collection/{0}/{1}/page/{2}/props".format(userId, collectionId, pageId),

    errorHook : (res) => {
      if(res.error.status == "403"){
        res.dispatch(pushState(null, '/collection/{0}/{1}'.format(res.router.params.user_id, res.router.params.collection_id)));
      }
      return;
    },

    postProcess: JSON.parse,
  },
})