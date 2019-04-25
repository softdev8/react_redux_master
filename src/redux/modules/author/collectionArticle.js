import createLoadableResource from '../loadable';
import {CALL_API_FETCH} from '../../middleware/apiFetch';
import {parsePakoFunc} from '../../../pakoUtils';

const resourceName = 'author/collection';

const {isLoaded:_isLoaded, reducer, actions, createActions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

export const load = (
    collectionId,
    pageId,
) => ({
    [CALL_API_FETCH]: {
        types: actions,
        endpoint: `${resourceName}/${collectionId}/page/${pageId}`,

        errorHook : (error) => {
			return;
		},

        postProcess: parsePakoFunc,
    },
})
