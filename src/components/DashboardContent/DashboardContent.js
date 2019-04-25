import styles from './DashboardContent.module.scss';

import React, { Component, PropTypes } from 'react';

import { ArticleSummary } from '../index';

export default class DashboardContent extends Component {

  static PropTypes = {
    articles : PropTypes.array.isRequired,
    mode     : PropTypes.string.isRequired,
    userInfo : PropTypes.object.isRequired,
  };

  renderArticles() {
    const { articles = [], mode, userInfo = {} } = this.props;

    return articles.map( (article, i) => {

      return  (<li className={styles['articles-list-item']} key={i}>
                <ArticleSummary data={article} mode={mode} userInfo={userInfo}/>
              </li>);
    });
  }

  render() {
    return  <ul className={styles['articles-list']}>{ this.renderArticles() }</ul>;
  }
}
