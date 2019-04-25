import { createAction } from 'redux-actions';
import {load as getUserInfo} from '../redux/modules/user/info';

export default function({getState, dispatch}, requireAuth) {
  const state = getState();
  const userInfo = state.user.info;
  
  if(!userInfo.loaded && !userInfo.loading) {
    let errorWhitelist = [];
    if(!requireAuth){
      errorWhitelist.push(401);
    }
    dispatch(getUserInfo(errorWhitelist));
  } 

  if(!requireAuth && !userInfo.loaded && userInfo.loading) {
    dispatch(createAction('user/info/CLEAR')());
  }
   
}