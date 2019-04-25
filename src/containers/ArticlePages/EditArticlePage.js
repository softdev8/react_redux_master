import React from 'react'
import { connect } from 'react-redux';
import update from 'react/lib/update';
import Keybinding from 'react-keybinding';
import { Lifecycle } from 'react-router';
import { bindActionCreators } from 'redux'
import CryptoJS from 'crypto-js';

import { publish, putPage, pageEditor, components, pagePropertyChange,
         pageSummary, getArticleImageUrl } from '../../actions';

import * as userInfo from "../../redux/modules/user/info";
import * as authorPage from "../../redux/modules/author/page";
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

const SecretKey = "649EBDA149E8F43DDD12DF353615C";

const ConnectedPageEditor = React.createClass({
  childContextTypes: {
    isDemo: React.PropTypes.bool.isRequired,
  },

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

  getChildContext() {
    return { isDemo: this.props.isDemo };
  },

  componentDidMount() {
    this.props.getAuthorPage(this.props.params.page_id);

    document.addEventListener('copy',   this.copyWidgetEvent.bind(this));
    document.addEventListener('paste',  this.pasteWidgetEvent.bind(this));
  },

  componentWillUnmount() {
    document.removeEventListener('copy',  this.copyWidgetEvent);
    document.removeEventListener('paste', this.pasteWidgetEvent);
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.cover_image_id != this.props.cover_image_id){
      const { page_id } = this.props.params;
      const { cover_image_id, cover_image_metadata } = nextProps;

      let cover_image = {
        image      : cover_image_id ? getImagePath(false, true, null, page_id, cover_image_id) : null,
        image_id   : cover_image_id,
        metadata   : cover_image_metadata,
        updated    : false,
      };

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
    const tagName = e.target.tagName.toLowerCase()
    if (tagName == 'textarea') return;

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
      this.props.getAuthorPage(this.props.params.page_id);
    }
  },

  getCustomButtons() {
   let buttons = [{
     type   : 'secondary',
     text   : 'Preview',

     method : ()=>{
       this.props.prepareToRunPageEditorAction(
                           this.state.cover_image,
                           `/api/author/page/${this.props.params.page_id}/image`,
                           this.setPendingAction,
                           this.onUploadCompleteCoverImage,
                           this.props.preview )
     },

     icon   : 'playIcon',
   }, {
     className : 'b-btn_dark',
     text      : 'Save',

     method    : ()=>this.props.prepareToRunPageEditorAction(
                           this.state.cover_image,
                           `/api/author/page/${this.props.params.page_id}/image`,
                           this.setPendingAction,
                           this.onUploadCompleteCoverImage,
                           this.props.saveAll ),

     icon      : 'downloadIcon',
   }]

   if(this.props.location.pathname.indexOf('/demo') !== 0) {
       buttons = [{
         type   : 'default',
         text   : 'Discard',
         method : this.discard,
       }, ...buttons, {
         type   : 'primary',
         text   : 'Publish',

         method : ()=>this.props.prepareToRunPageEditorAction(
                               this.state.cover_image,
                               `/api/author/page/${this.props.params.page_id}/image`,
                               this.setPendingAction,
                               this.onUploadCompleteCoverImage,
                               this.props.publish ),

         icon   : 'uploadIcon',
       }]
   }

   return buttons;
 },

  keybinding(event, action) {
    if(!this.props.contentLoading){
      if(action == 'SAVE'){
       this.props.prepareToRunPageEditorAction(
                                  this.state.cover_image,
                                  `/api/author/page/${this.props.params.page_id}/image`,
                                  this.setPendingAction,
                                  this.onUploadCompleteCoverImage,
                                  this.props.saveAll);
        event.preventDefault();
      } else if(action == 'PREVIEW') {
        this.props.prepareToRunPageEditorAction(
                                  this.state.cover_image,
                                  `/api/author/page/${this.props.params.page_id}/image`,
                                  this.setPendingAction,
                                  this.onUploadCompleteCoverImage,
                                  this.props.preview);
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
    const { page_id } = this.props.params;

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

    promiseFunc(this.props.dispatch, getArticleImageUrl, [page_id])
    .then(image => {
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
    this.setState({ cover_image });
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
      pendingAction: action,
    });
  },

  render() {
    const page_id       = this.props.params.page_id;
    const {cover_image} = this.state;

    return (
      <div className='b-page b-page_dashboard'>
        <PageStatusControl loading={this.props.contentLoading}/>
        <Header logoSize='small'/>
        <ArticleEditorButtonsPanel
            disabled={this.props.contentLoading}
            customButtons={this.getCustomButtons()}
            isDemo={this.props.isDemo}
            showBack/>
        <ArticlePagesFeature coverImage={cover_image.image}
                             isDemo={this.props.isDemo}
                             saveTempData={this.onUpdateCoverImage}
                             mode='write'/>
        <PageEditorContent  ref="page_editor"
                            {...this.state}
                            {...this.props}
                            onScriptsLoaded={()=>this.setState({scriptsLoaded:true})}
                            onScriptsLoadError={()=>this.setState({scriptsLoadedFailed:true})}
                            runPendingAction={()=>{
                              if(this.state.pendingAction){
                                // console.log('started running PDA');
                                // console.log(this.state.pendingAction);
                                this.props.runAnyAction(this.state.pendingAction);
                                // console.log('finished running PDA')
                                this.setState({pendingAction:null})
                              }
                            }}
                            isDraft={true}
                            pageId={page_id}
                          />
        <Footer theme='dashboard'/>
      </div>
    );
  },
});

export default connect(
  ({
    user: {info},
    author: {page},
    subjects,
    pageSummary,
    selectedWidget,
    aggressiveComponentSave,
    ajaxMode: {enabled}
  })=>
  {
    return {
      isDemo: !enabled,
      userInfo: info,
      userId: info ? info.user_id : 0,
      selectedHash: selectedWidget.get('selectedHash'),
      comps: getRootSubjectChildren(subjects),
      aggressiveComponentSave,
      pageSummary,
      pageProperties: (!page.loading && page.loaded) ? page.data.pageProperties : { pageAlign: 'center' },
      contentLoading: page.loading,
      cover_image_id: (!page.loading && page.loaded) ? page.data.cover_image_id : null,
      cover_image_metadata: (!page.loading && page.loaded) ? page.data.cover_image_metadata : null,
    }
  },
  dispatch => ({
    ...bindActionCreators({
      getUserInfo: userInfo.load,
      getAuthorPage: authorPage.load,
      ...pageEditor,
      ...pageSummary,
      ...components,
      ...selectedWidget,
      pagePropertyChange,
    }, dispatch),

    dispatch,
  })
)(ConnectedPageEditor);