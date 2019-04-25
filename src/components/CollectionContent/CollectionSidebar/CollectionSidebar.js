import styles from './CollectionSidebar.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CollectionSidebarCategory from './CollectionSidebarCategory';
import CollectionSearch from '../CollectionSearch/CollectionSearch';

import searchOverCategories from '../searchutils/searchOverCategories';
import targetInParent from '../../../utils/targetInParent';

const MD_SCREEN_WIDTH = 768;

class CollectionSidebar extends Component {

  componentDidMount() {
    window.addEventListener('resize', this.toggleSidebarOnResize);
    document.addEventListener('click', this.toggleSidebarOnContentClick);
  }

  componentWillUnmount() {
    this.props.finishSearch({ resetable: true });

    window.removeEventListener('resize', this.toggleSidebarOnResize);
    document.removeEventListener('click', this.toggleSidebarOnContentClick);
  }

  toggleSidebarOnResize = () => {
    this.toggleSidebarOnSmallScreen();
  };

  toggleSidebarOnContentClick = (e) => {
    const mainNode = document.getElementsByClassName('toggle-sidebar')[0];

    if (!targetInParent(mainNode, e.target)) return;

    this.toggleSidebarOnSmallScreen();
  };

  toggleSidebarOnSmallScreen() {
    if (window.innerWidth <= MD_SCREEN_WIDTH && this.props.show) {
      this.props.toggleSidebar();
    }
  }

  render() {
    const { show, collection, author_id, page_id,
            collection_id, is_draft, userInfo, searchString } = this.props;
    const showClassName = !show ? styles.collapsed : styles.expanded;

    const details     = collection.getIn(['instance', 'details']).toJS();
    const toc         = details.toc || {};
    const categories  = toc.categories || [];
    const page_titles = details.page_titles || [];
    const owned_by_reader = collection.getIn(['instance', 'owned_by_reader']);

    const loggedInUserId = userInfo ? userInfo.user_id : null;
    const owned_by_author = loggedInUserId === author_id;

    const cats = categories.map((category, i) => {
      const catProps = {
        articles_titles : page_titles,
        author_id,
        collection_id,
        is_priced: details.is_priced,
        owned_by_reader,
        owned_by_author,
        page_id,
        toggleSidebar: this.props.toggleSidebar,
        searchString,
      };

      const cat = (
        <li key={i}>
          <CollectionSidebarCategory is_draft={is_draft} data={category} {...catProps}/>
        </li>
      );

      if (searchString) {
        return searchOverCategories(category, cat, searchString, page_titles);
      }

      return cat;
    });

    let linkToCollection = `/collection/${author_id}/${collection_id}`;
    const linkToCollectionEditor = `/collectioneditor/${collection_id}`;

    if (is_draft) linkToCollection += '/draft';

    return (
      <section className={`${styles.sidebar} ${showClassName}`}>
        <header className={styles.header}>

          { is_draft ?
            <Link to={linkToCollectionEditor} className={styles['go-back']} title="return to editing collection">
              go back to editor
            </Link> : null }

            <div style={{ marginTop: 10 }}>
              <Link to={linkToCollection}>
                { details.title }
              </Link>
            </div>
        </header>

        <CollectionSearch className={styles.search} placeholder={'Search'} searchTerm={searchString}/>

        <ul className={styles.list}>
          { cats }
        </ul>
      </section>
    );
  }
}

CollectionSidebar.propTypes = {
  author_id     : PropTypes.number.isRequired,
  collection    : PropTypes.object.isRequired,
  collection_id : PropTypes.number.isRequired,
  finishSearch  : PropTypes.func.isRequired,
  is_draft      : PropTypes.number.isRequired,
  page_id       : PropTypes.string.isRequired,
  searchString  : PropTypes.string.isRequired,
  show          : PropTypes.bool.isRequired,
  toggleSidebar : PropTypes.func.isRequired,
  userInfo      : PropTypes.object,
};

export default CollectionSidebar;
