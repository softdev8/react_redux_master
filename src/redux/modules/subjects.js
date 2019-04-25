import Immutable from 'immutable';
import {handleActions} from 'redux-actions'
import {subjectFct} from '../../records/subject'
import {getComponentMeta} from "../../component_meta";
import R from 'ramda'

// let componentsCounter = new Date().getTime() + Math.floor((Math.random() * 100000) + 1);
let componentsCounter = 1;

export function generateUniqueId() {
  componentsCounter++;
  return componentsCounter.toString();
}

function resetComponentsCounter(counterValue) {
  componentsCounter = counterValue;
}

const authorPageLoadSuccessHandler = (state, { result: { components } }) => {
  resetComponentsCounter(0);

  if (!components) {
    return setupInitialStateForEditor();
  }

  let i = 0;
  return R.reduce(
    (oldState, item)=>{
      const hash = generateUniqueId();
      if(i > 0){
        i++;
        return addSubject(oldState, {payload:{parentHash:'0', data:item, hash, index:-1}})
          .update(hash, (subject)=>subject.setMode('view'));
      } else {
        i++;
        return addSubject(oldState, {payload:{parentHash:'0', data:item, hash, index:-1}})
        .update(hash, (subject)=>subject.setMode('edit'));
      }
    }
  )(initialState/* we discard old state*/, components)
}


const userPageLoadSuccessHandler = (state, {result:{components}})=>{
  resetComponentsCounter(0);

  if(!components){
    return initialState;
  }


  return R.reduce(
    (oldState, item)=>{
      const hash = oldState.size.toString();
      return addSubject(oldState, {payload:{parentHash:'0', data:item, hash, index:-1}})
        .update(hash, (subject)=>subject.setMode('view'));
    }
  )(initialState/* we discard old state*/, components)
}

const modifySubject = (state, {payload:{hash, newSubject}})=>(
  state.update(hash, ()=>newSubject)
)

const updataData = (state, {payload:{hash, data}})=>{
  return state.update(hash, (oldSubject)=> oldSubject.update('data', ()=>data)).update(hash, (oldSubject)=>oldSubject.updateIteration());
}

const addSubject = (state, {payload:{parentHash, data, hash, index}})=>{
  //TODO - soban - This is part of ensuring that a text component is always left at the end and replacing the empty text with a widget
/*
  if(index == this.state.comps.length-1 && this.checkIfComponentIsEmptyText(index)) {
    //If component is the last component in the list then make sure to keep the extra text editor comp at the end
    this.state.comps.splice(index, 0, defaultComp);
  } else if (this.checkIfComponentIsEmptyText(index)) {
    // If the component at the given index is a text component then just remove it and replace it with given component
    this.removeComponent(index);
    this.state.comps.splice(index, 0, defaultComp);
  } else {
    // Regular add happens at index + 1
    this.state.comps.splice(index + 1, 0, defaultComp);
  }*/

  const newSubject = subjectFct({parentHash, data, hash});
  const newSubjectAddedState = state.set(hash, newSubject);

  return state.get(parentHash) ? newSubjectAddedState.update(parentHash, (host)=>host.addToChildren(hash, index)) : newSubjectAddedState;
}

const initialState = Immutable.fromJS({0:subjectFct({parentHash:null, hash:'0', data:null})});

const setupInitialStateForEditor = function() {
  const hash = generateUniqueId();
  const data = getComponentMeta('MarkdownEditor').defaultVal;
  return addSubject(initialState, { payload: { parentHash:'0', data, hash, index:-1 } });
};

const setContentState = (state, { payload: { hash, content } }) => {
  return updataData(state, { payload: { hash, data: state.get(hash).get('data').update('content', () => content) } });
};

const setContentStateMulti = (state, { payload }) => {
  let newState = state;

  for (let i = 0; i < payload.length; i++) {
    newState = setContentState(newState, {
      payload: payload[i]
    });
  }

  return newState;
};


export default handleActions({
  ADD_SUBJECT : addSubject,
  MODIFY_SUBJECT : modifySubject,

  SET_EDIT_SUBJECT : (state, { payload: { hash, mode } }) => {
    const subject = state.get(hash);
    if (!subject) {
      return state;
    }
    return modifySubject(state, { payload: { hash, newSubject: subject.setMode(mode) } });
  },

  SWITCH_MODE_PREV_NEXT:(state, { payload: { prevHash, nextHash } }) => {

    let prevSubject = null;

    //-1 represents that no component is selected right now or we have to unselect components
    if (prevSubject != -1) {
      prevSubject = state.get(prevHash);
    }

    let nextSubject = null;

    if(nextHash != -1){
      nextSubject = state.get(nextHash);
    }

    if(prevSubject && nextSubject){
      return state.update(prevHash, ()=>prevSubject.setMode('view')).update(nextHash, ()=>nextSubject.setMode('edit'));
    } else if(prevSubject){
      return state.update(prevHash, ()=>prevSubject.setMode('view'));
    } else if(nextSubject){
      return state.update(nextHash, ()=>nextSubject.setMode('edit'));
    }

    return state;
  },

  REMOVE_SUBJECT:(state, {payload:{hash}})=>(
    state
    .update(state.get(hash).get('parentHash'), (host)=>host.removeFromChildren(hash))
    .remove(hash)
  ),

  MOVE_SUBJECT : (state, {payload:{id, afterId}})=> {
    return state.update(state.get(id).get('parentHash'), (host)=>host.moveChild(id, afterId))
  },

  SWITCH_CHILDS_MODE: (state, {payload:{hash, mode}})=>(
     R.reduce(
      (oldState, childHash)=> oldState.update(childHash, (oldSubject)=> oldSubject.setMode(mode))
    )(state, state.get(hash).get('children'))
  ),

  SET_CONTENT_STATE: setContentState,

  SET_CONTENT_STATE_MULTI: setContentStateMulti,

  UPDATE_DATA: updataData,

  // this sets subjects when we fetch author page
  'author/page/LOAD_SUCCESS': authorPageLoadSuccessHandler,

  // this sets subjects when we fetch author collection page
  'author/collection/LOAD_SUCCESS': authorPageLoadSuccessHandler,

  // this sets subjects when we fetch user page
  'page/LOAD_SUCCESS':userPageLoadSuccessHandler,

  'userCollectionArticle/LOAD_SUCCESS':userPageLoadSuccessHandler,
  LEAVE_PAGE_ROUTE: (state) => initialState,
}, initialState);

  // switchAllComponentsToViewMode: function() {
  //   this.refs.page_editor.refs.componentsList.saveComponents();

  //   for (let i = 0; i < this.state.comps.length; i++) {
  //     this.state.comps[i].mode = 'view';
  //   }

  //   this.forceUpdate();
  // },
