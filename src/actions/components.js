import { createAction } from 'redux-actions';
import * as selectedWidget from '../redux/modules/selectedWidget';
import { generateUniqueId } from '../redux/modules/subjects';
import Immutable from 'immutable';
import update from 'react-addons-update';

export const editToggleComponent = ({hash})=>{
  return (dispatch, getState) => {
    const {subjects} = getState();

    const mode = subjects.get(hash).getMode() === 'edit' ? 'view' : 'edit';

    dispatch(createAction('SET_EDIT_SUBJECT')({hash, mode}));
  }
}

export const removeComponent = (obj)=>createAction('REMOVE_SUBJECT')(obj);

export const addComponent = (obj)=>{
  return (dispatch, getState)=>{
    const hash = generateUniqueId();
    dispatch(createAction('ADD_SUBJECT')({...obj, hash}))
    obj.data.mode === "edit" && dispatch(selectedWidget.selectActive(hash));
  }
};
export const moveComponent = (obj)=>createAction('MOVE_SUBJECT')(obj);

export const updateContentStateMulti = ({ payload }, cb) => {
  return (dispatch, getState) => {
    const updates = [];
    for (let i = 0; i < payload.length; i++) {
      const hash = payload[i].hash;
      const data = payload[i].data;
      const imUpdate = Immutable.fromJS(data);
      const state = getState().subjects;
      const oldContent = state.get(hash).get('data').get('content');
      const newContent = oldContent.merge(imUpdate);

      if (Immutable.is(newContent, oldContent)) {
        continue;
      }

      updates.push({
        hash,
        content: newContent
      });
    }

    if (updates.length > 0) {
      dispatch(createAction('SET_CONTENT_STATE_MULTI')({
        payload: updates
      }));
    }

    if (cb) {
      cb(null);
    }
  };
};

export const updateContentState = ({ hash, data }, cb) => {
  const imUpdate = Immutable.fromJS(data);
  return (dispatch, getState) => {
    const state = getState().subjects;
    const oldContent = state.get(hash).get('data').get('content');
    const newContent = oldContent.merge(imUpdate);

    if (Immutable.is(newContent, oldContent)) {
      return;
    }

    dispatch(createAction('SET_CONTENT_STATE')({ hash, content:newContent }));

    if (cb) {
      cb(null);
    }
  };
};

 // if (propertyName == 'pageAlign') {
 //      var pageProperties = update(this.state.pageProperties, {pageAlign: {$set: propertyValue}});
 //      this.setState({
 //        pageProperties: propertyValue
 //      });
 //    }


// TODO
// I was looking to build a feature where pressing Ctrl + Enter on any component will append a text component by default below current component.
// Then if author clicks the + on current component and selects a different widget we will replace the newly added empty text component with the selected new component.

  //  checkIfComponentIsEmptyText: function(index){
  //     //TODO - soban - Figure out a better way of doing this
  //     //If component at the given index is an empty text component then just replace it with the new component
  //     if(this.state.comps[index].type == 'TextEditor'){
  //       if(this.refs.page_editor.refs.componentsList){
  //         const compRef = this.refs.page_editor.refs.componentsList.getComponentByIndex(index);
  //         if(compRef && compRef.isEmpty){
  //           if (compRef.isEmpty()){
  //             return true;
  //           }
  //         }
  //       }
  //     }

  //     return false;
  // },
  // appendTextComponentAtEnd: function(){
  //   if(this.state.comps.length == 0) {
  //     this.addComponent(-1, getComponentMeta('TextEditor').defaultVal);
  //   } else if (!this.checkIfComponentIsEmptyText(this.state.comps.length-1)){
  //     this.addComponent(-1, getComponentMeta('TextEditor').defaultVal);
  //   }
  // },
