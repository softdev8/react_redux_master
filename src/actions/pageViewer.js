import { createAction } from 'redux-actions';
import { pushState } from 'redux-router';

export const onClickEdit = () => {
	return (dispatch, getState)=>{
		const {router:{params:{pageid}}, location:{pathname}} = getState();
		if(pathname === '/demo/draft') {
			dispatch(pushState({forceTransition:true}, '/demo'))
			return;
		}

		dispatch(pushState(null, '/pageeditor/{0}'.format(pageid)));
	}
}
