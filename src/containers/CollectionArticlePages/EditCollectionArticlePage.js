import React from 'react'
import { connect } from 'react-redux';
import CryptoJS from 'crypto-js';
import update from 'react/lib/update';

import { getCollectionArticleImageUrl, getCollection } from '../../actions';

import {putCollectionArticle, pageEditor, components, pagePropertyChange, pageSummary, getCollectionDirectCall} from '../../actions';
import * as userInfo from "../../redux/modules/user/info";
import * as authorCollectionArticle from "../../redux/modules/author/collectionArticle";
import * as selectedWidget from "../../redux/modules/selectedWidget";
import {getComponentMeta} from "../../component_meta";
import sidebarDecorator from '../../decorators/sidebarDecorator';
import {getRootSubjectChildren} from '../../selectors';
import { Header, Footer,
        ArticleEditorButtonsPanel,
        ArticlePagesFeature,
        PageEditorContent, PageStatusControl } from '../../components';

import getImagePath from '../../utils/getImagePath';
import { promiseFunc } from '../../utils';

import Keybinding from 'react-keybinding';
import { Lifecycle } from 'react-router';
import { bindActionCreators } from 'redux';

const SecretKey = "649EBDA149E8F43DDD12DF353615C";

const ConnectedPageEditor = React.createClass({
  mixins: [Keybinding, Lifecycle],

  getInitialState() {
    return {
      scriptsLoaded     : false,
      scriptsLoadFailed : false,
      pendingAction     : null,
      popoverContent    : null,
      cover_image       : {},
    };
  },

  componentDidMount() {
    var collection_id = this.props.params.collection_id;
    var user_id = 0;
    var is_draft_page = true;

    this.props.dispatch(getCollection({ collection_id, user_id, is_draft_page}));

    this.props.getAuthorCollectionPage(
      this.props.params.collection_id,
      this.props.params.page_id);

    document.addEventListener('copy',   this.copyWidgetEvent.bind(this));
    document.addEventListener('paste',  this.pasteWidgetEvent.bind(this));
  },

  componentWillUnmount() {
    document.removeEventListener('copy',  this.copyWidgetEvent);
    document.removeEventListener('paste', this.pasteWidgetEvent);
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.cover_image_id != this.props.cover_image_id){
      const { collection_id, page_id } = this.props.params;
      let cover_image = {
        image      : nextProps.cover_image_id ? getImagePath(true, true, null, page_id, nextProps.cover_image_id, collection_id) : null,
        image_id   : nextProps.cover_image_id,
        metadata   : nextProps.cover_image_metadata,
        updated    : false,
      }

      this.setState({
        cover_image,
      });
    }
  },

  copyWidgetEvent(e) {
    if (window.getSelection().toString()) return;

    const selectedWIndex = this.props.comps.findIndex(item => this.props.selectedHash == item.get('hash'));
    const selectedWidget = this.props.comps.get(selectedWIndex)

    let widget = {
      index: 0,
      data: selectedWidget.toJS(),
      parentHash: '0'
    };
    widget.data.mode = 'view';

    //remove iteration from the duplicated payload
    if(widget.data.iteration || widget.data.iteration >= 0){
      delete widget.data.iteration;
    }
    //remove hash from the duplicated payload
    if(widget.data.hash || widget.data.hash >= 0){
      delete widget.data.hash;
    }

    const result = CryptoJS.AES.encrypt(JSON.stringify(widget), SecretKey);

    e.clipboardData.setData('text/plain', result);
    e.preventDefault();

    this.setPopoverContent('Copied');
  },

  pasteWidgetEvent(e) {
    try {
      const data = e.clipboardData.getData('text/plain');

      const decrypted = CryptoJS.AES.decrypt(data, SecretKey).toString(CryptoJS.enc.Utf8);

      const jsonResult = JSON.parse(decrypted);
      jsonResult.index = this.props.comps.findIndex(item => this.props.selectedHash == item.get('hash'));

      if (jsonResult.data.mode === 'view') this.props.addComponent(jsonResult)

      e.preventDefault();
    } catch(ex) {
      console.warning('No valid widget copied!');
    }
  },

  setPopoverContent(text) {
    this.setState({popoverContent: text})
    setTimeout(() => this.setState({popoverContent: false}), 3000)
  },

  discard() {
    if(window.confirm('Any unsaved changes will be lost. Are you sure?')) {
      this.props.getUserInfo();
      this.props.getAuthorCollectionPage(
        this.props.params.collection_id,
        this.props.params.page_id);
    }
  },

  getCustomButtons() {
    return [{
      type   : 'default',
      text   : 'Discard',
      method : this.discard,
    }, {
      type   : 'secondary',
      text   : 'Preview',

      method : ()=>this.props.prepareToRunPageEditorAction(
                            this.state.cover_image,
                            `/api/author/collection/${this.props.params.collection_id}/page/${this.props.params.page_id}/image`,
                            this.setPendingAction,
                            this.onUploadCompleteCoverImage,
                            this.props.previewCollectionArticle),

      icon   : 'playIcon',
    }, {
      className : 'b-btn_dark',
      text      : 'Save',

      method    : ()=>this.props.prepareToRunPageEditorAction(
                            this.state.cover_image,
                            `/api/author/collection/${this.props.params.collection_id}/page/${this.props.params.page_id}/image`,
                            this.setPendingAction,
                            this.onUploadCompleteCoverImage,
                            this.props.saveCollectionArticle),

      icon      : 'downloadIcon',
    }];
  },

  keybinding(event, action) {
    if(!this.props.contentLoading) {
      if(action == 'SAVE'){
       this.props.prepareToRunPageEditorAction(
                                  this.state.cover_image,
                                  `/api/author/collection/${this.props.params.collection_id}/page/${this.props.params.page_id}/image`,
                                  this.setPendingAction,
                                  this.onUploadCompleteCoverImage,
                                  this.props.saveCollectionArticle);
        event.preventDefault();
      } else if(action == 'PREVIEW') {
        this.props.prepareToRunPageEditorAction(
                                  this.state.cover_image,
                                  `/api/author/collection/${this.props.params.collection_id}/page/${this.props.params.page_id}/image`,
                                  this.setPendingAction,
                                  this.onUploadCompleteCoverImage,
                                  this.props.previewCollectionArticle);
        event.preventDefault();
      }
    }
  },

  keybindings: {
    '⌘S': 'SAVE',
    '⌘I': 'PREVIEW',
  },

  keybindingsPlatformAgnostic: true,
  keybindingsOnInputs: true,

  onUpdateCoverImage(newImage) {
    const { collection_id, page_id } = this.props.params;

    if(!newImage.cover_image) {
      let cover_image = {
        image      : newImage.cover_thumbnail,
        file       : newImage.cover_image,
        updated    : true,
      }

      this.setState({
        cover_image,
      });

      return;
    }

    promiseFunc(this.props.dispatch, getCollectionArticleImageUrl, [{page_id, collection_id }]).then( image => {

      image = JSON.parse(image);

      let cover_image = {
        image      : newImage.cover_thumbnail,
        file       : newImage.cover_image,
        image_id   : image.image_id,
        metadata   : newImage.metadata,
        upload_url : image.upload_url,
        updated    : true,
      }

      this.setState({
        cover_image,
      });

    });
  },

  onUploadCompleteCoverImage(cover_image){
    this.setState({
      cover_image,
    });
  },

  routerWillLeave(nextLocation) {
    //Skipping router Will Leave confirmation in debug environment as it causes issues with hot-reloading
    if(window.DEBUG){
      return true;
    }

    if(nextLocation && nextLocation.state && nextLocation.state.forceTransition){
      return true;
    }

    return 'Any unsaved changes will be lost! Are you sure you want to leave?';
  },

  setPendingAction(action) {
    this.setState({
      pendingAction:action,
    });
  },

  render() {
    const {page_id, collection_id} = this.props.params;
    const {cover_image} = this.state;
    const CodeThemes = {
      Code: this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'Code']),
      Markdown:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'Markdown']),
      RunJS:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'RunJS']),
      SPA:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'SPA']),
    }

    if (!this.props.loading) {
        return (
            <div className='b-page b-page_dashboard'>
              <PageStatusControl loading={this.props.contentLoading}/>

              <Header logoSize='small'/>

              <ArticleEditorButtonsPanel customButtons={this.getCustomButtons()}
                                         collection_id={collection_id}
                                         showBack/>

              <ArticlePagesFeature coverImage={cover_image.image}
                                   saveTempData={this.onUpdateCoverImage}
                                   mode='write'/>

              <PageEditorContent ref="page_editor"
                                 {...this.state}
                                 {...this.props}
                                 onScriptsLoaded={() => this.setState({scriptsLoaded: true})}
                                 onScriptsLoadError={() => this.setState({scriptsLoadedFailed: true})}
                                 runPendingAction={() => {
                                     if (this.state.pendingAction) {
                                         this.props.runAnyAction(this.state.pendingAction);
                                         this.setState({pendingAction: null})
                                     }
                                 }}
                                 default_themes={CodeThemes}
                                 isDraft={true}
                                 pageId={page_id}
                                 collectionId={collection_id}
                                 isCollectionArticle={true}/>
              <Footer theme='dashboard'/>
            </div>
        );
    } else {
      return (
          <div className='b-page b-page_dashboard'>
            <PageStatusControl loading={this.props.contentLoading}/>

            <Header logoSize='small'/>

            <ArticleEditorButtonsPanel customButtons={this.getCustomButtons()}
                                       collection_id={collection_id}
                                       showBack/>

            <ArticlePagesFeature coverImage={cover_image.image}
                                 saveTempData={this.onUpdateCoverImage}
                                 mode='write'/>


            <Footer theme='dashboard'/>
          </div>
      );
    }


  },
});

export default connect(
  ({user:{info}, author:{collectionArticle},author:{collection},loader, subjects, pageSummary, selectedWidget, aggressiveComponentSave})=>
  {
    return {
      loading: loader.isLoading,
      userInfo: info,
      collection: collection,
      userId: info ? info.user_id : 0,
      selectedHash:selectedWidget.get('selectedHash'),
      comps: getRootSubjectChildren(subjects),
      aggressiveComponentSave,
      pageSummary,
      pageProperties: collectionArticle.loading == false && collectionArticle.loaded == true ? collectionArticle.data.pageProperties : { pageAlign: 'center' },
      contentLoading: collectionArticle.loading,
      cover_image_id: collectionArticle.loading == false && collectionArticle.loaded == true ? collectionArticle.data.cover_image_id : null,
      cover_image_metadata: collectionArticle.loading == false && collectionArticle.loaded == true ? collectionArticle.data.cover_image_metadata : null,
    }
  },
  dispatch => ({
    ...bindActionCreators({
      getUserInfo: userInfo.load,
      getAuthorCollectionPage: authorCollectionArticle.load,
      ...pageEditor,
      ...pageSummary,
      ...components,
      ...selectedWidget,
      pagePropertyChange,
    }, dispatch),

    dispatch,
  })
)(ConnectedPageEditor);

// TODO
// appendTextComponentAtEnd={this.props.appendTextComponentAtEnd}
