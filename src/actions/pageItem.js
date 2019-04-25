import {authorPagePublish} from './index'
import { pushState } from 'redux-router';
import { createAction } from 'redux-actions'

export const handleEdit = (id) =>{
    //Integrate with server
    console.log('Edit method called');
    return pushState(null, "/pageeditor/{0}".format(id));
  }

export const handleDelete = () =>{
    //Integrate with server
    console.log('Delete method called');

    return createAction('DELETE_PAGE_NOT_IMPLEMENTED')()
  }

export const handlePublish = (id) =>{
	return (dispatch, getState)=>{
    const {user:{info:{data:{user_id}}}} = getState();
		authorPagePublish(id)
		.then((data)=>{
		  console.log("Successfully published.")
		  // Pass 0 as user ID.
		  dispatch(pushState(null, '/page/{0}/{1}'.format(user_id, id)));
		})	
	}
}

export const handleUnPublish = () =>{
    //Integrate with server

    console.log('Unpublish method called');
    return createAction('UNPUBLISH_PAGE_NOT_IMPLEMENTED')()
  }