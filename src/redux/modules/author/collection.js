import { handleActions } from 'redux-actions';
import { fromJS, Iterable, Map, Seq } from 'immutable';
import Category from '../../../containers/CollectionPages/categoryClass';
import Article from '../../../containers/CollectionPages/articleClass';

let initial = fromJS({});

export default handleActions({
  RESET_COLLECTION : (state, payload) => {
    return initial;
  },

  SET_COLLECTION : (state, {payload}) => {
    if(!payload.instance.details.toc) {
      payload.instance.details.toc = {};
      payload.instance.details.toc.categories = [];
    }

    if(!payload.instance.details.udata_files) {
      payload.instance.details.udata_files = [];
    }

    if(payload.instance.details.default_themes) {
        payload.instance.details.CodeThemes = payload.instance.details.default_themes.code_themes;
    }
    else {
        payload.instance.details.CodeThemes ={
          Code: 'default',
          Markdown: 'default',
          RunJS: 'default',
          SPA: 'default',
        }
    }

    let collection = fromJS(payload);

    // add __default category on collection creation if it's empty
    if(!collection.getIn(['instance', 'details', 'toc', 'categories']).size) {
      collection = addDefaultCategory(collection);
    }

    return collection;
  },

  UPDATE_COLLECTION_DETAILS : (state, { payload }) => {
    const newState = state.updateIn(['instance', 'details'], value => {
      return value.merge(payload);
    });
    return newState;
  },

  ADD_CATEGORY : (state, action) => {
    let categories = state.getIn(['instance', 'details', 'toc', 'categories']);

    // replace __default category by new custom category
    if(isThereOnlyDefCategory(categories)) {
      state = state.setIn(['instance', 'details', 'toc', 'categories', 0, 'title'], 'Untitled category');
      state = state.setIn(['instance', 'details', 'toc', 'categories', 0, 'editMode'], true);
    } else {
      const IS_DEF_CATEGORY = false;
      const EDIT_MODE       = true;

      state = pushCategory(state, IS_DEF_CATEGORY, EDIT_MODE);
    }

    return state;
  },

  SET_DEFAULT_CODE_THEMES : (state, { payload }) => {
      state = state.setIn(['instance', 'details', 'CodeThemes', payload.type], payload.value);
      return state;
  },

  UPDATE_CATEGORY_TITLE : (state, { payload : {title, id}}) => {
    const editMode = false;

    title = title !== '__default' ? title : '';

    const index = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), id);

    return state.updateIn(['instance', 'details', 'toc', 'categories', index], category => {
      return category.merge({title, editMode});
    });
  },

  REMOVE_CATEGORY : (state, { payload : {id}}) => {
    const index = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), id);

    state = state.updateIn(['instance', 'details', 'toc', 'categories'], list => {
      return list.delete(index);
    });

    // add __default category if we just removed latest custom category
    if(!state.getIn(['instance', 'details', 'toc', 'categories']).size) {
      state = addDefaultCategory(state);
    }

    return state;
  },

  UPDATE_CODE_EXEC_RESOURCE_FILE : (state, { payload }) => {
    return state.updateIn(['instance', 'details', 'code_exec_resource_metadata'], () => (fromJS(payload)));
  },

  ADD_USER_DATA_RESOURCE_FILE: (state, { payload }) => {
    return state.updateIn(['instance', 'details', 'udata_files'], list => {
      return list.push(fromJS(payload));
    });
  },

  UPDATE_USER_DATA_RESOURCE_FILE: (state, { payload : { payload, index} }) => {
    return state.updateIn(['instance', 'details', 'udata_files', index], udata_file => {
      return udata_file.merge(payload);
    });
  },

  REMOVE_USER_DATA_RESOURCE_FILE: (state, { payload: {index} }) => {
    return state.updateIn(['instance', 'details', 'udata_files'], list => {
      return list.delete(index);
    });
  },

  ADD_TUITION_OFFER: (state, { payload : { tuition_offer, offer_payload } }) => {
    return pushTuitionOffer(state, tuition_offer, offer_payload);
  },

  REMOVE_TUITION_OFFER: (state, { payload : { index } }) => {
    return  state.updateIn(['instance', 'details', 'tuition_offers'], list => {
      return list.delete(index);
    });
  },

  ADD_TESTIMONIAL: (state, { payload: { testimonial } }) => {
    return state.updateIn(['instance', 'details', 'testimonials'], list => {
      const temp = JSON.parse(JSON.stringify(testimonial));
      if (list) {
        return list.push(temp);
      } else {
        return fromJS([ temp ]);
      }
    });
  },

  REMOVE_TESTIMONIAL: (state, { payload: { index } }) => {
    return state.updateIn(['instance', 'details', 'testimonials'], list => {
      return list.delete(index);
    });
  },

  ADD_ARTICLE : (state, { payload : { category_id, article } }) => {
    const categoryIndex = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), category_id);

    state = pushArticle(state, article, categoryIndex);

    return state;
  },

  CLONE_ARTICLE : (state, { payload : { category_id, article } }) => {
    const categoryIndex = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), category_id);

    state = pushClonedArticle(state, article, categoryIndex);

    return state;
  },

  REMOVE_ARTICLE : (state, { payload : { category_id, article_id } }) => {
    const categoryIndex = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), category_id);
    const articleIndex  = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages']), article_id);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages'], list => {
      return list.delete(articleIndex);
    });

    return state;
  },

  TOGGLE_ARTICLE_VISIBILITY : (state, { payload : { category_id, article_id } }) => {
    const categoryIndex = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), category_id);
    const articleIndex  = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages']), article_id);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages', articleIndex], article => {
      return article.set('is_preview', !article.get('is_preview'));
    });

    return state;
  },

  TOGGLE_IS_LESSON : (state, { payload : { category_id, article_id } }) => {
    const categoryIndex = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories']), category_id);
    const articleIndex  = getObjectIndexById(state.getIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages']), article_id);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages', articleIndex], article => {
      const is_lesson = article.get('is_lesson');
      return article.set('is_lesson', !(is_lesson === undefined || is_lesson === true));
    });

    return state;
  },

  DISCARD_CHANGES : (state, { payload: { originalCollection } }) => {
    return originalCollection;
  },

  PUBLISH_COLLECTION : (state) => {
    return state.setIn(['instance', 'type'], 'published');
  },

  MOVE_CATEGORY : (state, { payload : { from, to } }) => {
    const dragItem = state.getIn(['instance', 'details', 'toc', 'categories', from.itemIndex]);

    state = state.updateIn(['instance', 'details', 'toc', 'categories'], list => {
      return list.splice(from.itemIndex, 1).splice(to.itemIndex, 0, dragItem);
    });

    return state;
  },

  MOVE_ARTICLE_TO_EMTY_CATEGORY : (state, { payload : { from, to } }) => {
    const dragItem = state.getIn(['instance', 'details', 'toc', 'categories', from.parentIndex, 'pages', from.itemIndex]);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', from.parentIndex, 'pages'], list => {
      return list.splice(from.itemIndex, 1);
    }).updateIn(['instance', 'details', 'toc', 'categories', to.parentIndex, 'pages'], list => {
      return list.push(dragItem);
    });

    return state;
  },

  MOVE_ARTICLE_WITHIN_ORIGIN : (state, { payload : { from, to } }) => {
    const dragItem = state.getIn(['instance', 'details', 'toc', 'categories', from.parentIndex, 'pages', from.itemIndex]);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', to.parentIndex, 'pages'], list => {
      return list.splice(from.itemIndex, 1).splice(to.itemIndex, 0, dragItem);
    });

    return state;
  },

  MOVE_ARTICLE_TO_NOT_EMPTY_CATEGORY : (state, { payload : { from, to } }) => {
    const dragItem = state.getIn(['instance', 'details', 'toc', 'categories', from.parentIndex, 'pages', from.itemIndex]);

    state = state.updateIn(['instance', 'details', 'toc', 'categories', from.parentIndex, 'pages'], list => {
      return list.splice(from.itemIndex, 1);
    }).updateIn(['instance', 'details', 'toc', 'categories', to.parentIndex, 'pages'], list => {
      return list.splice(to.itemIndex, 0, dragItem);
    });

    return state;
  },
}, initial);

function pushCategory(state, IS_DEF_CATEGORY, EDIT_MODE) {
  return state.updateIn(['instance', 'details', 'toc', 'categories'], list => {
    let category = new Category(IS_DEF_CATEGORY, EDIT_MODE);

    category = JSON.parse(JSON.stringify(category));

    return list.push(fromJS(category));
  });
}

function pushArticle(state, { page_id }, categoryIndex) {
  return state.updateIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages'], list => {
    let article = new Article(page_id, 'Untitled Masterpiece');

    article = JSON.parse(JSON.stringify(article));

    return list.push(fromJS(article));
  });
}

function pushClonedArticle(state, { page_id, title }, categoryIndex) {
  return state.updateIn(['instance', 'details', 'toc', 'categories', categoryIndex, 'pages'], list => {
    let article = new Article(page_id, title);

    article = JSON.parse(JSON.stringify(article));

    return list.push(fromJS(article));
  });
}

function pushTuitionOffer(state, tuition_offer, payload) {
  payload.offer_id = tuition_offer.tuition_offer_id;

  return state.updateIn(['instance', 'details', 'tuition_offers'], list => {
    const offer = JSON.parse(JSON.stringify(payload));
    return list.push(fromJS(offer));
  });
}

// return true if only __default category exists
function isThereOnlyDefCategory(categories) {
  return categories.size && categories.get(0).get('title') == '__default';
}

function getObjectIndexById(list, id) {
  return list.findIndex( v => v.get('id') == id);
}

function addDefaultCategory(state) {
  const EDIT_MODE       = false;
  const IS_DEF_CATEGORY = true;

  return pushCategory(state, IS_DEF_CATEGORY, EDIT_MODE);
}
