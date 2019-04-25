import {serverUrl} from '../config-old';
import ajaxPromise from '../ajaxPromise';
import { createAction } from 'redux-actions';

export const getBraintreeToken = (data = {}) =>
  ajaxPromise({
    url  : `${serverUrl}/api/braintree/client-token`,
    type : 'POST',
    data,
  })

export const postBraintreeBuyRequest = (data = {}) =>
  ajaxPromise({
    url  : `${serverUrl}/api/braintree/buy`,
    type : 'POST',
    data,
  })

export const getCoupon = ({ author_id, work_id, couponCode, tuition_offer_id }) => {
  if (!tuition_offer_id) {
    return ajaxPromise({
      url  : `${serverUrl}/api/coupon/${author_id}/${work_id}/${couponCode}`,
      type : 'GET',
    });
  }

  return ajaxPromise({
    url  : `${serverUrl}/api/coupon/${author_id}/${work_id}/${tuition_offer_id}/${couponCode}`,
    type : 'GET',
  });
};

export const setPaymentWorkData = (data) => {
  return (dispatch, getState) => {
    dispatch(createAction('SET_PAYMENT_WORK_DATA')(data));
  }
}

export const resetAllPaymentData = (data) => {
  return (dispatch, getState) => {
    dispatch(createAction('RESET_ALL_PAYMENT_DATA')());
  }
}

export const setCouponData = (data) => {
  return (dispatch, getState) => {
    dispatch(createAction('SET_COUPON_DATA')(data));
  }
}

export const resetCouponData = () => {
  return (dispatch, getState) => {
    dispatch(createAction('RESET_COUPON_DATA')());
  }
}

export const setTransactionId = transaction_id => {
  return (dispatch, getState) => {
    dispatch(createAction('SET_TRANSACTION_ID')({transaction_id}));
  }
}

export const setUserTransactionId = user_transaction_id => {
  return (dispatch, getState) => {
    dispatch(createAction('SET_USER_TRANSACTION_ID')({user_transaction_id}));
  }
}
