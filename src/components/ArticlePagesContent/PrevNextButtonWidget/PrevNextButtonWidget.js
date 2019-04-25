import styles from './PrevNextButtonWidget.module.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import { Link } from 'react-router';

import { Btn } from '../../index';
import misc from '../../CollectionContent/CollectionArticle/misc';

export default class PrevNextButtonWidget extends PureComponent {
  render() {
    const { authorId, collectionId, isDraft, previousNextArticles } = this.props;

    if (!previousNextArticles) return <div></div>;

    let previousLink = null;
    let previousTitle = null;
    let nextLink = null;
    let nextTitle = null;
    if (previousNextArticles.previous) {
      previousLink = previousNextArticles.previous.showPreviewLink ?
        `${misc(authorId, collectionId, previousNextArticles.previous.id, isDraft).viewUrl}/preview` :
        misc(authorId, collectionId, previousNextArticles.previous.id, isDraft).viewUrl;
      previousTitle = previousNextArticles.previous.title;
      previousTitle = !previousTitle || previousTitle.length <= 60 ? previousTitle : `${previousTitle.substring(0, 56)}...`;
    }

    if (previousNextArticles.next) {
      nextLink = previousNextArticles.next.showPreviewLink ?
        `${misc(authorId, collectionId, previousNextArticles.next.id, isDraft).viewUrl}/preview` :
        misc(authorId, collectionId, previousNextArticles.next.id, isDraft).viewUrl;
      nextTitle = previousNextArticles.next.title;
      nextTitle = !nextTitle || nextTitle.length <= 40 ? nextTitle : `${nextTitle.substring(0, 36)}...`;
    }

    return (
      <div className={styles.pagination}>
        {
          previousLink ?
            <Link className={styles.paginationPrevious} to={previousLink}>
                <em>← Previous</em>
                <span style={{ fontWeight:"300" }}>{previousTitle}</span>
            </Link>  :
            null
        }
        {
          nextLink ?
            <Link className={styles.paginationNext} to={nextLink}>
                <em>Next →</em>
                <span style={{ fontWeight:"300" }}>{nextTitle}</span>
            </Link>  :
            null
        }
      </div>
    );
  }
}
