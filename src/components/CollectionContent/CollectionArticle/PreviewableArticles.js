import styles from './PreviewableArticles.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import misc from './misc';

class PreviewableArticles extends Component {

  render() {

    const { articles = [], author_id, collection_id, is_draft } = this.props;


    if (!articles.length) return null;


    const articlesItems = articles.map((article, i) => {
      const urls = misc(author_id, collection_id, article.id, is_draft);

      return (
        <li key={i}>
          <Link to={urls.viewUrl} className={styles.article}>{article.title}</Link>
        </li>
      );
    });

    return (
      <ul className={styles.previewable}>
        {articlesItems}
      </ul>
    );
  }
}

PreviewableArticles.propTypes = {
  articles      : PropTypes.array.isRequired,
  collection_id : PropTypes.string.isRequired,
  is_draft      : PropTypes.bool.isRequired,
  author_id     : PropTypes.string.isRequired,
};

export default PreviewableArticles;
