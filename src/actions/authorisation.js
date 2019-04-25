import {serverUrl} from '../config-old';
import ajaxPromise from '../ajaxPromise';
import { createAction } from 'redux-actions'; 

export const signup = ({user_name, full_name, email, password})=>
  ajaxPromise({
    url: `${serverUrl}/api/user/signup`,
    type: 'POST',
    data: { user_name, full_name, email, password },
  })

export const forgotPassword = (email)=>
  ajaxPromise({
    url: `${serverUrl}/api/user/forgot-password`,
    type: 'POST',
    data: { email },
  })

export const resetPassword = ({ reset_token, new_password, new_password_confirm })=>
  ajaxPromise({
    url: `${serverUrl}/api/user/reset-password`,
    type: 'POST',
    data: { reset_token, new_password, new_password_confirm },
  })

export const login = ({email, password})=>
  ajaxPromise({
    url: `${serverUrl}/api/user/login`,
    type: 'POST',
    data: { email, password },
  })

export const logout = () => {
  return ajaxPromise({
    url: `${serverUrl}/api/user/logout`,
    type: 'GET',
  });
}

export const verify = (verify_token)=>
  ajaxPromise({
    url: `${serverUrl}/api/user/verify`,
    type: 'POST',
    data: { verify_token },
  })

export const resendVerificationLink = (email)=>
  ajaxPromise({
    url: `${serverUrl}/api/user/resend-verification`,
    type: 'POST',
    data: { email },
  })

export const setUser = user => {
  User = user;
}

export const getUser = () => {
  return User;
}

let User;