import createLoadableResource from '../loadable' 
import {CALL_API_FETCH} from '../../middleware/apiFetch' 
import {CALL_API} from '../../middleware/api' 
import ajaxPromise from '../../../ajaxPromise';
import {parsePakoFunc} from '../../../pakoUtils';

const resourceName = 'author/page';

const {isLoaded:_isLoaded, reducer, actions, createActions} = createLoadableResource(resourceName);

export default reducer;
export const isLoaded = _isLoaded;

export const load = pageId => ({
    [CALL_API_FETCH]: {
        types: actions,
        endpoint: `${resourceName}/${pageId}`,

        errorHook : (error) => {
			return;
		},

        postProcess: parsePakoFunc,
    },
})

// TODO: We are not using this put call at this point. This is an approach we tried so that we can have all api calls
// go through a common api middleware to parse errors. We werent able to figure out how to chain such events as thats 
// a key requirement for preview and publish scenarios
// export const put = ({pageId, page_title, page_summary, page_content_encoding, page_content})=>
//  (dispatch) => {
// 	dispatch({
// 		[CALL_API]: {
// 			types: createActions('PUT'),
// 			promise: () => ajaxPromise({
// 				url: "/api/author/page/{0}".format(pageId),
// 				type: 'PUT',
// 				data: { page_title, page_summary, page_content_encoding, page_content }
// 		    }),
// 			errorHook : (error) => {
// 				console.error(error) 
// 				console.error('I am special hook for error PUT')
// 			}
// 		}
// 	})
// }

