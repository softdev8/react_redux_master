import { combineReducers } from 'redux';

import collection from './collection';
import collectionArticle from './collectionArticle';
import page from './page';
import profile from './profile';
import work from './work';


export default combineReducers({
  collection,
  collectionArticle,
  page,
  profile,
  work,
});