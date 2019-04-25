import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import aggressiveComponentSave from './aggressiveComponentSave';
import author from './author';
import collectionArticlePreview from './collectionArticlePreview';
import loader from './loader';
import modals from './modals';
import payment from './payment';
import page from './page';
import pagePreview from './pagePreview';
import pageSummary from './PageSummary';
import reader from './reader';
import routeObserver from './routeObserver';
import search from './search';
import selectedWidget from './selectedWidget';
import subjects from './subjects';
import ajaxMode from './ajaxMode';
import user from './user';
import userCollectionArticle from './userCollectionArticle';

const router = (state = {}, action) => routerStateReducer(state, action);

export default combineReducers({
  ajaxMode,
  aggressiveComponentSave,
  author,
  collectionArticlePreview,
  loader,
  modals,
  payment,
  page,
  pagePreview,
  pageSummary,
  reader,
  routeObserver,
  search,
  selectedWidget,
  subjects,
  user,
  userCollectionArticle,
  router: routerStateReducer,
});
