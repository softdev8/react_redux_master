import styles from './PagePreviewer.module.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import Immutable from 'immutable';
import { Link } from 'react-router';

import RecommendationWidget from '../../RecommendationWidget/RecommendationWidget';
import SocialPanel from '../../SocialPanel';
import ArticlePageSummary from '../ArticlePageSummary/ArticlePageSummary';
import PrevNextButtonWidget from '../PrevNextButtonWidget/PrevNextButtonWidget';
import ArticleSummaryFooter from '../../Articles/ArticleSummary/ArticleSummaryFooter';
import {SomethingWithIcon, Icons} from '../../index';
import {serverUrl} from '../../../config-old';
import Helmet from 'react-helmet';

import { showModal } from '../../../actions';
import { ModalTypes } from '../../../constants';

export default class PagePreviewer extends PureComponent {
  render() {
    const { pageId, authorId, data, children, contentLoading, isCollectionArticle, collectionId, previousNextArticles, userId } = this.props;

    const pageSummary = Immutable.fromJS({
      title: data.title,
      tags: data.tags,
      description: data.summary,
    });

    const articleFooterData = {
      title       : data.title,
      is_priced   : data.is_priced,
      price       : data.price,
      discounted_price : data.discounted_price,
      read_time   : data.read_time,
      url         : `${serverUrl}/page/${authorId}/${pageId}`,
      id          : pageId,
      doc_type    : 'page',
      author_id   : authorId,
    };

    const author = {
      author_id : data.author_id,
      author_name : data.author_name,
    };

    let pageTitle = pageSummary.get('title') ?
                    pageSummary.get('title') :
                    'Educative.io | Untitled';

    const meta = previousNextArticles.collection_meta;
    const isPricedZero = meta && meta.is_priced &&
        (meta.price === 0.0 || meta.discounted_price === 0.0);

    const buyMessage = isPricedZero ?
                       ' to buy this course for FREE.' :
                       ' to buy this course.';

    let actionMsg = <span>This lesson is not available in preview.&nbsp;<Link to={`/collection/${authorId}/${collectionId}`} className={styles.active}>
                    {`Click here${buyMessage}`}</Link></span>;

    if ((userId === null || userId === undefined) && isPricedZero) {
      actionMsg = <span>
                    <span className={styles.login}
                      onClick={() => {
                        this.props.dispatch(showModal(ModalTypes.LOGIN, { ru: `/collection/${authorId}/${collectionId}` }));
                      }}
                    >
                      Login
                    </span>{buyMessage}
                  </span>;
    }

    return (
      <div className='b-page__content no-padding'>
        {!contentLoading ?  <div className='container'>
          <Helmet
            title={pageTitle}
            meta={[{property: 'og:title', content: pageTitle}]}
          />


          <ArticlePageSummary mode='view' pageSummary={pageSummary} author={author} isCollectionArticle={isCollectionArticle}/>

          {isCollectionArticle ?
            <div>
              <div className={styles.preview_text}>
                <SomethingWithIcon icon={Icons.lockIcon}/>
                {actionMsg}
              </div>
              <PrevNextButtonWidget
                authorId={ authorId }
                pageId={ pageId }
                collectionId={ collectionId }
                isDraft={ false }
                previousNextArticles={ previousNextArticles }
              />
            </div> :
            <ArticleSummaryFooter mode="read" data={articleFooterData} hidePreviewLink={true} />
          }

          <div className={styles['recommendation-widget-container']}>
            <RecommendationWidget authorId={authorId} collectionId={collectionId} pageId={pageId} userId={userId} />
          </div>

          {false ? <SocialPanel /> : null}

          {children}

        </div> : null}
      </div>);
  }
}