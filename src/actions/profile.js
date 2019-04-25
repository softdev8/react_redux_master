import {serverUrl} from '../config-old';
import ajaxPromise from '../ajaxPromise';
import { createAction } from 'redux-actions'; 
import { checkError } from '../utils/errorResponseUtils';

export const saveProfile = (params, cb) => {
  return function(dispatch, getState) {    
    saveProfileDirectCall(params).then( () => {
      cb();
    }).catch( error => {
      checkError(error, dispatch);
      dispatch(updateModal({status:'ERROR', text:'Unable to save Profile'}));
    });
  }
}

export const saveProfileDirectCall = (payload = {}) => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/profile`,
    type : 'PUT',
    data : payload,
  });
}

export const getProfileImagesUrl = () => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/profile/image/upload/url`,
    type : 'GET',
  });
}