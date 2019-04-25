import { createAction } from 'redux-actions';
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

// export const requestSaveAll = ()=>createAction('BUMP_ALL_COMPONENT_SAVE_VERSION')();
// export const requestSave = ()=>createAction('BUMP_COMPONENT_SAVE_VERSION')();

const safeBumpVersion = (oldVersion)=> !oldVersion ? 1 : oldVersion + 1

export default handleActions({
  SET_EDIT_SUBJECT : (state, {payload:{hash, mode}})=> {
    if(mode === 'view' && hash) {
      return state.update(hash, safeBumpVersion);
    }
    return state
  },

  SWITCH_MODE_PREV_NEXT : (state, {payload:{prevHash, nextHash}})=> {
    if(prevHash) {
      return state.update(prevHash, safeBumpVersion);
    }
    return state
  },

  BUMP_SUBJECT_VERSION: (state, { payload: { hash } }) => {
    if (hash) {
      return state.update(hash, safeBumpVersion);
    }
    return state;
  },
}, Immutable.fromJS({}));
