import {serverUrl} from '../../config-old';
import {CALL_API} from '../middleware/api' 
import EducativeUtil from '../../components/common/ed_util';
import Immutable from 'immutable';

export const CALL_API_FETCH = Symbol('Call API');

const checkAction = (next, action)=>{
  if (!action) {
    next(action);
    return false;
  }

  const callAPIFetch = action[CALL_API_FETCH];
  if (typeof callAPIFetch === 'undefined') {
    next(action);
    return false;
  }

  const { endpoint } = callAPIFetch;

  if (!endpoint) {
    next(action);
    return false;
  }

  if (typeof endpoint !== 'string') {
    throw new Error(`endpoint should be type string, but get ${endpoint}`);
    return false;
  }

  return true;
}

export default store => next => action => {
  if(!checkAction(next, action)){
    return;
  }

  const { endpoint, ...rest } = action[CALL_API_FETCH];

  next({
    AJAX_CALL: {
      ...rest,
      url: `${serverUrl}/api/${endpoint}`,
      type: 'GET',
    },
  })
};