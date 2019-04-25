const checkAction = (next, action)=>{
  if (!action) {
    next(action);
    return false;
  }

  const { postProcess, result } = action;

  if (!postProcess || !result) {
    next(action);
    return false;
  }

  return true;
}

export default store => next => action => {
  if(!checkAction(next, action)){
    return;
  }

  const { postProcess, result, ...rest } = action;

  next({
    ...rest,
    result: postProcess ? postProcess(result) : result,
  })
};