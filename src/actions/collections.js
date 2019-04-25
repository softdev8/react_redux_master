import { serverUrl } from '../config-old';
import ajaxPromise from '../ajaxPromise';
import { createAction } from 'redux-actions';
import { checkError } from '../utils/errorResponseUtils';
import { setLoaderState } from './index';

export const resetCollection = () => (dispatch) => {
  dispatch(createAction('RESET_COLLECTION')());
};

export const createCollection = () => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection`,
    type : 'POST',
  });
};

export const getCollectionDirectCall = ({ collection_id, user_id, is_draft_page }) => {
  const url = is_draft_page ? `author/collection/${collection_id}` : `collection/${user_id}/${collection_id}`;

  return ajaxPromise({
    url  : `${serverUrl}/api/${url}`,
    type : 'GET',
  });

};

export const getCollection = (params) => (dispatch) => {

  dispatch(setLoaderState({ isLoading : true }));

  getCollectionDirectCall(params).then(data => {
    const parsedData = JSON.parse(data);

    dispatch(createAction('SET_COLLECTION')(parsedData));
  }).catch(error => {
    checkError(error, dispatch);
  }).then(() => {
    dispatch(setLoaderState({ isLoading : false }));
  });
};

export const saveCollectionDirectCall = (collection_id, payload = {}) => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}`,
    type : 'PUT',
    data : payload,
  });
};

export const saveCollection = (params, cb) => (dispatch) => {

  dispatch(setLoaderState({ isLoading : true }));

  saveCollectionDirectCall(params.collection_id, params.payload).then(() => {
    const { payload } = params;
    // delete payload.categories_json_string;

    dispatch(createAction('UPDATE_COLLECTION_DETAILS')(payload));

    if (typeof cb === 'function') cb();

  }).catch(error => {
    checkError(error, dispatch);
  }).then(() => {
    dispatch(setLoaderState({ isLoading : false }));
  });
};

export const publishCollectionDirectCall = collection_id => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}/publish`,
    type : 'POST',
  });
};

export const deleteCollection = collection_id => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}`,
    type : 'DELETE',
  });
};

export const publishCollection = (collection_id, cb) => (dispatch) => {

  dispatch(setLoaderState({ isLoading : true }));

  publishCollectionDirectCall(collection_id).then(() => {
    dispatch(createAction('PUBLISH_COLLECTION')());

    if (typeof cb === 'function') cb();
  }).then(() => {
    dispatch(setLoaderState({ isLoading : false }));
  });
};

export const getCollectionImageUrl = collection_id => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}/image/upload/url`,
    type : 'GET',
  });
};

export const getCollectionUserDataUrl = collection_id => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}/udata/upload/url`,
    type : 'GET',
  });
};

export const addOfferToCollectionDirectCall = (collection_id, payload) => {
  return ajaxPromise({
    url : `${serverUrl}/api/author/collection/${collection_id}/offer`,
    type: 'POST',
    data: payload
  });
};

export const addArticleToCollectionDirectCall = collection_id => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}/page`,
    type : 'POST',
  });
};

export const cloneArticleToCollectionDirectCall = (collection_id, page_id) => {
  return ajaxPromise({
    url  : `${serverUrl}/api/author/collection/${collection_id}/page`,
    type : 'POST',
    data : {
      collection_id,
      page_id,
      instance_type: 'latest'
    }
  });
};

function getTuitionOfferIds(tuition_offers) {
  if (!tuition_offers || tuition_offers.length === 0) {
    return null;
  }

  const tuition_offer_ids = [];

  for (let i = 0; i < tuition_offers.length; ++i) {
    tuition_offer_ids.push(tuition_offers[i].offer_id);
  }

  return JSON.stringify(tuition_offer_ids);
}

function getUserDataFilesPayload(dataFiles) {
  const dataFilesPayload = [];

  for (let i = 0; i < dataFiles.length; ++i) {
    dataFilesPayload.push(dataFiles[i].file_id);
  }

  return JSON.stringify(dataFilesPayload);
}

function getPayload(collection) {
  const toc = JSON.stringify(collection.getIn(['instance', 'details', 'toc']));
  const details = collection.getIn(['instance', 'details']).toJS();
  const code_exec_resource_file_id = details.code_exec_resource_metadata ? details.code_exec_resource_metadata.file_id : null;
  const tuition_offer_ids = getTuitionOfferIds(details.tuition_offers);
  const user_data_files = getUserDataFilesPayload(details.udata_files);
  const default_themes_json_string = JSON.stringify({ code_themes: details.CodeThemes });;
  const testimonials = JSON.stringify(details.testimonials);

  delete details.toc;
  delete details.tuition_offers;
  delete details.udata_files;
  delete details.CodeThemes;
  delete details.testimonials;

  const payload = {
    ...details,
    price                     : details.price === 0 ? null : details.price,
    categories_json_string    : toc,
    testimonials_string       : testimonials,
    tuition_offer_ids_string  : tuition_offer_ids,
    user_data_file_ids_string : user_data_files,
    code_exec_resource_file_id,
    default_themes_json_string,
  };

  return payload;
}

export const addOfferToCollection = ({ collection_id, offer_payload }) => (dispatch, getState) => {
  dispatch(setLoaderState({ isLoading : true }));

  addOfferToCollectionDirectCall(collection_id, offer_payload)
    .then(offer_response => {
      console.log('Added Offer to Collection', offer_response);
      const tuition_offer = JSON.parse(offer_response);
      dispatch(createAction('ADD_TUITION_OFFER')({ tuition_offer, offer_payload }));

      const payload = getPayload(getState().author.collection);
      dispatch(saveCollection({ payload, collection_id }));
    })
    .catch(error => {
      console.log('ERROR_Add Offer to Collection');
      checkError(error, dispatch);
    })
    .then(() => {
      dispatch(setLoaderState({ isLoading : false }));
    });
};

export const addTestimonialToCollection = ({ testimonial }) => (dispatch, getState) => {
  // addTestimonialToCollectionDirectCall
  dispatch(createAction('ADD_TESTIMONIAL')({ testimonial }));
}

export const addArticleToCollection = ({ category_id, collection_id }) => (dispatch, getState) => {

  dispatch(setLoaderState({ isLoading : true }));

  addArticleToCollectionDirectCall(collection_id).then(article => {
    const parsedArticle = JSON.parse(article);

    dispatch(createAction('ADD_ARTICLE')({ category_id, article: parsedArticle }));

    const payload = getPayload(getState().author.collection);

    dispatch(saveCollection({ payload, collection_id }));

  }).catch(error => {
    checkError(error, dispatch);
  }).then(() => {
    dispatch(setLoaderState({ isLoading : false }));
  });
};

export const cloneArticleToCollection = ({ category_id, collection_id, src_article_id, src_article_title }) => (dispatch, getState) => {

  dispatch(setLoaderState({ isLoading : true }));

  cloneArticleToCollectionDirectCall(collection_id, src_article_id).then(article => {
    const parsedArticle = JSON.parse(article);
    parsedArticle.title = src_article_title;

    dispatch(createAction('CLONE_ARTICLE')({
      category_id,
      article: parsedArticle
    }));

    const payload = getPayload(getState().author.collection);

    dispatch(saveCollection({ payload, collection_id }));

  }).catch(error => {
    checkError(error, dispatch);
  }).then(() => {
    dispatch(setLoaderState({ isLoading : false }));
  });
};

// do some action before saving collection;
// i.e. after removing/adding category or article.
// see its using in EditCollectionPage container
export const saveAfterAction = (collection_id, action, actionData = {}) => {
  return (dispatch, getState) => {

    if (typeof action === 'string') {
      dispatch(createAction(action)(actionData));
    }

    const payload = getPayload(getState().author.collection);

    dispatch(saveCollection({ payload, collection_id }));

  };
};
