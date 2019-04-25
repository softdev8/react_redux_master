import styles from './CollectionContentView.module.scss';

import React, { Component, PropTypes } from 'react';

import { CollectionCategoryView } from '../../CollectionCategory';
import PreviewableArticles from '../../CollectionArticle/PreviewableArticles';
import CollectionPageSummary from '../../CollectionPageSummary/CollectionPageSummary.js';
import { Tabs, Tab, TabContent } from '../../../index';
import { SearchComponent } from '../../../../containers';
import misc from '../../CollectionArticle/misc';
import searchOverCategories from '../../searchutils/searchOverCategories';
import ReactPlayer from '../../../widgets/video/ReactPlayer';

import Helmet from 'react-helmet';
import pageTitles from '../../../../constants/pageTitles';

class CollectionContentView extends Component {

  static propTypes = {
    collection_id : PropTypes.string.isRequired,
    collection    : PropTypes.object.isRequired,
    searchString  : PropTypes.string.isRequired,
    is_draft      : PropTypes.bool.isRequired,
    author_id     : PropTypes.string.isRequired,
    authorName    : PropTypes.string,
    userInfo      : PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
  }

  getArticleLink(author_id, collection_id, article_id, is_draft) {
    return misc(author_id, collection_id, article_id, is_draft).viewUrl;
  }

  render() {
    const { collection_id, collection, userInfo } = this.props;

    const coll        = collection.hasOwnProperty('size') ? collection.toJS() : {};
    const instance    = coll.instance || {};
    const details     = instance.details || {};
    const toc         = details.toc || {};
    const categories  = toc.categories || [];
    const page_titles = details.page_titles || [];

    const { searchString, author_id, authorName, is_draft } = this.props;
    const mode = 'read';
    const owned_by_author = userInfo ? userInfo.user_id === author_id : false;
    const previewableArticles = [];
    let articleCount = 0;

    let showArticlePreviewLinks = false;
    if (!instance.owned_by_reader) {
      if (!is_draft && details.is_priced && (!owned_by_author)) {
        showArticlePreviewLinks = true;
      }
    }

    let contentToShow = false;
    if (categories.length > 0 || details.details) {
      contentToShow = true;
    }

    const catsNodes = categories.map((category, i) => {

      // collect articles with 'is_preview' == true
      category.pages.forEach((page) => {
        articleCount++;

        if (page.is_preview &&
            (page.is_lesson === undefined || page.is_lesson === true)) {

          if (page_titles[page.id]) {
            page.title = page_titles[page.id];
          }

          previewableArticles.push(page);
        }
      });

      const cat = (
        <CollectionCategoryView collection_id={collection_id}
          data={category}
          page_titles = {page_titles}
          index={i}
          mode={mode}
          is_draft={is_draft}
          author_id={author_id}
          type="category"
          key={i}
          isPreviewable={details.is_priced}
          showArticlePreviewLinks={showArticlePreviewLinks}
          searchString={searchString}
        />
      );

      if (searchString) {
        return searchOverCategories(category, cat, searchString, page_titles);
      }

      return cat;

    });

    const pageSummary = {
      title       : details.title,
      description : details.summary,
      tags        : details.tags,
    };

    const price = {
      price           : details.price,
      discounted_price: details.discounted_price,
      is_priced       : details.is_priced,
      owned_by_reader : instance.owned_by_reader,
    };

    let firstArticleLink;
    if (categories.length && categories[0].pages.length) {
      firstArticleLink = this.getArticleLink(author_id, collection_id, categories[0].pages[0].id, is_draft);
    }

    const freePreviewLessonCount = previewableArticles.length;
    const firstPreviewableArticleLink = previewableArticles.length > 0 ?
      this.getArticleLink(author_id, collection_id, previewableArticles[0].id, is_draft) : null;

    const author = { author_id, author_name : authorName };

    let helmetPageTitle = details.title ? details.title : pageTitles.UNTITLED;
    helmetPageTitle += is_draft ? pageTitles.PREVIEW : '';

    const showMentoringButton = (details.tuition_offers && details.tuition_offers.length > 0) ? true : false;

    return (
      <div className="b-page__content no-padding">

        <Helmet
          title={helmetPageTitle}
          meta={[{ property: 'og:title', content: helmetPageTitle }]}
        />

        <CollectionPageSummary collection_id={collection_id}
          firstArticleLink={firstArticleLink}
          firstPreviewableArticleLink={firstPreviewableArticleLink}
          pageSummary={pageSummary}
          author={author}
          price={price}
          userInfo={userInfo}
          is_draft={is_draft}
          recommendations={coll.recommendations}
          recommended={coll.is_recommended_by_reader}
          subscribed={coll.is_reader_subscribed}
          widgetStats={details.aggregated_widget_stats || null}
          lessonCount={articleCount}
          showMentoringButton={showMentoringButton}
          freePreviewLessonCount={freePreviewLessonCount}
        />

        { details.intro_video_url ?
          <div style={{ textAlign:'center', marginTop:40, marginBottom:40 }}>
            <ReactPlayer url={details.intro_video_url} />
          </div> : null}

        <div className={styles['tabs-wrapper']}>
          {contentToShow ? <Tabs activeByDefault={1}>
              <Tab title="Details" />
              <Tab title="Contents" />
            { details.is_priced && showArticlePreviewLinks && <Tab title="Preview Lessons" className={styles['show-on-small']}/> }

              <TabContent forTab={0}>
                { details.details &&
                  <div className={styles['details-expanded']} dangerouslySetInnerHTML={{ __html : details.details }}/>  }
              </TabContent>

              <TabContent forTab={1}>
                <div className={styles['search-wrapper']}>
                  <SearchComponent clean placeholder={`Search`}/>
                </div>
                <ul className={styles.categories}>{catsNodes}</ul>
              </TabContent>

            { (details.is_priced && showArticlePreviewLinks && previewableArticles.length > 0) &&
              <TabContent forTab={2} className={styles['show-on-small']}>
                <div className={styles.previewable}>
                  <PreviewableArticles articles={previewableArticles}
                    collection_id={collection_id}
                    author_id={author_id}
                    is_draft={is_draft}
                  />
                </div>
              </TabContent> }

          </Tabs> : null}

          {/* Will be shown on  > 768px devices  */}
          { (details.is_priced && showArticlePreviewLinks && previewableArticles.length > 0) &&
            <div className={`${styles['previewable-right']} ${styles['hide-on-small']}`}>

              <div className={styles.previewable__title}>Preview Lessons</div>

              <PreviewableArticles articles={previewableArticles}
                collection_id={collection_id}
                author_id={author_id}
                is_draft={is_draft}
              />
            </div> }

        </div>

      </div>
    );

  }
}

export default CollectionContentView;
