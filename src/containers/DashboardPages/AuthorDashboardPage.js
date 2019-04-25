import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import styles from './AuthorDashboardPage.module.scss';

import { DashboardContentHeaderControls,
         DashboardContentHeaderFilter,
         DashboardContent,
         PageStatusControl,
         StickyPanel,
         Header,
         Footer } from '../../components';

import { createCollection, authorCreatePage } from '../../actions';

import commonDashboardDecorator from './CommonDashboardDecorator';

import Helmet from 'react-helmet';
import { WRITER_VIEW } from '../../constants/pageTitles';

@commonDashboardDecorator(true)
@connect(state => {
  return {
    searchString : state.search.searchString
  };
})
class AuthorDashboardPage extends Component {

  constructor(props) {
    super(props);

    this.onCreateArticle    = this.onCreateArticle.bind(this);
    this.onCreateCollection = this.onCreateCollection.bind(this);
    this.onFilterArticles     = this.onFilterArticles.bind(this);

    this.state = {
      filterValue  : null,
    };
  }

  onCreateCollection() {
    createCollection().then(data => {
      const { collection_id } = JSON.parse(data);

      this.props.dispatch(pushState(null, `/collectioneditor/${collection_id}`));
    });
  }

  onCreateArticle() {

    authorCreatePage().then(data => {
      const { page_id } = JSON.parse(data);

      this.props.dispatch(pushState(null, `/pageeditor/${page_id}`));
    });
  }

  onFilterArticles(e) {
    const filterValue = e.target.value;

    this.setState({ filterValue });
  }

  searchArticles(searchString, articles) {

    const searchedArticles = articles.filter((article) => {
      if (!searchString) return true;

      if (article.title !== null && article.title.toLowerCase().indexOf(searchString) > -1) {
        return true;
      }

      if (article.summary !== null && article.summary.toLowerCase().indexOf(searchString) > -1) {
        return true;
      }

      return false;
    });

    return searchedArticles;
  }

  filterArticles(filterValue, articles) {
    switch (filterValue) {
      case 'drafts' : return articles.filter(article => {
        return !article.is_published;
      });
      case 'published' : return articles.filter(article => {
        return article.is_published;
      });
      case 'paid' : return articles.filter(article => {
        return article.is_priced;
      });
      case 'free' : return articles.filter(article => {
        return !article.is_priced;
      });
      default : return articles;
    }
  }

  renderPageStatusControl() {
    const { children } = this.props;

    if (React.Children.count(children) === 1 && children.type === PageStatusControl) return children;

    return null;
  }

  render() {

    const { filterValue } = this.state;
    const { userInfo, searchString } = this.props;
    let { articles } = this.props;

    articles = this.searchArticles(searchString, articles);
    articles = this.filterArticles(filterValue, articles);

    const pageStatusChild = this.renderPageStatusControl();

    return (
      <div className="b-page b-page_dashboard">
        <Helmet
          title={WRITER_VIEW}
          meta={[{property: 'og:title', content: WRITER_VIEW}]}
        />

        { pageStatusChild }

        <Header/>

        <StickyPanel>
          <DashboardContentHeaderControls mode="author" createArticle={this.onCreateArticle}
                                          createCollection={this.onCreateCollection}/>
        </StickyPanel>

        <div className={styles.contentFilter}>
          <DashboardContentHeaderFilter types={['all', 'drafts', 'published', 'paid', 'free']}
                                        filterArticles={this.onFilterArticles}/>
        </div>

        <div className="container">
          <div className="b-page__content">
            <DashboardContent articles={articles} userInfo={userInfo} mode="write"/>
          </div>
        </div>

        <Footer theme="dashboard"/>

      </div>
    );

  }
}

AuthorDashboardPage.propTypes = {
  dispatch     : PropTypes.func,
  articles     : PropTypes.array,
  userInfo     : PropTypes.object,
  searchString : PropTypes.string,
  children     : PropTypes.node,
};

export default AuthorDashboardPage;
