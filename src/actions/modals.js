import { createAction } from 'redux-actions';
import Immutable from 'immutable';


export const showModal = (typeToShow, params) => {
  return function(dispatch, getState) {

    dispatch(createAction('SHOW_MODAL_WINDOW')({typeToShow, params}));
  }
}

export const closeModal = () => {
  return function(dispatch, getState) {
    dispatch(createAction('CLOSE_MODAL_WINDOW')());
  }
}

export const updateModal = (params) => {
  return (dispatch, getState)=>{
    /*TBD: Convert modals params to Immutable
    const imUpdate = Immutable.fromJS(params)
    const state = getState().modals;
    const oldContent = state.get('params');
    console.log(oldContent);
    const newContent = oldContent.merge(imUpdate);
    if (Immutable.is(newContent, oldContent))
    {
      return;
    }*/

    dispatch(createAction('UPDATE_MODAL_PARAMS')({params}));
  }
}
