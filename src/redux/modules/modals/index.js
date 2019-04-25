import {handleActions} from 'redux-actions';
import ModalTypes from '../../../constants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({showModal: false, typeToShow: null, params: null});

export default handleActions({
  SHOW_MODAL_WINDOW : (state, { payload : {typeToShow, params = null} }) => {
    state = state.set('showModal', true)
                 .set('typeToShow', typeToShow);

    if(params) state = state.set('params', params);

    return state;
  },

  UPDATE_MODAL_PARAMS : (state, {payload:{params}}) => {
    if(params) state = state.set('params', params);
    return state;
  },

  CLOSE_MODAL_WINDOW : (state, payload) => {
    return initialState;
  },
}, initialState);