import {handleActions} from 'redux-actions'

const initialState = {pageAlign: 'center'};

export default handleActions({
  PAGE_PROPERTY_CHANGE:(state, {payload})=>{
    return payload;
  },

  LEAVE_PAGE_ROUTE: (state) => initialState,
}, initialState);