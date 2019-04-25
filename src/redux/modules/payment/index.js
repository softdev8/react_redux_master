import { handleActions } from 'redux-actions';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  workData       : null,
  coupon         : null,
  total_price    : null,
  transaction_id : null,
  user_transaction_id: null,
});

export default handleActions({
  SET_PAYMENT_WORK_DATA : (state, { payload }) => {

    const newState = state.set('workData', payload)
      .set('total_price', payload.price)
      .set('transaction_id', null) // reset transaction on open new checkout window
      .set('user_transaction_id', null);
    return newState;
  },

  RESET_ALL_PAYMENT_DATA : () => {

    return initialState;
  },

  SET_COUPON_DATA : (state, { payload }) => {

    const newState = state.set('coupon', payload)
      .set('total_price', payload.price_with_coupon);

    return newState;
  },

  RESET_COUPON_DATA : (state) => {

    const newState = state.set('coupon', null)
      .set('total_price', state.get('workData').price);

    return newState;
  },

  SET_TRANSACTION_ID : (state, { payload }) => {

    const newState = state.set('transaction_id', payload.transaction_id);

    return newState;
  },

  SET_USER_TRANSACTION_ID : (state, { payload }) => {

    const newState = state.set('user_transaction_id', payload.user_transaction_id);

    return newState;
  },
}, initialState);
