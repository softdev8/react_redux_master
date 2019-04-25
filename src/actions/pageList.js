import {authorCreatePage} from './index'

import { pushState } from 'redux-router';

export const handleCreate = ()=>{
  return (dispatch)=>{
    authorCreatePage()
    .then((data)=>{
      const obj = JSON.parse(data);

      dispatch(pushState(null, '/pageeditor/{0}'.format(obj.page_id)));
    })
  }    
}