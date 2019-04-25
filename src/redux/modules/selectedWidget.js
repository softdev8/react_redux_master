import { createAction } from 'redux-actions';
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

export const selectActive = (hash)=>{
  return (dispatch, getState)=>{
    const {selectedWidget} = getState()
    const selectedHash = selectedWidget.get('selectedHash')
    if(hash === selectedHash){
      return;
    }

    dispatch(createAction('SWITCH_MODE_PREV_NEXT')({prevHash:selectedHash, nextHash: hash}))
  }
}

export const unSelectAll = ()=>{
  return createAction('SET_SELECT_ACTIVE')(-1)
}

const initialState = Immutable.fromJS({selectedHash:'1'});

export default handleActions({
  SWITCH_MODE_PREV_NEXT: (state, {payload:{nextHash}}) => state.update('selectedHash', ()=>nextHash),
  'author/page/LOAD_SUCCESS': (state) => initialState,
  'author/collection/LOAD_SUCCESS': (state) => initialState,
  LEAVE_PAGE_ROUTE: (state) => initialState,
}, initialState);