import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import * as authorWork from '../../redux/modules/author/work';
import * as readerFeatured from '../../redux/modules/reader/featured';

import {PageStatusControl} from '../../components';

export default function(isAuthor = false) {

  function mapStateToProps( {author: {work}, reader: {featured}, user: {info}} ) {
    let articles = [];
    let contentLoading;

    if(isAuthor &&  work.loading == false && work.loaded)      articles = work.data.work_summaries;
    if(!isAuthor &&  featured.loading == false && featured.loaded) articles = featured.data.summaries;

    if(isAuthor){
      contentLoading = work.loading;
    } else {
      contentLoading = featured.loading;
    }

    return { articles, userInfo : info.data, contentLoading }

  };

  return function(Page) {

    @connect( mapStateToProps )
    class DashboardPage extends Component {

      componentDidMount() {
        const getSummaries = isAuthor ? authorWork.load : readerFeatured.load

        this.props.dispatch(getSummaries());
      }

      shouldComponentUpdate(nextProps) {
        if(!nextProps.articles.length && this.props.contentLoading == nextProps.contentLoading) return false;
        
        return true;
      }

      render() {
        const {articles, dispatch, userInfo, contentLoading} = this.props;

        return <Page articles={articles} dispatch={dispatch} userInfo={userInfo} loading={contentLoading}>
                <PageStatusControl loading = {contentLoading}/>
              </Page>;
      }

    }

    return DashboardPage;

  }

}