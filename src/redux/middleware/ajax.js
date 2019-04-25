import ajaxPromise from '../../ajaxPromise';
import { CALL_API } from '../middleware/api';
import demoFakeAjaxFct from '../../demoFakeServer';

export const AJAX_CALL = 'AJAX_CALL';

const checkAction = (next, action) => {
  if (!action) {
    next(action);
    return false;
  }

  const ajaxCall = action[AJAX_CALL];
  if (typeof ajaxCall === 'undefined') {
    next(action);
    return false;
  }

  const { url, type } = ajaxCall;

  if (!url || !type) {
    next(action);
    return false;
  }

  return true;
};

export default store => next => action => {
  if (!checkAction(next, action)) {
    return;
  }

  const { url, type, data, processData, contentType, ...rest } = action[AJAX_CALL];
  const { ajaxMode: { enabled } } = store.getState();
  const ajaxFct = enabled ? ajaxPromise : demoFakeAjaxFct;

  next({
    [CALL_API]: {
      ...rest,

      promise : () => {
        return ajaxFct({ url, type, data, processData, contentType })
        .then((res) => {
          return res;
        });
      },
    },
  });
};
