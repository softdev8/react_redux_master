import { serverUrl } from '../config-old';
import ajaxPromise from '../ajaxPromise';
export * as pageViewer from './pageViewer';
export * as pageSummary from './pageSummary';
export * as pageList from './pageList';
export * as pageItem from './pageItem';
export * as pageEditor from './pageEditor';
export * from './search';

export const pagePropertyChange = (obj) => createAction('PAGE_PROPERTY_CHANGE')(obj);

export * from './collections';
export * from './settings';
export * from './authorisation';
export * from './modals';
export * from './payment';
export * from './loader';
export * from './profile';

export * as components from './components';

export const authorPagePublish = (
  id,
  cb,
) => ({
  AJAX_CALL: {
    url: serverUrl + '/api/author/page/{0}/publish'.format(id),
    type: 'POST',
    cb,
  },
});

export const authorCreatePage = () =>
  ajaxPromise({
    url: `${serverUrl}/api/author/page`,
    type: 'POST',
  });

export const recommend = (data) =>
  ajaxPromise({
    url: serverUrl + '/api/recommend',
    type: 'POST',
    data
  });

export const unrecommend = (data) =>
  ajaxPromise({
    url: serverUrl + '/api/unrecommend',
    type: 'POST',
    data
  });

export const collectionStats = (collectionId) =>
  ajaxPromise({
    url: serverUrl + '/api/author/collection/{0}/stats'.format(collectionId),
    type: 'GET'
  });

export const collectionSales = (collectionId) =>
  ajaxPromise({
    url: serverUrl + '/api/author/sales/{0}'.format(collectionId),
    type: 'GET'
  });

export const collectionHelpServices = ({ authorId, collectionId }) =>
  ajaxPromise({
    url: serverUrl + `/api/collection/${authorId}/${collectionId}`,
    type: 'GET'
  });

export const subscribeCourse = ({ authorId, collectionId }) =>
  ajaxPromise({
    url: serverUrl + '/api/subscribe/collection/{0}/{1}'.format(authorId, collectionId),
    type: 'POST'
  });

export const unsubscribeCourse = ({ authorId, collectionId }) =>
  ajaxPromise({
    url: serverUrl + '/api/subscribe/collection/{0}/{1}'.format(authorId, collectionId),
    type: 'DELETE'
  });

export const codeExecute = (data) =>
  ajaxPromise({
    url: `${serverUrl}/api/code/execute`,
    type: 'POST',
    data,
  });

export const codeJudge = (data) =>
  ajaxPromise({
    url: `${serverUrl}/api/code/judge`,
    type: 'POST',
    data,
  });

export const putPage = (
  { pageId, ...rest },
  cb,
) => ({
  AJAX_CALL: {
    url: serverUrl + '/api/author/page/{0}'.format(pageId),
    type: 'PUT',
    data: rest,
    cb,
  },
});

export const deletePage = (pageId) =>
  ajaxPromise({
    url: serverUrl + '/api/author/page/{0}'.format(pageId),
    type: 'DELETE',
  });

export const getArticleQuestionIds = (
  { pageId, ...rest },
  cb,
) => ({
  AJAX_CALL: {
    url: serverUrl + '/api/author/page/{0}/question'.format(pageId),
    type: 'POST',
    data: rest,
    cb,
  },
});

export const getCollectionArticleQuestionIds = (
  { collectionId, pageId, ...rest },
  cb,
) => ({
  AJAX_CALL: {
    url: serverUrl + '/api/author/collection/{0}/page/{1}/question'.format(collectionId, pageId),
    type: 'POST',
    data: rest,
    cb,
  },
});

export const putCollectionArticle = (
  { collectionId, pageId, ...rest },
  cb,
) => ({
  AJAX_CALL: {
    url: serverUrl + '/api/author/collection/{0}/page/{1}'.format(collectionId, pageId),
    type: 'PUT',
    data: rest,
    cb,
  },
});

export const readerFeatured = () => ({
  AJAX_CALL: {
    url: `${serverUrl}/api/reader/featured`,
    type: 'GET',
  },
});

export const getArticleImageUrl = (
  page_id,
  cb,
) => ({
  AJAX_CALL: {
    url  : `${serverUrl}/api/author/page/${page_id}/image/upload/url`,
    type : 'GET',
    cb,
  },
});

export const uploadCover = ({ upload_url, file }, cb) => {
  const data = new FormData();
  data.append('file-0', file);

  return {
    AJAX_CALL: {
      url  : `${serverUrl}${upload_url}`,
      type : 'POST',
      data,
      processData : false,
      contentType : false,
      cb,
    },
  };
};

export const getCollectionArticleImageUrl = ({ collection_id, page_id }, cb) => {
  const url = `author/collection/${collection_id}/page/${page_id}/image/upload/url`;
  return {
    AJAX_CALL: {
      url  : `${serverUrl}/api/${url}`,
      type : 'GET',
      cb,
    },
  };
};

export const subscribeForAnnouncements = (data) =>
  ajaxPromise({
    url: `${serverUrl}/api/subscribe/announcements`,
    type: 'POST',
    data,
  });
