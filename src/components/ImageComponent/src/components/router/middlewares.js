/**
 * Logs all actions and states after they are dispatched.
 */
import R from 'ramda'

export const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action, null, 2);
  let result = next(action);

  const unwrapImmutableJS = R.compose(R.fromPairs, R.map(([key, val])=>[key, val && val.toJS ? val.toJS() : val]), R.toPairs);
  console.log('next state', unwrapImmutableJS(store.getState()), null, 2);
  console.groupEnd(action.type);
  return result;
};
