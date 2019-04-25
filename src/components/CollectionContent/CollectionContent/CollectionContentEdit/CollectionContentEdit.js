import styles from './CollectionContentEdit.module.scss';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import CollectionCommonInfo from '../../CollectionCommonInfo/CollectionCommonInfo';
import CollectionForm from '../../CollectionForm/CollectionForm';
import CollectionSearch from '../../CollectionSearch/CollectionSearch';
import { CollectionCategoryEdit } from '../../CollectionCategory';
import { Btn } from '../../../';

import searchOverCategories from '../../searchutils/searchOverCategories';

import Helmet from 'react-helmet';
import pageTitles from '../../../../constants/pageTitles';

@DragDropContext(HTML5Backend)
class CollectionContentEdit extends Component {

  static propTypes = {
    collection_id     : PropTypes.string.isRequired,
    collection        : PropTypes.object.isRequired,
    searchString      : PropTypes.string.isRequired,
    mode              : PropTypes.string.isRequired,
    is_draft          : PropTypes.bool.isRequired,
    author_id         : PropTypes.number,
    resetGlobalAction : PropTypes.func.isRequired,
    moveItem          : PropTypes.func.isRequired,
    children          : PropTypes.node,
    globalAction      : PropTypes.string,
    saveFormData      : PropTypes.func,
    saveTitle         : PropTypes.func,
    addCategory       : PropTypes.func,
    addArticle        : PropTypes.func,
    cloneArticle      : PropTypes.func,
    togglePreview     : PropTypes.func,
    toggleIsLesson    : PropTypes.func,
    removeCategory    : PropTypes.func,
    removeArticle     : PropTypes.func,
  };

  render() {
    const { collection_id, collection } = this.props;

    const coll  = collection.hasOwnProperty('size') ? collection.toJS() : {};
    const instance    = coll.instance || {};
    const details     = instance.details || {};
    const type        = instance.type || '';
    const toc         = details.toc || {};
    const categories  = toc.categories || [];
    const page_titles = details.page_titles || [];

    const { searchString, mode, author_id, is_draft } = this.props;
    const formData = {
      title          : details.title,
      summary        : details.summary,
      author_version : details.author_version,
      tags           : details.tags,
      price          : details.price,
      details        : details.details,
      intro_video_url: details.intro_video_url,
      is_priced      : details.is_priced,
      discounted_price : details.discounted_price,
    };

    const commonInfoData = {
      creation_time : details.creation_time,
      modified_time : details.modified_time,
      type,
    };

    const catsNodes = categories.map((category, i, array) => {
      const cat = (
        <CollectionCategoryEdit collection_id={collection_id}
          data={category}
          key={i}
          page_titles = {page_titles}
          index={i}
          mode={mode}
          is_draft={is_draft}
          author_id={author_id}
          type="category"
          isPreviewable={details.is_priced}
          searchString={searchString}
          draggable={array.length > 1 && mode === 'write'}
          saveTitle={this.props.saveTitle}
          addArticle={this.props.addArticle}
          cloneArticle={this.props.cloneArticle}
          togglePreview={this.props.togglePreview}
          toggleIsLesson={this.props.toggleIsLesson}
          removeCategory={this.props.removeCategory}
          removeArticle={this.props.removeArticle}
          moveItem={this.props.moveItem}
        />
      );

      if (searchString) {
        return searchOverCategories(category, cat, searchString, page_titles);
      }

      return cat;

    });

    let helmetPageTitle = details.title ? details.title : pageTitles.UNTITLED;
    helmetPageTitle += pageTitles.DRAFT;

    return (
      <div className={`b-page__content ${styles.content}`}>
        <Helmet
          title={helmetPageTitle}
          meta={[{ property: 'og:title', content: helmetPageTitle }]}
        />

        { this.props.children }

        <CollectionCommonInfo data={commonInfoData}/>

        <CollectionForm data={formData} name="form" mode={mode}
          resetGlobalAction={this.props.resetGlobalAction}
          globalAction={this.props.globalAction}
          saveFormData={this.props.saveFormData}
        />

        <CollectionSearch />

        <ul className={styles.list}>{catsNodes}</ul>

        { mode === 'write' ?
            <div className={styles.buttons}>
              <Btn primary large onClick={this.props.addCategory} text="Add Category"/>
            </div> : null }
      </div>
    );

  }
}

export default CollectionContentEdit;
