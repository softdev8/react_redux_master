import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import classnames from 'classnames';

import { Header, Footer, PageStatusControl } from '../../components';

// import EducativeUtil from '../../components/common/ed_util';
import { load as getAuthorPage } from '../../redux/modules/author/page';
import { load as getUserPage } from '../../redux/modules/page';
import { load as getAuthorProfile } from '../../redux/modules/author/profile';
import { load as getPagePreview } from '../../redux/modules/pagePreview';
import { load as getCollectionArticlePreview } from '../../redux/modules/collectionArticlePreview';


// import * as ConnectedPageEditor from "./EditArticlePage";
import PageViewer from '../../components/ArticlePagesContent/PageViewer/PageViewer';
import ArticlePagesFeature from '../../components/ArticlePagesContent/ArticlePagesFeature/ArticlePagesFeature';
import ArticleEditorButtonsPanel from '../../components/ArticlePagesContent/ArticleEditorButtonsPanel/ArticleEditorButtonsPanel';

import { getRootSubjectChildren } from '../../selectors';
import isDraftPage from '../../utils/isDraftPage';
import getImagePath from '../../utils/getImagePath';

@connect( mapStateToProps )
export default class ViewArticlePage extends Component{

  static PropTypes = {
    canToggleSidebar      : PropTypes.bool,
    hideHeader            : PropTypes.bool,
    hideFooter            : PropTypes.bool,
    hideStickyPanel       : PropTypes.bool,
    userInfo              : PropTypes.object.isRequired,

    // it will be passed from ViewCollectionArticlesPage
    fetchPageAction       : PropTypes.string,

    // it will be passed from ViewCollectionArticlesPage only for collection articles
    previousNextArticles  : PropTypes.object,
    askForSignup          : PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.isCollectionArticle = this.isCollectionArticle.bind(this);
  }

  componentDidMount() {
    this.fetchContent(this.props);

    if (!this.isCollectionArticle() && this.props.authorName == null){
      this.props.dispatch(getAuthorProfile(this.props.params.user_id));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.page_id !== this.props.params.page_id) {
      this.fetchContent(nextProps);
    }
  }

  isCollectionArticle(){
    return this.props.params.collection_id != null;
  }

  render() {
    const {cover_image_id, hideFooter, hideHeader, hideStickyPanel,
          location, contentLoading, authorName, canToggleSidebar = false, previousNextArticles, pageProps} = this.props;

    const { page_id, collection_id } = this.props.params;


    //TODO: Fix the varialble names in routes. It should be author_id
    const author_id = this.props.params.user_id;
    const user_id = this.props.userInfo ? this.props.userInfo.user_id : null;

    const isDraft = isDraftPage(location);

    const image = getImagePath(this.isCollectionArticle(), isDraft, author_id, page_id, cover_image_id, collection_id);

    const author = {
      author_id,
      author_name : authorName
    };

    const pageClassName = classnames(
      'b-page b-page_dashboard',
      {
        'toggle-sidebar'   : canToggleSidebar,
        'scroll-container' : canToggleSidebar,
      },
    );

    return (<div className={pageClassName}>
            <PageStatusControl loading={contentLoading} />

            { !hideHeader && <Header logoSize="small"/> }

            { isDraftPage(location) && !hideStickyPanel ? <ArticleEditorButtonsPanel customButtons={this.getCustomButtons()}/> : null }

            { cover_image_id && <ArticlePagesFeature  coverImage={`${image}.png`}
              mode="read"
            /> }

            <PageViewer
              {...this.props}
              userId={user_id}
              pageId={page_id}
              authorId={author_id}
              collectionId={collection_id}
              isDraft={isDraftPage(location)}
              author={author}
              isCollectionArticle={this.isCollectionArticle()}
              pageProps={pageProps}
            />

            { !hideFooter && <Footer theme="dashboard"/> }
           </div>);
  }

  getCustomButtons() {
    const { page_id, collection_id } = this.props.params;
    const editUrl = !collection_id ? `/pageeditor/${page_id}` : `/pageeditor/${collection_id}/${page_id}`;

    return [{
      type   : 'primary',
      text   : 'Edit',

      method : ()=> {
        if(this.props.route.path === 'demo/draft') {
          this.props.dispatch(pushState(null, '/demo'))
          return;
        }

        this.props.dispatch(pushState(null, editUrl))
      },

      icon   : 'pencilIcon',
    }];
  }

  fetchContent(props) {
    const { location, fetchPageAction } = props;

    const { user_id } = isDraftPage(location) ? props.userInfo : props.params;
    const { page_id, collection_id } = props.params;

    if (fetchPageAction) {
      if (isDraftPage(location)) {
        props.dispatch(fetchPageAction(collection_id, page_id));
      } else {
        props.dispatch(getCollectionArticlePreview(user_id, collection_id, page_id));
        props.dispatch(fetchPageAction(user_id, collection_id, page_id));
      }
      return;
    }

    if (isDraftPage(location)) {
      props.dispatch(getAuthorPage(page_id));
      return;
    } else {
      props.dispatch(getPagePreview(user_id, page_id));
      props.dispatch(getUserPage(user_id, page_id));
      return;
    }
  }
}

function mapStateToProps({
  router:{ location, params },
  author:{ page, collectionArticle, profile },
  page:userpage,
  userCollectionArticle,
  subjects,
  pageSummary,
  aggressiveComponentSave,
  pagePreview,
  collectionArticlePreview
}) {

  let source;
  // assuming that collection_id is undefined on single article view
  // but exists only on collection article view
  if (isDraftPage(location)) {
    source = !params.collection_id ? page : collectionArticle;
  } else {
    source = !params.collection_id ? userpage : userCollectionArticle;
  }

  const pageProps = !params.collection_id ? pagePreview : collectionArticlePreview;

  let authorName = null;
  // if its a collection article we dont need to get author name
  if (!params.collection_id) {
    if (location.query && location.query.authorName) {
      authorName = location.query.authorName;
    }
  }

  return {
    comps: getRootSubjectChildren(subjects),
    aggressiveComponentSave,
    pageSummary,
    pageProperties : source.loaded ? source.data.pageProperties : { pageAlign: 'center' },
    contentLoading  : source.loading,
    cover_image_id : source.loading === false && source.loaded === true ? source.data.cover_image_id : null,
    pageProps :  pageProps.loading === false && pageProps.loaded === true ? pageProps.data : {},
    authorName : !params.collection_id && authorName === null && profile.loading === false && profile.loaded === true ? profile.data.full_name: authorName
  };
}
