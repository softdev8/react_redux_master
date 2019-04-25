import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getCollection } from '../../actions';
import isDraftPage from '../../utils/isDraftPage';
import { load as getAuthorCollectionArticle } from '../../redux/modules/author/collectionArticle';
import { load as getUserCollectionArticle } from '../../redux/modules/userCollectionArticle';

import { ViewCollectionArticlesContent } from '../../components';
import { CollectionSidebar } from '../index';

function mapStateToProps({ author: { collection } }) {
  return { collection };
}

@connect(mapStateToProps)
class ViewCollectionArticlesPage extends Component {

  constructor(props) {
    super(props);

    this.toggleSidebar = this.toggleSidebar.bind(this);

    this.state = {
      showSidebar   : true,
      cover_image   : {},
      is_draft_page : isDraftPage(props.location),
      previousNextArticles: null,
      askForSignup    : false
    };
  }

  componentDidMount() {
    const params = this.props.params;

    params.is_draft_page = this.state.is_draft_page;

    this.props.dispatch(getCollection(params));

    this.openSidebarByDefault();
  }

  componentWillReceiveProps(nextProps) {
    const { user_id, page_id } = nextProps.params;
    const { collection, userInfo }  = nextProps;

    const previousNextArticles = this.findPreviousAndNext(collection, page_id, user_id, userInfo, this.state.is_draft_page);

    this.setState({
      previousNextArticles,
    });
  }

  getFetchPageAction() {

    if (isDraftPage(this.props.location)) {
      // author mode
      return getAuthorCollectionArticle;
    }

    // user mode
    return getUserCollectionArticle;
  }

  toggleSidebar() {
    this.setState({
      showSidebar : !this.state.showSidebar,
    });
  }

  openSidebarByDefault() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (width > 992) {
      this.setState({
        showSidebar: true,
      });
    }
  }

  findPreviousAndNext(collection, current_page_id, author_id, userInfo, is_draft) {
    if (!collection.size) return null;

    const instance    = collection.getIn(['instance']).toJS();
    const details     = instance.details || {};
    const toc         = details.toc || {};
    const page_titles = details.page_titles || [];
    const categories  = toc.categories || [];

    const owned_by_author = userInfo ? userInfo.user_id === author_id : false;

    let showArticlePreviewLinks = false;
    let collection_meta = null;
    if (!instance.owned_by_reader) {
      if (!is_draft && details.is_priced && (!owned_by_author)) {
        showArticlePreviewLinks = true;
        collection_meta = {
          is_priced: details.is_priced,
          price: details.price,
          discounted_price: details.discounted_price,
        };
      }
    }

    let pages = [];
    categories.map((category) => {
      pages = pages.concat(category.pages);
    });

    let current_page_index = -1;
    let previewPageCounter = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].is_preview &&
          (pages[i].is_lesson === undefined ||
           pages[i].is_lesson === true)) {
        previewPageCounter++;
      }

      if (pages[i].id == current_page_id) {
        current_page_index = i;
        break;
      }
    }

    if (current_page_index < 0) return null;

    // ask for signup for preview pages
    const PREVIEW_PAGES_TO_SHOW_WITHOUT_SIGNUP = 3;
    const is_current_page_previewable = pages[current_page_index].is_preview;
    const is_current_page_lesson = pages[current_page_index].is_lesson === undefined || pages[current_page_index].is_lesson === true;
    const is_page_owned = !showArticlePreviewLinks;
    const askForSignup = is_current_page_previewable &&
      !is_page_owned &&
      previewPageCounter > PREVIEW_PAGES_TO_SHOW_WITHOUT_SIGNUP &&
      is_current_page_lesson;
    this.setState({
      askForSignup
    });

    if (current_page_index === 0) {
      return {
        previous : null,
        next : pages.length > 1 ? { id : pages[current_page_index + 1].id, title : page_titles[pages[current_page_index + 1].id], showPreviewLink : showArticlePreviewLinks ? !pages[current_page_index + 1].is_preview : false } : null,
        collection_meta: collection_meta
      };
    } else if (current_page_index === pages.length - 1) {
      return {
        previous :  { id : pages[current_page_index - 1].id, title : page_titles[pages[current_page_index - 1].id], showPreviewLink : showArticlePreviewLinks ? !pages[current_page_index - 1].is_preview : false  },
        next : null,
        collection_meta: collection_meta
      };
    } else {
      return {
        previous :  { id : pages[current_page_index - 1].id, title : page_titles[pages[current_page_index - 1].id], showPreviewLink : showArticlePreviewLinks ? !pages[current_page_index - 1].is_preview : false  },
        next : { id : pages[current_page_index + 1].id, title : page_titles[pages[current_page_index + 1].id], showPreviewLink : showArticlePreviewLinks ? !pages[current_page_index + 1].is_preview : false  },
        collection_meta: collection_meta
      };
    }
  }

  render() {
    const { user_id, collection_id, page_id } = this.props.params;
    const { collection, userInfo, dispatch }  = this.props;
    const { showSidebar, is_draft_page } = this.state;
    const CodeThemes = {
      Code: this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'Code']),
      Markdown:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'Markdown']),
      RunJS:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'RunJS']),
      SPA:   this.props.collection.getIn(['instance', 'details', 'CodeThemes', 'SPA']),
    }

    const sidebarProps = {
      author_id     : user_id,
      is_draft      : is_draft_page,
      toggleSidebar : this.toggleSidebar,
      collection_id,
      collection,
      page_id,
      userInfo,
    };

    const child = React.cloneElement(
      this.props.children,
      {
        userInfo,
        hideHeader           : true,
        canToggleSidebar     : true,
        hideStickyPanel      : true,
        fetchPageAction      : this.getFetchPageAction(),
        previousNextArticles : this.state.previousNextArticles,
        default_themes       : CodeThemes,
        askForSignup         : this.state.askForSignup
      },
    );

    if (!collection.size) return null;

    const contentProps = {
      collapsed: showSidebar,
      toggleSidebar: this.toggleSidebar,
      collection_id,
      dispatch,
      page_id,
    };

    return (
      <div className="b-page b-page_dashboard b-page_sidebar">

        <CollectionSidebar show={showSidebar} {...sidebarProps}/>

        <ViewCollectionArticlesContent {...contentProps}>

          { child }

        </ViewCollectionArticlesContent>

      </div>
    );
  }

}

// function mapDispatchToProps() {
//   return { getCollection };
// }

ViewCollectionArticlesPage.propTypes = {
  children   : PropTypes.node.isRequired,
  collection : PropTypes.object.isRequired,
  dispatch   : PropTypes.func.isRequired,
  location   : PropTypes.object.isRequired,
  params     : PropTypes.object.isRequired,
  userInfo   : PropTypes.object,
};

export default ViewCollectionArticlesPage;
