import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import styles from './ReaderDashboardPage.module.scss';

import {DashboardContent,
        PageStatusControl,
        DashboardContentHeaderControls,
        DashboardContentHeaderFilter,
        Header,
        Footer} from '../../components';

import commonDashboardDecorator from './CommonDashboardDecorator';

import Helmet from 'react-helmet';
import { READER_VIEW } from '../../constants/pageTitles';

const FILTER_MY_COURSES = 'My Courses';
const FILTER_ALL = 'All';

@commonDashboardDecorator(false)
@connect(state => {
  return {
    searchString : state.search.searchString
  };
})
export default class ReaderDashboardPage extends Component {

  static PropTypes = {
    articles : PropTypes.array.isRequired,
    userInfo : PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filterValue: null,
    };
  }

  onFilterArticles = (e) => {
    const filterValue = e.target.value;
    this.setState({ filterValue });
  }

  filterArticles(filterValue, articles) {
    switch (filterValue) {
      case FILTER_MY_COURSES:
        return articles.filter(article => {
          return article.owned_by_reader;
        });

      default : return articles;
    }
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

  render() {

    let { articles, userInfo } = this.props;

    articles = this.searchArticles(this.props.searchString, articles);
    articles = this.filterArticles(this.state.filterValue, articles);

    const pageStatusChild = this.renderPageStatusControl();

    return <div className='b-page b-page_dashboard'>
            <Helmet
              title={READER_VIEW}
              meta={[{property: 'og:title', content: READER_VIEW}]}
            />

            { pageStatusChild }

            <Header/>

            <DashboardContentHeaderControls mode="reader"/>

            <div className={styles.contentFilter}>
              <DashboardContentHeaderFilter types={[FILTER_ALL, FILTER_MY_COURSES]}
                                        filterArticles={this.onFilterArticles}/>
            </div>

            <div className='container'>
              <div className='b-page__content'>
                <DashboardContent articles={articles} userInfo={userInfo} mode='read'/>
              </div>
            </div>

            <Footer theme='dashboard'/>

          </div>;

  }

  renderPageStatusControl() {
    const {children} = this.props;

    if(React.Children.count(children) == 1 && children.type == PageStatusControl) return children;
    else return null;
  }

}