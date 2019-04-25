import styles from './PageViewer.module.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import CompList from '../CompList/CompList';
import RecommendationWidget from '../../RecommendationWidget/RecommendationWidget';
import ArticlePageSummary from '../ArticlePageSummary/ArticlePageSummary';
import PrevNextButtonWidget from '../PrevNextButtonWidget/PrevNextButtonWidget';
import Helmet from 'react-helmet';
import { SomethingWithIcon, Icons } from '../../index';
import { showModal } from '../../../actions';
import { ModalTypes } from '../../../constants';


export default class PageViewer extends PureComponent {
  render() {
    const { pageId, authorId, collectionId, isDraft, comps, pageProperties,
     pageSummary, aggressiveComponentSave, children, author, isCollectionArticle,
     previousNextArticles, askForSignup, contentLoading, userId, pageProps, default_themes } = this.props;

    let pageTitle = pageSummary.get('title') ?
                    pageSummary.get('title') :
                    'Educative.io | Untitled';
    pageTitle += isDraft ? ' - Preview' : '';

    let pageContent = (
      <CompList renderMode="viewer"
        comps={comps}
        // Stub this or we get errors from some dirty components on their render
        updateContentState={ () => {} }
        pageProperties={ pageProperties }
        aggressiveComponentSave={ aggressiveComponentSave }
        authorId={ authorId }
        pageId={ pageId }
        collectionId={ collectionId }
        isDraft={ isDraft }
        default_themes={ default_themes }
      />
    );

    if (askForSignup && (userId === null || userId === undefined)) {
      pageContent = (
        <div className={styles.askForSignupText}>
          <SomethingWithIcon icon={Icons.lockIcon}/>
          <span className={styles.freeSignup}
            onClick={() => {
              this.props.dispatch(showModal(ModalTypes.SIGNUP, { ru: `/collection/page/${authorId}/${collectionId}/${pageId}` }));
            }}
          >
            Free Signup
          </span> required to view this lesson.
        </div>
      );
    }

    return (
      <div className="b-page__content no-padding">
        <div className="container">
          <Helmet
            title={pageTitle}
            meta={[{ property: 'og:title', content: pageTitle }]}
          />

          <ArticlePageSummary mode="view" pageSummary={pageSummary}
            pageProperties={pageProperties} author={author} isCollectionArticle={isCollectionArticle}
          />

          {pageContent}

          {!contentLoading && isCollectionArticle ? <PrevNextButtonWidget
            authorId={ authorId }
            pageId={ pageId }
            collectionId={ collectionId }
            isDraft={ isDraft }
            previousNextArticles={ previousNextArticles }
          /> : null}


          {!contentLoading && <div className={styles['recommendation-widget-container']}>
            {isDraft ? null : <RecommendationWidget
              authorId={authorId}
              collectionId={collectionId}
              pageId={pageId}
              userId={userId}
              recommendationCount = {pageProps ? pageProps.recommendations : null}
              recommended={pageProps ? pageProps.is_recommended_by_reader : null}
            />}
          </div>}

          {children}

        </div>
      </div>);
  }
}
