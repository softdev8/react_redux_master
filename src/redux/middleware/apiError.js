import { pushState } from 'redux-router';
import { checkError } from '../../utils/errorResponseUtils'

const checkAction = (next, action)=>{
  if (!action) {
    next(action);
    return false;
  }

  const { error } = action;
  if (!error) {
    next(action);
    return false;
  }
  return true;
}

export default store => next => action => {

  if(!checkAction(next, action)){
    return;
  }

  const router = store.getState().router;

  const {error, errorWhitelist, errorHook, ...rest } = action;
  checkError(action.error, store.dispatch, router.location, errorWhitelist);

  if(errorHook) {
    const dispatch = store.dispatch;
    const res = errorHook({...rest, router, error, dispatch})
    if(res){
      next(res);
    }
    return;
  }

  next(action);
};