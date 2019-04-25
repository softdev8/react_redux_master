import {serverUrl} from '../config-old';
import ajaxPromise from '../ajaxPromise';

export const changePassword = (password) => {
  return ajaxPromise({
    url  : `${serverUrl}/api/user/change-password`,
    type : 'POST',
    data : password,
  });
}
