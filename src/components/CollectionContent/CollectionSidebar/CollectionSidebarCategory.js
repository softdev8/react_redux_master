import styles from './CollectionSidebarCategory.module.scss';

import React, { Component, PropTypes } from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Link } from 'react-router';
import {SomethingWithIcon, Icons} from '../../index';
import searchOverArticles from '../searchutils/searchOverArticles';
import misc from '../CollectionArticle/misc';

const MD_SCREEN_WIDTH = 768;

class CollectionSidebarCategory extends Component {

  static propTypes = {
    articles_titles : PropTypes.object.isRequired,
    author_id       : PropTypes.number.isRequired,
    collection_id   : PropTypes.number.isRequired,
    data            : PropTypes.object.isRequired,
    is_draft        : PropTypes.bool,
    is_priced       : PropTypes.bool,
    owned_by_author : PropTypes.bool,
    owned_by_reader : PropTypes.bool,
    page_id         : PropTypes.string.isRequired,
    searchString    : PropTypes.string.isRequired,
    toggleSidebar   : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleCollapse = this.toggleCollapse.bind(this);

    this.state = {
      collapsed : false, // this.checkIfCollapsed(props, this.checkById),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchString !== this.props.searchString) {
      this.setState({
        collapsed : this.checkIfCollapsed(nextProps, this.checkBySearchString),
      });
    }
  }

  onArticleClick = () => {
    const { innerWidth } = window;

    if (innerWidth <= MD_SCREEN_WIDTH) {
      this.props.toggleSidebar();
    }
  }

  checkById(page, props) {
    return page.id === parseInt(props.page_id, 10);
  }

  checkBySearchString(page, props) {
    const { articles_titles, searchString } = props;
    const title = articles_titles[page.id] || page.title;

    return searchString && searchOverArticles(searchString, page, title);
  }

  checkIfCollapsed(props, matcher) {
    let result;

    result = props.data.pages.filter(page => {
      return matcher(page, props);
    });

    return !result.length;
  }

  toggleCollapse() {
    this.setState({
      collapsed : !this.state.collapsed,
    });
  }

  render() {

    const { collapsed } = this.state;
    const { data, collection_id, author_id, owned_by_reader, is_priced,
            articles_titles, searchString, is_draft } = this.props;

    const collapsedClassName = collapsed ? styles.collapsed : styles.expanded;

    const pages = data.pages.map((page, i) => {

      const links = misc(author_id, collection_id, page.id, is_draft);
      const title = articles_titles[page.id] || page.title;

      if (searchString && !searchOverArticles(searchString, page, title)) {
        return null;
      }

      let linkToRender;

      if (is_draft) {
        linkToRender = (
          <li className={styles.page} key={i}>
            <Link to={links.viewUrl} activeClassName={styles.active} onClick={this.onArticleClick}>
            { title }
            {page.is_preview ? <SomethingWithIcon icon={Icons.eye}/> : null}
            </Link>
          </li>
        );
      } else if (is_priced && page.is_preview && (page.is_lesson === undefined || page.is_lesson === true)) {
        const tooltip = <Tooltip placement="bottom">Preview lesson</Tooltip>;
        linkToRender = (
          <li className={styles.page} key={i}>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <Link to={links.viewUrl} activeClassName={styles.active} onClick={this.onArticleClick}>
                { title }
                  <SomethingWithIcon icon={Icons.eye}/>
              </Link>
            </OverlayTrigger>
          </li>
        );
      } else if (is_priced && !page.is_preview && !owned_by_reader) {
        linkToRender = (
          <li className={styles.page} key={i}>
            <Link to={`${links.viewUrl}/preview`} activeClassName={styles.active} onClick={this.onArticleClick}>{ title }</Link>
          </li>
        );
      } else {
        linkToRender = (
          <li className={styles.page} key={i}>
            <Link to={links.viewUrl} activeClassName={styles.active} onClick={this.onArticleClick}>{ title }</Link>
          </li>
        );
      }

      return linkToRender;
    });

    const baseClassName = styles.category;

    let categoryClassName = baseClassName;

    if (data.title === '__default') {
      categoryClassName += ` ${styles['def-category']}`;
    } else {
      categoryClassName += ` ${collapsedClassName}`;
    }

    return (
      <div className={categoryClassName}>
        <div className={styles.title} title={data.title} onClick={this.toggleCollapse}>
          { data.title }
        </div>
        <ul className={styles.list}>
          { pages }
        </ul>
      </div>
    );
  }
}

export default CollectionSidebarCategory;
