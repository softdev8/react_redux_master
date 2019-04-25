// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

const checkAction = (next, action)=>{
  if (!action) {
    next(action);
    return false;
  }

  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    next(action);
    return false;
  }

  const { types, promise } = callAPI;

  if (!promise) {
    next(action);
    return false;
  }

  // if (!Array.isArray(types) || types.length !== 3) {
  //   throw new Error('Expected an array of three action types.');
  //   return false;
  // }

  // if (!types.every(type => typeof type === 'string')) {
  //   throw new Error('Expected action types to be strings.');
  //   return false;
  // }
  return true;
}

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  if(!checkAction(next, action)){
    return;
  }

  const { types, promise, cb, ...rest } = action[CALL_API];

  const actionWith = (data) => {
    const finalAction = {...action, ...data};
    delete finalAction[CALL_API];
    return finalAction;
  }

  let requestType;
  let successType;
  let failureType;

  if(types){
    [requestType, successType, failureType] = types;
    next(actionWith({ type: requestType }));
  }

  return promise()
  .then((result) => {
    if(types){
      next({...rest, result, type: successType})
    }
    if(cb){
      cb(null, result);
    }
  })
  .catch((error)=> {
    if(types){
      next({...rest, error, type: failureType})
    }
    if(cb){
      cb(error);
    }
  });
};