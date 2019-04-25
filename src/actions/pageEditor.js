import { pushState } from 'redux-router';
import { getRootSubjectChildren } from '../selectors';
import { authorPagePublish, putPage,
  putCollectionArticle, updateModal, showModal,
  uploadCover, getArticleImageUrl,
  getCollectionArticleImageUrl, getArticleQuestionIds, getCollectionArticleQuestionIds,
  components, deletePage } from './index';
import pako from 'pako';
import { createAction } from 'redux-actions';
import { pageDataFormatHeader_v1 } from '../pakoUtils/config';
import * as selectedWidget from '../redux/modules/selectedWidget';
import { checkError } from '../utils/errorResponseUtils';
import { ModalTypes } from '../constants';
import { promiseFunc } from '../utils';
import { getAllComponentsSupportingAssessment } from '../component_meta';
const uuid = require('node-uuid');

// export const switchAllComponentsToViewMode = (rootHash) => {
//   // createAction('SWITCH_CHILDS_MODE')({hash:rootHash, mode:'view'})
//   return (dispatch, getState) => {
//     dispatch(selectedWidget.selectActive(-1));
//   };
// };

const transitionToPageViewer = (userId, pageId, preview) => {
  let strUrl = '';
  if (preview === true) {
    strUrl = '/page/{0}/{1}/draft'.format(userId, pageId);
  } else {
    strUrl = '/page/{0}/{1}'.format(userId, pageId);
  }
  return pushState({ forceTransition:true }, strUrl);
};

const transitionToCollectionArticlePageViewer = (userId, collectionId, pageId, preview) => {
  let strUrl = '';
  if (preview === true) {
    strUrl = '/collection/page/{0}/{1}/{2}/draft'.format(userId, collectionId, pageId);
  } else {
    strUrl = '/collection/page/{0}/{1}/{2}'.format(userId, collectionId, pageId);
  }
  return pushState({ forceTransition:true }, strUrl);
};

const updateImage = (imageContent, image_data, cb) =>
(dispatch, getState) => {
  image_data = JSON.parse(image_data);
  imageContent.content.image_id = image_data.image_id;
  const upload_url = image_data.upload_url;
  promiseFunc(dispatch, uploadCover, [{ upload_url, file:imageContent.content.file }])
  .then(() => {
    // Clean up file structure from Image Content so it doesnt get uploaded to server
    // We will dispatch updates to redux state here too
    delete imageContent.content.file;

    //Dispatch updates to redux state that the content has changed for uploaded images (image_id)
    let content = { image_id: imageContent.content.image_id, file: null };
    return promiseFunc(
      dispatch,
      components.updateContentState,
      [{
        hash: imageContent.hash,
        data: content,
      }],
    );
  })
  .then(() => {
    cb(null);
  });
};

const updateQuestions = (compsThatNeedQuestionIds, questionIdResult, cb) =>
(dispatch, getState) => {
  const questionIdsData = JSON.parse(questionIdResult);

  if (questionIdsData.question_ids.length != compsThatNeedQuestionIds.length) {
    throw new Error('Not enough question Ids returned from server');
  }

  const payload = [];

  for (let i = 0; i < compsThatNeedQuestionIds.length; i++) {
    compsThatNeedQuestionIds[i].content.server_question_id = questionIdsData.question_ids[i];

    payload.push({
      hash: compsThatNeedQuestionIds[i].hash,
      data: {
        server_question_id: questionIdsData.question_ids[i]
      }
    });
  }

  promiseFunc(
    dispatch,
    components.updateContentStateMulti,
    [{
      payload
    }]
  ).then(() => {
    cb(null);
  }).catch((error) => {
    cb(error);
  });
};

const getCollectionArticleQuestionIdPromise = (compsThatNeedQuestionIds, pageId, collectionId, cb) =>
(dispatch, getState) => {
  promiseFunc(dispatch, getCollectionArticleQuestionIds, [{ pageId, collectionId, count: compsThatNeedQuestionIds.length }])
  .then(questionIdResult => promiseFunc(dispatch, updateQuestions, [compsThatNeedQuestionIds, questionIdResult]))
  .then(() => {
    cb(null);
  }).catch((error) => {
    cb(error);
  });
};

const getSingleArticleQuestionIdPromise = (compsThatNeedQuestionIds, pageId, cb) =>
(dispatch, getState) => {
  promiseFunc(dispatch, getArticleQuestionIds, [{ pageId, count: compsThatNeedQuestionIds.length }])
  .then(questionIdResult => promiseFunc(dispatch, updateQuestions, [compsThatNeedQuestionIds, questionIdResult]))
  .then(() => {
    cb(null);
  }).catch((error) => {
    cb(error);
  });
};

const uploadCollectionArticleImage = (imageContent, pageId, collectionId, cb) =>
(dispatch, getState) => {
  promiseFunc(dispatch, getCollectionArticleImageUrl, [{ page_id: pageId, collection_id: collectionId }])
  .then(image_data => promiseFunc(dispatch, updateImage, [imageContent, image_data]))
  .then(() => {
    cb(null);
  }).catch((error) => {
    cb(error);
  });
};

const uploadSingleArticleImage = (imageContent, pageId, cb) =>
(dispatch, getState) => {
  promiseFunc(dispatch, getArticleImageUrl, [pageId])
  .then(image_data => promiseFunc(dispatch, updateImage, [imageContent, image_data]))
  .then(() => {
    cb(null);
  }).catch((error) => {
    cb(error);
  });
};

const getValidImageIds = (imagesComponents) =>
  imagesComponents.map((comp) => comp.content.image_id);

const updateCodeCounters = (comp, widgetStats) => {
  let runnableCount = 0;
  let exerciseCount = 0;
  let snippetCount = 0;
  const compType = comp.type;

  if (compType === 'RunJS' || compType === 'WebpackBin') {
    runnableCount++;
  } else if (compType === 'Code') {
    if (comp.content.runnable) {
      runnableCount++;
    } else if (comp.content.judge) {
      exerciseCount++;
    } else {
      snippetCount++;
    }
  } else if (compType === 'TabbedCode') {
    comp.content.codeContents.forEach((_comp) => {
      if (_comp.runnable) {
        runnableCount++;
      } else if (_comp.judge) {
        exerciseCount++;
      } else {
        snippetCount++;
      }
    });
  } else if (compType === 'MarkdownEditor') {
    // put html in a temp div so that jquery can process it.
    const mdHtml = `<div id='temp_place_holder'>${comp.content.mdHtml}</div>`;
    $(mdHtml).find('pre').each(function() {
      const pre = $(this);
      const code = pre.find('code');

      if (!code.length) {
        return;
      }

      snippetCount++;
    });
  }

  if ('codeExerciseCount' in widgetStats) {
    widgetStats.codeExerciseCount += exerciseCount;
  } else {
    widgetStats.codeExerciseCount = exerciseCount;
  }

  if ('codeRunnableCount' in widgetStats) {
    widgetStats.codeRunnableCount += runnableCount;
  } else {
    widgetStats.codeRunnableCount = runnableCount;
  }

  if ('codeSnippetCount' in widgetStats) {
    widgetStats.codeSnippetCount += snippetCount;
  } else {
    widgetStats.codeSnippetCount = snippetCount;
  }
};

const updateIllustrationCounters = (comp, widgetStats) => {
  let counter = 0;
  const compType = comp.type;

  switch (compType) {
    case 'Image':
    case 'Chart':
    case 'Graph':
    case 'Matrix':
    case 'LinkedList':
    case 'EducativeArray':
    case 'BinaryTree':
    case 'NaryTree':
    case 'Stack':
    case 'HashTable':
    case 'Graphviz':
    case 'SVGEdit':
    case 'SVG':
    case 'Canvas':
      counter++;
      break;

    default:
      break;
  }

  if (compType === 'CanvasAnimation') {
    counter += comp.content.canvasObjects.length;
  }

  if ('illustrations' in widgetStats) {
    widgetStats.illustrations += counter;
  } else {
    widgetStats.illustrations = counter;
  }
};

// TODO: readingTIME
const getWidgetStats = (comps) => {
  let widgetStats = {};

  comps.forEach((comp) => {
    let compType = comp.type;

    if (compType in widgetStats) {
      widgetStats[compType]++;
    } else {
      widgetStats[compType] = 1;
    }

    updateCodeCounters(comp, widgetStats);
    updateIllustrationCounters(comp, widgetStats);
  });

  return JSON.stringify(widgetStats);
};

const uploadAllArticleImagesAndUpdateQuestionIds = (userId, pageId, collectionId, cover_image, comps, cb) =>
(dispatch, getState) => {
  const imagesToUpload = [];
  const allImages = [];
  const compsThatNeedIdPayload = [];

  // Get all components that needs new image ids and question Ids
  for (let i = 0; i < comps.length; i++) {
    if (comps[i].type === 'Image' || comps[i].type === 'File') {
      allImages.push(comps[i]);
      if (comps[i].content.image_id === null && comps[i].content.file) {
        imagesToUpload.push(comps[i]);
      }
    }

    if (comps[i].content && !comps[i].content.comp_id) {
      const new_comp_id = uuid.v4();

      comps[i].content.comp_id = new_comp_id;
      compsThatNeedIdPayload.push({
        hash: comps[i].hash,
        data: {
          comp_id: new_comp_id,
        }
      });
    }
  }

  // update in redux state
  if (compsThatNeedIdPayload.length > 0) {
    components.updateContentStateMulti(
      {
        payload: compsThatNeedIdPayload,
      },
      null
    );
  }

  const uploadPromises = [];

  if (imagesToUpload.length > 0) {
    dispatch(updateModal({ status:'WAIT', text:'Uploading Files and Images' }));

    for (let i = 0; i < imagesToUpload.length; i++) {
      if (collectionId) {
        uploadPromises.push(promiseFunc(dispatch, uploadCollectionArticleImage, [imagesToUpload[i], pageId, collectionId]));
      } else {
        uploadPromises.push(promiseFunc(dispatch, uploadSingleArticleImage, [imagesToUpload[i], pageId]));
      }
    }

    Promise.all(uploadPromises)
    .then(() => {
      const validImageIds = getValidImageIds(allImages);
      cb(null, { cover_image, comps, validImageIds });
    }, (error) => {
      console.error(error);
      cb(error);
      dispatch(updateModal({ status:'ERROR', text:'Uploading File or Image failed. Please retry' }));
    });
  } else {
    const validImageIds = getValidImageIds(allImages);
    cb(null, { cover_image, comps, validImageIds });
  }
};

const getPageJson = (page, comps, summary, cover_image) =>
  JSON.stringify({
    components: comps,
    summary,
    pageProperties: page ? page.pageProperties : {},
    cover_image_id: cover_image.image_id,
    cover_image_metadata: cover_image.metadata
  });

const getDeflatedPageContent = (page, comps, pageSummaryJS, cover_image) =>
  pageDataFormatHeader_v1 + pako.deflate(getPageJson(page, comps, pageSummaryJS, cover_image), { to: 'string', level: 9 });

export const prepareToRunPageEditorAction = (cover_image, imagePath, setPendingAction, onUploadCompleteCoverImage, cb) =>
(dispatch, getState) => {
  dispatch(showModal(ModalTypes.PROGRESS, {
    status: 'WAIT',
    text: 'Starting to Save'
  }));

  if (cover_image.file && cover_image.updated) {
    dispatch(updateModal({
      status: 'WAIT',
      text: 'Uploading Files and Images'
    }));

    promiseFunc(dispatch, uploadCover, [cover_image])
    .then(image_data => {
      image_data = JSON.parse(image_data);

      if (image_data) {
        cover_image.updated   = false;
        cover_image.file_name = image_data.file_name;
        cover_image.image     = `${imagePath}/${image_data.image_id}`;
        cover_image.image_id  = image_data.image_id;
      }

      onUploadCompleteCoverImage(cover_image);

      cb(setPendingAction, cover_image);
    })
    .catch(error => {
      dispatch(updateModal({
        status:'ERROR',
        text:'Upload Image failed',
      }));
      console.error(error);
    });
  } else {
    cb(setPendingAction, cover_image);
  }
};

const setupOrExecuteAction = (setPendingAction, action, cover_image) =>
(dispatch, getState) => {
  const { subjects, selectedWidget } = getState();
  const selectedHash = selectedWidget.get('selectedHash');
  let selectedSubject = null;
  let selectedSubjectMode = null;

  if (selectedHash > 0) {
    selectedSubject = subjects.get(selectedHash);
    if (selectedSubject != null) {
      selectedSubjectMode = selectedSubject.getMode();
    }
  }

  if (selectedHash > 0 && selectedSubject != null && selectedSubjectMode == 'edit') {
    setPendingAction(action.bind(null, cover_image));
    dispatch(createAction('BUMP_SUBJECT_VERSION')({ hash: selectedHash }));
    // dispatch(switchAllComponentsToViewMode('0'));
  } else {
    // dispatch(switchAllComponentsToViewMode('0'));
    dispatch(action(cover_image));
  }
};

export const runAnyAction = (action) =>
  (dispatch, getState) => {
    dispatch(action());
  };

const putPageAction = (cover_image, comps, validImageIds, cb) =>
(dispatch, getState) => {
  dispatch(updateModal({ status:'WAIT', text:'Optimizing Article to save' }));
  const { router:{ params:{ page_id:pageId, collection_id:collectionId } }, author:{ page:{ data:page } }, pageSummary } = getState();
  const pageSummaryJS =  pageSummary.toJS();
  const deflatedPageContent = getDeflatedPageContent(page, comps, pageSummaryJS, cover_image);
  const widgetStats = getWidgetStats(comps);

  dispatch(updateModal({ status:'WAIT', text:'Saving Article' }));

  const coverImageMetadata = cover_image.metadata ? JSON.stringify(cover_image.metadata) : '';
  if (!collectionId) {
    return dispatch(putPage({
      pageId,
      page_title   : pageSummaryJS.title,
      page_summary : pageSummaryJS.description,
      price        : pageSummaryJS.price,
      is_priced    : pageSummaryJS.is_priced,
      version      : pageSummaryJS.version,
      tags         : pageSummaryJS.tags ? pageSummaryJS.tags.toString() : '',
      page_content_encoding: 'deflate',
      page_content: deflatedPageContent,
      cover_image_id : cover_image.image_id,
      cover_image_metadata : coverImageMetadata,
      widget_stats: widgetStats
    }, cb));
  } else {
    return dispatch(putCollectionArticle({
      collectionId,
      pageId,
      page_title   : pageSummaryJS.title,
      page_summary : pageSummaryJS.description,
      price        : pageSummaryJS.price,
      is_priced    : pageSummaryJS.is_priced,
      version      : pageSummaryJS.version,
      tags         : pageSummaryJS.tags ? pageSummaryJS.tags.toString() : '',
      page_content_encoding: 'deflate',
      page_content: deflatedPageContent,
      cover_image_id : cover_image.image_id,
      cover_image_metadata : coverImageMetadata,
      widget_stats: widgetStats
    }, cb));
  }
};

const saveActionBase = (cover_image, isCollection, cb) =>
(dispatch, getState) => {
  const { user:{ info:{ data:userInfo } }, router:{ params:{ page_id:pageId, collection_id:collectionId } }, subjects } = getState();
  const comps = getRootSubjectChildren(subjects).toJS();
  return promiseFunc(dispatch, uploadAllArticleImagesAndUpdateQuestionIds, [userInfo.user_id, pageId, isCollection ? collectionId : null, cover_image, comps])
  .then(({ cover_image, comps, validImageIds }) => {
    return promiseFunc(dispatch, putPageAction, [cover_image, comps, validImageIds])
    .then(() => {
      cb(null, { selAfterSave: comps.length ? comps[0].hash : -1 });
    }).catch((error) => {
      console.log(error);
      checkError(error, dispatch);
      dispatch(updateModal({ status:'ERROR', text:'Unable to Save Changes' }));
    });
  });
};

const saveAction = (cover_image) =>
(dispatch, getState) => {
  return promiseFunc(dispatch, saveActionBase, [cover_image, false])
  .then(({ selAfterSave }) => {
    dispatch(updateModal({ status:'SUCCESS', text:'Article Saved successfully' }));
    // dispatch(selectedWidget.selectActive(selAfterSave));
  }).catch((error) => {
    console.log(error);
    checkError(error, dispatch);
    dispatch(updateModal({ status:'ERROR', text:'Unable to Save' }));
  });
};

const publishAction = (cover_image) =>
(dispatch, getState) => {
  const { user:{ info:{ data:userInfo } }, router:{ params:{ page_id:pageId } } } = getState();
  promiseFunc(dispatch, saveActionBase, [cover_image, false])
  .then(() => {
    dispatch(updateModal({ status:'WAIT', text:'Publishing Article' }));
    return promiseFunc(dispatch, authorPagePublish, [pageId])
      .then(() => {
        dispatch(updateModal({ status:'SUCCESS', text:'Article is now Published' }));
        dispatch(transitionToPageViewer(userInfo.user_id, pageId, false));
      }).catch((error) => {
        console.log(error);
        checkError(error, dispatch);
        dispatch(updateModal({ status:'ERROR', text:'Unable to Publish' }));
      });
  });
};

const previewAction = (cover_image) =>
(dispatch, getState) => {
  const { user:{ info:{ data:userInfo } }, router:{ params:{ page_id:pageId }, location:{ pathname } } } = getState();

  promiseFunc(dispatch, saveActionBase, [cover_image, false])
  .then(() => {
    dispatch(updateModal({ status:'SUCCESS', text: 'Article Saved successfully' }));
    if (pathname == '/demo') {
      dispatch(pushState({ forceTransition:true }, '/demo/draft'));
      return;
    }
    dispatch(transitionToPageViewer(userInfo.user_id, pageId, true));
  }).catch((error) => {
    console.log(error);
    checkError(error, dispatch);
    dispatch(updateModal({ status:'ERROR', text:'Unable to Save' }));
  });
};

const saveCollectionArticleAction = (cover_image) =>
(dispatch, getState) => {
  promiseFunc(dispatch, saveActionBase, [cover_image, true])
  .then(({ selAfterSave }) => {
    dispatch(updateModal({ status:'SUCCESS', text:'Article Saved successfully' }));
    // dispatch(selectedWidget.selectActive(selAfterSave));
  }).catch((error) => {
    console.log(error);
    checkError(error, dispatch);
    dispatch(updateModal({ status:'ERROR', text:'Unable to Save' }));
  });
};

const previewCollectionArticleAction = (cover_image) =>
(dispatch, getState) => {
  const { user:{ info:{ data:userInfo } }, router:{ params:{ page_id:pageId, collection_id:collectionId }, location:{ pathname } } } = getState();

  promiseFunc(dispatch, saveActionBase, [cover_image, true])
  .then(() => {
    dispatch(updateModal({ status:'SUCCESS', text:'Article Saved successfully' }));
    dispatch(transitionToCollectionArticlePageViewer(userInfo.user_id, collectionId, pageId, true));
  }).catch((error) => {
    console.log(error);
    checkError(error, dispatch);
    dispatch(updateModal({ status:'ERROR', text:'Unable to Save' }));
  });
};

export const deleteSingleArticle = (pageId) => {
  return (dispatch, getState) => {
    dispatch(showModal(ModalTypes.PROGRESS, { status:'WAIT', text:'Deleting Article' }));
    deletePage(pageId)
    .then(() => {
      dispatch(updateModal({ status:'SUCCESS', text:'Article deleted' }));
      dispatch(pushState({ forceTransition:true }, '/teach'));
    }).catch((error) => {
      console.log(error);
      checkError(error);
      dispatch(updateModal({ status:'ERROR', text:'Unable to Delete' }));
    });
  };
};

export const saveAll = (setPendingAction, cover_image) =>
  setupOrExecuteAction(setPendingAction, saveAction, cover_image);

export const publish = (setPendingAction, cover_image) =>
  setupOrExecuteAction(setPendingAction, publishAction, cover_image);

export const preview = (setPendingAction, cover_image) =>
  setupOrExecuteAction(setPendingAction, previewAction, cover_image);

export const saveCollectionArticle = (setPendingAction, cover_image) =>
  setupOrExecuteAction(setPendingAction, saveCollectionArticleAction, cover_image);

export const previewCollectionArticle = (setPendingAction, cover_image) =>
  setupOrExecuteAction(setPendingAction, previewCollectionArticleAction, cover_image);
