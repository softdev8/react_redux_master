import styles from './CollectionCategoryView.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import searchOverArticles from '../../searchutils/searchOverArticles';

import getArticleMisc from '../../CollectionArticle/misc';

class CollectionCategoryView extends Component {

  static propTypes = {
    collection_id : PropTypes.string.isRequired,
    data          : PropTypes.object.isRequired,
    page_titles   : PropTypes.object.isRequired,
    author_id     : PropTypes.string.isRequired,
    index         : PropTypes.number.isRequired,
    mode          : PropTypes.string.isRequired,
    is_draft      : PropTypes.bool.isRequired,
    searchString  : PropTypes.string.isRequired,
    isPreviewable : PropTypes.bool.isRequired,
    showArticlePreviewLinks : PropTypes.bool.isRequired,
  };

  renderPages() {

    const { collection_id, data, page_titles, searchString,
            is_draft, author_id, showArticlePreviewLinks = false } = this.props;

    const pages = data.pages.map((page, i) => {
      const viewUrl       = getArticleMisc(author_id, collection_id, page.id, is_draft).viewUrl;
      const article_title = page_titles[page.id];

      if (searchString && !searchOverArticles(searchString, page, article_title)) {
        return null;
      }

      if (showArticlePreviewLinks && !page.is_preview) {
        return (
          <li key={i}>
            <Link className={`${styles.article} ${styles.disabled}`} to={`${viewUrl}/preview`}>{ article_title || page.title } </Link>
          </li>
        );
      }

      return (
        <li key={i}>
          <Link className={styles.article} to={viewUrl}>
            { article_title || page.title }
            { page.is_preview && (page.is_lesson === undefined || page.is_lesson === true) ?
              <span className={styles.badge}>
                Preview
              </span> : null
            }
          </Link>
        </li>
      );
    });

    return pages.length ? <ul className={styles.articles}>{ pages }</ul> : null;
  }


  renderHeader() {

    const { data } = this.props;
    const title    = data.title !== '__default' ? data.title : '';

    return <h3 className={styles.title} key="title">{ title }</h3>;
  }

  render() {

    if (!this.props.data.pages.length && this.props.data.title === '__default') {
      return null;
    }

    return (
      <li className={styles.category}>

        { this.renderHeader() }

        { this.renderPages() }

       </li>
    );

  }
}

export default CollectionCategoryView;
