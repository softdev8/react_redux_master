import React, { Component, PropTypes } from 'react';
import { createAction } from 'redux-actions';
import { pushState } from 'redux-router';
import { Button } from 'react-bootstrap';

import { Header, Footer,
         CollectionContentEdit,
         CollectionCodeExecResourceFile,
         CodeThemes,
         CollectionDataFiles,
         CollectionTestimonialsEdit,
         CollectionTuitionOffers,
         CollectionFeature,
         StatusControl,
         CollectionButtonsPanel, Icons } from '../../components';

import { addArticleToCollection,
         cloneArticleToCollection,
         saveCollection,
         publishCollection,
         getCollectionImageUrl,
         getCollectionUserDataUrl,
         saveAfterAction,
         uploadCover,
         deleteCollection,
         addOfferToCollection,
         addTestimonialToCollection } from '../../actions';

import {parseError} from '../../utils/errorResponseUtils';
import { promiseFunc } from '../../utils';

import decorator from './collectionPageDecorator';

const IS_EDITOR = true;

function makeDeepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

@decorator('write', IS_EDITOR)
class EditCollectionPage extends Component {

  static propTypes = {
    dispatch              : PropTypes.func.isRequired,
    collection            : PropTypes.object.isRequired,
    collection_id         : PropTypes.string.isRequired,
    cover_image           : PropTypes.object.isRequired,
    codeExecResourceFile  : PropTypes.object.isRequired,
    searchString          : PropTypes.string.isRequired,
    userInfo              : PropTypes.object.isRequired,
    is_draft              : PropTypes.bool.isRequired,
    contentLoading        : PropTypes.bool,
    CodeThemes            : PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.onUpdateCodeExecResourceFile = this.onUpdateCodeExecResourceFile.bind(this);
    this.onUpdateDataFile             = this.onUpdateDataFile.bind(this);
    this.onUpdateCoverImage           = this.onUpdateCoverImage.bind(this);
    this.onSaveFormData               = this.onSaveFormData.bind(this);
    this.onSaveCategoryTitle          = this.onSaveCategoryTitle.bind(this);
    this.onAddCategory                = this.onAddCategory.bind(this);
    this.onAddArticle                 = this.onAddArticle.bind(this);
    this.onCloneArticle               = this.onCloneArticle.bind(this);
    this.onAddTuitionOffer            = this.onAddTuitionOffer.bind(this);
    this.onRemoveTuitionOffer         = this.onRemoveTuitionOffer.bind(this);
    this.onAddTestimonial             = this.onAddTestimonial.bind(this);
    this.onRemoveTestimonial          = this.onRemoveTestimonial.bind(this);
    this.getTuitionOffers             = this.getTuitionOffers.bind(this);
    this.onToggleArticlePreview       = this.onToggleArticlePreview.bind(this);
    this.onToggleIsLesson             = this.onToggleIsLesson.bind(this);
    this.onRemoveArticle              = this.onRemoveArticle.bind(this);
    this.onRemoveCategory             = this.onRemoveCategory.bind(this);
    this.onError                      = this.onError.bind(this);
    this.resetGlobalAction            = this.resetGlobalAction.bind(this);

    this.onDiscard  = this.onDiscard.bind(this);

    this.onMoveItem = this.onMoveItem.bind(this);
    this.onChangeThemes = this.onChangeThemes.bind(this);

    this.state = {
      originalCollection   : props.collection,
      cover_image          : props.cover_image,
      globalAction         : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cover_image != this.props.cover_image) {
      this.setState({
        cover_image: nextProps.cover_image
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.globalAction === 'save' && nextState.globalAction === 'save') {
      return false;
    }

    return true;
  }

  onRemoveCategory(category_id) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'REMOVE_CATEGORY', { id: category_id }));

  }

  onSaveCategoryTitle(id, title) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'UPDATE_CATEGORY_TITLE', { id, title }));

  }

  onAddArticle(category_id) {
    const { collection_id } = this.props;

    this.props.dispatch(addArticleToCollection({ collection_id, category_id }));

  }

  onCloneArticle(category_id, src_article_id, src_article_title) {
    const { collection_id } = this.props;

    this.props.dispatch(cloneArticleToCollection({
      collection_id,
      category_id,
      src_article_id,
      src_article_title
    }));
  }

  onAddCategory() {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'ADD_CATEGORY'));
  }

  onAddTuitionOffer({ title, description, duration, price, discounted_price }) {
    // console.log('___________onAddTuitionOffer________TODO', title, description, duration, price, discounted_price);
    const { collection_id } = this.props;

    this.props.dispatch(addOfferToCollection({
      collection_id,
      offer_payload: {
        title,
        description,
        duration,
        price,
        discounted_price,
      }
    }));
  }

  onRemoveTuitionOffer(index) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'REMOVE_TUITION_OFFER', { index }));
  }

  onAddTestimonial({text, name, title}) {
    this.props.dispatch(addTestimonialToCollection({
      testimonial: {
        text,
        name,
        title
      }
    }));
  }

  onRemoveTestimonial(index) {
    this.props.dispatch(createAction('REMOVE_TESTIMONIAL')({ index }));
  }

  onError(error) {
    const statuscontrol = this.refs.statuscontrol;
    const errText       = parseError(error);

    if (errText !== null) {
      statuscontrol.seterrortext(errText);
    } else {
      statuscontrol.seterror();
    }

    this.resetGlobalAction();
  }

  onRemoveArticle(category_id, article_id) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'REMOVE_ARTICLE', { category_id, article_id }));

  }

  onToggleArticlePreview(category_id, article_id) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'TOGGLE_ARTICLE_VISIBILITY', { category_id, article_id }));

  }

  onToggleIsLesson(category_id, article_id) {
    const { collection_id } = this.props;

    this.props.dispatch(
      saveAfterAction(collection_id, 'TOGGLE_IS_LESSON', { category_id, article_id }));

  }

  onUpdateCoverImage(newImage) {
    const { collection_id } = this.props;

    if (!newImage.cover_image) {
      const cover_image = {
        image      : newImage.cover_thumbnail,
        file       : newImage.cover_image,
        updated    : true,
      };

      this.setState({
        cover_image,
      });

      return;
    }

    getCollectionImageUrl(collection_id).then(image => {
      const parsedImage = JSON.parse(image);

      const cover_image = {
        image      : newImage.cover_thumbnail,
        file       : newImage.cover_image,
        image_id   : parsedImage.image_id,
        metadata   : newImage.metadata,
        upload_url : parsedImage.upload_url,
        updated    : true,
      };

      this.setState({
        cover_image,
      });
    });

  }

  onUpdateCodeExecResourceFile(newImage) {
    if (!newImage.file) {
      const codeExecResourceFile = {
        file_id   : newImage.file_id,
        file_name : newImage.file_name,
        file_size : newImage.file_size,
        updated   : true
      };

      this.props.dispatch(createAction('UPDATE_CODE_EXEC_RESOURCE_FILE')(codeExecResourceFile));

      return;
    }

    getCollectionImageUrl(this.props.collection_id).then(image => {
      const parsedImage = JSON.parse(image);
      const codeExecResourceFile = {
        file       : newImage.file,
        file_id    : parsedImage.image_id,
        file_name  : newImage.file.name,
        file_size  : newImage.file.size,
        upload_url : parsedImage.upload_url,
        updated    : true,
      };

      this.props.dispatch(createAction('UPDATE_CODE_EXEC_RESOURCE_FILE')(codeExecResourceFile));
    });
  }

  onUpdateDataFile(newImage) {
    if (!newImage.file) return;

    getCollectionUserDataUrl(this.props.collection_id).then(udata => {
      const datafile = JSON.parse(udata);
      const udata_file = {
        file       : newImage.file,
        file_id    : datafile.udata_id,
        file_name  : newImage.file.name,
        file_size  : newImage.file.size,
        upload_url : datafile.upload_url,
        updated    : true,
      };

      this.props.dispatch(createAction('ADD_USER_DATA_RESOURCE_FILE')(udata_file));
    });
  }

  onRemoveDataFile = (index) => {
    this.props.dispatch(createAction('REMOVE_USER_DATA_RESOURCE_FILE')({index}));
  }

  onChangeThemes(type, value) {
    const { collection_id } = this.props;
    const default_code_theme = {
      type: type,
      value: value,
    };
    this.props.dispatch(
      saveAfterAction(collection_id, 'SET_DEFAULT_CODE_THEMES', default_code_theme));
  }

  onSaveFormData(data) {
    const saveToServerActions = ['save', 'publish', 'preview'];

    if (saveToServerActions.indexOf(this.state.globalAction) !== -1) this.saveCollection(data);

    // save form fields to collection locally
    else {
      this.props.dispatch(createAction('UPDATE_COLLECTION_DETAILS')(data));
      this.refs.statuscontrol.reset();
    }
  }

  onDiscard() {

    const { originalCollection } = this.state;
    const { cover_image, codeExecResourceFile } = this.props;

    this.props.dispatch(createAction('DISCARD_CHANGES')({ originalCollection }));

    this.setState({
      cover_image : makeDeepCopy(cover_image),
      codeExecResourceFile : makeDeepCopy(codeExecResourceFile)
    });

  }

  onMoveItem(from, to) {

    const { dispatch } = this.props;
    const moveCategory = typeof from.parentIndex === 'undefined' && from.parentIndex === to.parentIndex;
    const moveInsideSameParent = from.parentIndex === to.parentIndex;

    if (moveCategory) {

      dispatch(createAction('MOVE_CATEGORY')({ from, to }));

    } else {

      // add article to another empty category
      if (typeof to.itemIndex === 'undefined') {
        dispatch(createAction('MOVE_ARTICLE_TO_EMTY_CATEGORY')({ from, to }));

      // move article inside same category
      } else if (moveInsideSameParent) {
        dispatch(createAction('MOVE_ARTICLE_WITHIN_ORIGIN')({ from, to }));

      // place article to another not empty category
      } else {
        dispatch(createAction('MOVE_ARTICLE_TO_NOT_EMPTY_CATEGORY')({ from, to }));
      }

    }
  }

  setGlobalAction(action) {

    // set global action explicitly.
    // CollectionForm component is waiting for it.
    this.setState({
      globalAction : action,
    });
  }

  getCustomButtons() {
    return [{
      type   : 'default',
      text   : 'Discard',
      method : this.onDiscard,
    }, {
      type   : 'secondary',
      text   : 'Preview',
      method : () => this.setGlobalAction('preview'),
      icon   : 'playIcon',
    }, {
      className : 'b-btn_dark',
      text      : 'Save',
      method    : () => this.setGlobalAction('save'),
      icon      : Icons.downloadIcon,
    }, {
      type   : 'primary',
      text   : 'Publish',
      method : () => this.setGlobalAction('publish'),
      icon   : 'uploadIcon',
    }];
  }

  goToPreview() {
    const { collection_id, userInfo, dispatch } = this.props;
    const url = `/collection/${userInfo.user_id}/${collection_id}/draft`;

    dispatch(pushState(null, url));
  }

  performActionAfterSaving(action) {
    const { collection_id } = this.props;

    switch (action) {
      case 'publish' :
        this.props.dispatch(publishCollection(collection_id));
        break;
      case 'preview' :
        this.goToPreview();
        break;
      default : break;
    }
  }

  resetGlobalAction() {
    this.setState({
      globalAction : null,
    });
  }

  getTuitionOfferIds() {
    const tuition_offers = this.getTuitionOffers();

    if (!tuition_offers || tuition_offers.length === 0) {
      return null;
    }

    const tuition_offer_ids = [];

    for (let i = 0; i < tuition_offers.length; ++i) {
      tuition_offer_ids.push(tuition_offers[i].offer_id);
    }

    return JSON.stringify(tuition_offer_ids);
  }

  uploadUserDataFiles() {
    const dataFiles = this.getUserDataFiles();
    const uploadPromises = [];

    for (let i = 0; i < dataFiles.length; ++i) {
      const dataFile = dataFiles[i];
      if (dataFile.file && dataFile.updated) {
        uploadPromises.push(
          // promiseFunc(this.props.dispatch, uploadCover, [codeExecResourceFile])
          promiseFunc(this.props.dispatch, uploadCover, [dataFile])
          .then(
            file_data => {
              const parsedFileData = JSON.parse(file_data);
              // console.log(parsedFileData);

              dataFile.file = null;
              dataFile.upload_url = null;
              dataFile.updated = false;
              this.props.dispatch(createAction('UPDATE_USER_DATA_RESOURCE_FILE')({
                payload : dataFile,
                index   : i
              }));
            })
            .catch(this.onError));
      }
    }

    Promise.all(uploadPromises)
    .then(() => console.log('Uploaded user data files.'))
    .catch(error => {
      console.error('Failed to upload user data files.', error);
    });
  }

  getUserDataFilesPayload() {
    const dataFiles = this.getUserDataFiles();
    const dataFilesPayload = [];

    for (let i = 0; i < dataFiles.length; ++i) {
      dataFilesPayload.push(dataFiles[i].file_id);
    }

    return JSON.stringify(dataFilesPayload);
  }

  saveCollection(data) {

    const { cover_image } = this.state;
    const { collection_id, collection, codeExecResourceFile, CodeThemes } = this.props;

    const categories = JSON.stringify({ categories : collection.getIn(['instance', 'details', 'toc', 'categories']) });
    const testimonials = JSON.stringify(collection.getIn(['instance', 'details', 'testimonials']));
    const coverImageMetadata = cover_image.metadata ? JSON.stringify(cover_image.metadata) : '';
    const default_themes_json_string = JSON.stringify({ code_themes: collection.getIn(['instance', 'details', 'CodeThemes']) });

    const payload = {
      title                            : data.title || '',
      summary                          : data.summary || '',
      is_priced                        : data.is_priced,
      price                            : data.price === 0 ? null : data.price,
      discounted_price                 : data.discounted_price ? data.discounted_price : null,
      author_version                   : data.author_version,
      tags                             : data.tags,
      details                          : data.details,
      intro_video_url                  : data.intro_video_url,
      cover_image_id                   : cover_image.image_id || null,
      cover_image_metadata             : coverImageMetadata,
      categories_json_string           : categories,
      testimonials_string              : testimonials,
      tuition_offer_ids_string         : this.getTuitionOfferIds(),
      user_data_file_ids_string        : this.getUserDataFilesPayload(),
      code_exec_resource_file_id       : codeExecResourceFile.file_id || null,
      default_themes_json_string,
    };
    console.log(payload);

    this.props.dispatch(saveCollection({ collection_id, payload }, () => {

      // we don't want to make extra request if image didn't change
      // also if image didn't chane than we won't have actual upload url
      if (cover_image.file && cover_image.updated) {
        promiseFunc(this.props.dispatch, uploadCover, [cover_image]).then(
          image_data => {

            const parsedImage = JSON.parse(image_data);

            if (parsedImage) {
              cover_image.updated   = false;
              cover_image.file_name = parsedImage.file_name;
              cover_image.image     = `/api/author/collection/${collection_id}/image/${parsedImage.image_id}`;
              cover_image.image_id  = parsedImage.image_id;
            }

            this.setState({
              cover_image,
            });
          }).catch(this.onError);
      } else if (cover_image.updated) {
        this.setState({
          cover_image,
        });
      }

      if (codeExecResourceFile.file && codeExecResourceFile.updated) {
        promiseFunc(this.props.dispatch, uploadCover, [codeExecResourceFile]).then(
          image_data => {

            const parsedImage = JSON.parse(image_data);

            if (parsedImage) {
              codeExecResourceFile.file_name = parsedImage.file_name;
              codeExecResourceFile.file_id  = parsedImage.image_id;
              codeExecResourceFile.file_size = codeExecResourceFile.file.size;

              // cleanup
              codeExecResourceFile.file = null;
              codeExecResourceFile.upload_url = null;
              codeExecResourceFile.updated   = false;
            }

            this.props.dispatch(createAction('UPDATE_CODE_EXEC_RESOURCE_FILE')(codeExecResourceFile));
          }).catch(this.onError);
      }

      this.uploadUserDataFiles();

      this.performActionAfterSaving(this.state.globalAction);
      this.resetGlobalAction();
    }));

  }

  getTuitionOffers() {
    const { collection } = this.props;
    const coll  = collection.hasOwnProperty('size') ? collection.toJS() : {};
    const instance    = coll.instance || {};
    const details     = instance.details || {};
    return details.tuition_offers || [];
  }

  getTestimonials() {
    const { collection } = this.props;
    const coll  = collection.hasOwnProperty('size') ? collection.toJS() : {};
    const instance    = coll.instance || {};
    const details     = instance.details || {};
    // console.log('----------details============', details);
    return details.testimonials || [];
  }

  getUserDataFiles() {
    const { collection } = this.props;
    const coll  = collection.hasOwnProperty('size') ? collection.toJS() : {};
    const instance    = coll.instance || {};
    const details     = instance.details || {};
    return details.udata_files || [];
  }

  render() {

    const { globalAction, cover_image } = this.state;
    const { searchString, is_draft, collection,
      collection_id, userInfo, contentLoading, codeExecResourceFile } = this.props;
    const tuition_offers = this.getTuitionOffers();
    const testimonials = this.getTestimonials();
    const userDataFiles = this.getUserDataFiles();

    return (
      <div className="b-page b-page_dashboard">

        <Header/>

        <CollectionButtonsPanel disabled={contentLoading} customButtons={this.getCustomButtons()}/>

        <CollectionFeature  coverImage={cover_image.image}
          mode="write"
          saveTempData={this.onUpdateCoverImage}
        />

        <div className="container">
          <CollectionContentEdit  collection_id={collection_id}
            author_id={userInfo.user_id}
            collection={collection}
            mode="write"
            is_draft={is_draft}
            searchString={searchString}
            saveFormData={this.onSaveFormData}
            globalAction={globalAction}
            saveTitle={this.onSaveCategoryTitle}
            addArticle={this.onAddArticle}
            cloneArticle={this.onCloneArticle}
            addCategory={this.onAddCategory}
            togglePreview={this.onToggleArticlePreview}
            toggleIsLesson={this.onToggleIsLesson}
            removeCategory={this.onRemoveCategory}
            removeArticle={this.onRemoveArticle}
            resetGlobalAction={this.resetGlobalAction}
            moveItem={this.onMoveItem}
          >
            <StatusControl  ref={'statuscontrol'}
              waitingcontent={'Proceeding'}
              errorcontent={'Something went wrong.'}
              successcontent={'Success'}
              closeIcon
            />
          </CollectionContentEdit>
          <CollectionDataFiles
            mode="write"
            dataFiles={userDataFiles}
            collectionId={this.props.collection_id}
            updateImage={this.onUpdateDataFile}
            removeImage={this.onRemoveDataFile}
          />
          <CollectionCodeExecResourceFile
            mode="write"
            content={codeExecResourceFile}
            collectionId={this.props.collection_id}
            updateImage={this.onUpdateCodeExecResourceFile}
          />
          <CodeThemes
             onChangeThemes = {this.onChangeThemes}
             selectedCodeThemes = {this.props.CodeThemes}
          />
          <CollectionTuitionOffers
            tuition_offers={tuition_offers}
            onAddTuitionOffer={this.onAddTuitionOffer}
            onRemoveTuitionOffer={this.onRemoveTuitionOffer}
          />
          <div style={{ textAlign:'center', margin:30 }}>
            <Button bsStyle="danger"
              onClick={() => {
                if (window.confirm('Delete this course?')) {
                  deleteCollection(collection_id)
                    .then(() => this.props.dispatch(pushState(null, '/teach')))
                    .catch(this.onError);
                }
              }}
            >
              Delete Course
            </Button>
          </div>
        </div>

        <Footer theme="dashboard"/>
      </div>
    );
  }

}

/*
          <CollectionTestimonialsEdit
            testimonials={testimonials}
            onAddTestimonial={this.onAddTestimonial}
            onRemoveTestimonial={this.onRemoveTestimonial}
          />
*/

export default EditCollectionPage;
