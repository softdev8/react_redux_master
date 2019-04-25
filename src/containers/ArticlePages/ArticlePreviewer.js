import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';
import classnames from 'classnames';

import {Header, Footer, PageStatusControl} from '../../components';
import {getPage, pageViewer} from '../../actions';
import getImagePath from '../../utils/getImagePath';
import {load as getPagePreview} from "../../redux/modules/pagePreview";
import {load as getCollectionArticlePreview} from "../../redux/modules/collectionArticlePreview";

import PagePreviewer from '../../components/ArticlePagesContent/PagePreviewer/PagePreviewer';
import ArticlePagesFeature from '../../components/ArticlePagesContent/ArticlePagesFeature/ArticlePagesFeature';

@connect( mapStateToProps )
export default class ArticlePreviewer extends Component{
  
  static PropTypes = {
    canToggleSidebar : PropTypes.bool,
    hideHeader       : PropTypes.bool,
    hideFooter       : PropTypes.bool,
    userInfo         : PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.isCollectionArticle = this.isCollectionArticle.bind(this);
    this.fetchContent = this.fetchContent.bind(this);
  }


  isCollectionArticle(){
    return this.props.params.collection_id != null;
  }

  componentDidMount() {
    this.fetchContent(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.page_id !== this.props.params.page_id) {
      this.fetchContent(nextProps);
    }
  }

  render() {

    const { cover_image_id, hideFooter, hideHeader, location, contentLoading, canToggleSidebar = false, previousNextArticles, userInfo } = this.props;
    const { page_id, collection_id } = this.props.params;

    let author_id = this.props.params.user_id;
    let user_id = userInfo ? userInfo.user_id : null;

    const image = getImagePath(this.isCollectionArticle(), false, author_id, page_id, cover_image_id, collection_id);
    
    const pageClassName = classnames('b-page b-page_dashboard', {
      'toggle-sidebar'   : canToggleSidebar,
      'scroll-container' : canToggleSidebar
    });

    return <div className={pageClassName}>
            <PageStatusControl loading={contentLoading} />

            { !hideHeader && <Header logoSize='small'/> }

            { !this.isCollectionArticle() && cover_image_id && <ArticlePagesFeature  coverImage={image}
                                                      mode='read'/> }
            
            <PagePreviewer {...this.props} pageId={page_id} authorId={author_id}
               collectionId={collection_id} isCollectionArticle={this.isCollectionArticle()} userId={user_id} />

            { !hideFooter && <Footer theme='dashboard'/> }
            
           </div>;
  }


  fetchContent(props) {
    const { user_id } = props.params;
    const { page_id } = props.params;
    const { collection_id} = props.params;

    if(this.isCollectionArticle()){
      props.dispatch(getCollectionArticlePreview(user_id, collection_id, page_id));
    }
    else{
      props.dispatch(getPagePreview(user_id, page_id));
    }
  }
};

function mapStateToProps({router:{location, params}, pagePreview, collectionArticlePreview}) {

  let source = !params.collection_id ? pagePreview : collectionArticlePreview;

  //TBD: get page summary object
  return {
    contentLoading  : source.loading,
    cover_image_id : source.loading == false && source.loaded == true ? source.data.cover_image_id : null,
    data :  source.loading == false && source.loaded == true ? source.data : Immutable.fromJS({}),
  };
}

