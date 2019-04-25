import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({});

export default handleActions({
  PAGE_SUMMARY_CHANGE:(state, {payload})=>{

    state = state.merge(payload);

    return state;
  },

  'author/page/LOAD_SUCCESS': (state, {result:{summary}})=>{
    return Immutable.fromJS(summary || {});
  },

  'author/collection/LOAD_SUCCESS': (state, {result:{summary}})=>{
    return Immutable.fromJS(summary || {});
  },

  'page/LOAD_SUCCESS': (state, {result:{summary}})=>{
    return Immutable.fromJS(summary || {});
  },

  'userCollectionArticle/LOAD_SUCCESS': (state, {result:{summary}})=>{
    return Immutable.fromJS(summary || {});
  },

  LEAVE_PAGE_ROUTE: (state) => initialState,
}, initialState);

// getDefaultSummaryObject: function () {
//       return {
//         title: "[Page Title]",
//         author: "[Author Name]",
//         description: "[Description]",
//         tags: "technology",
//         date: "01/20/2015",
//         viewCount: 0,
//         commentsCount: 0,
//         likesCount: 0,
//         shareCount: 0
//       };
//     }