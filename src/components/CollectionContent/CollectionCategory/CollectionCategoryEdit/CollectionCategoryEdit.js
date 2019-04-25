import styles from './CollectionCategoryEdit.module.scss';

import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';

import { Icons, Btn } from '../../../index';
import CollectionDefaultCategory from './CollectionDefaultCategory';
import CollectionArticle from '../../CollectionArticle/CollectionArticle';
import CollectionCategoryTitleEditor from '../CollectionCategoryTitleEditor/CollectionCategoryTitleEditor';

import { ItemTypes, categorySource, categoryTarget } from '../../dragutils';
import searchOverArticles from '../../searchutils/searchOverArticles';

@DropTarget([ItemTypes.CATEGORY, ItemTypes.ARTICLE], categoryTarget, (connect, monitor) => ({
  connectDropTarget : connect.dropTarget(),
  canDrop : monitor.canDrop()
}))
@DragSource(ItemTypes.CATEGORY, categorySource, (connect, monitor) => ({
  connectDragSource : connect.dragSource(),
  isDragging        : monitor.isDragging()
}))
class CollectionCategoryEdit extends Component {

  static propTypes = {
    collection_id  : PropTypes.string.isRequired,
    data           : PropTypes.object.isRequired,
    page_titles    : PropTypes.object.isRequired,
    author_id      : PropTypes.number.isRequired,
    index          : PropTypes.number.isRequired,
    mode           : PropTypes.string.isRequired,
    is_draft       : PropTypes.bool.isRequired,
    searchString   : PropTypes.string.isRequired,
    draggable      : PropTypes.bool.isRequired,
    isPreviewable  : PropTypes.bool,
    saveTitle      : PropTypes.func,
    addArticle     : PropTypes.func,
    cloneArticle   : PropTypes.func,
    togglePreview  : PropTypes.func,
    toggleIsLesson : PropTypes.func,
    removeCategory : PropTypes.func,
    removeArticle  : PropTypes.func,
    moveItem       : PropTypes.func,
    connectDropTarget : PropTypes.func.isRequired,
    connectDragSource : PropTypes.func.isRequired,
    isDragging        : PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.onAddArticle     = this.onAddArticle.bind(this);
    this.onCloneArticle   = this.onCloneArticle.bind(this);
    this.onSaveTitle      = this.onSaveTitle.bind(this);
    this.onEditToggle     = this.onEditToggle.bind(this);
    this.onRemoveCategory = this.onRemoveCategory.bind(this);

    this.onToggleArticlePreview = this.onToggleArticlePreview.bind(this);
    this.onToggleIsLesson = this.onToggleIsLesson.bind(this);
    this.onRemoveArticle = this.onRemoveArticle.bind(this);

    this.state = {
      editMode : props.data.editMode,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editMode : nextProps.data.editMode,
    });
  }

  renderPages(collection_id, data, page_titles, searchString, is_draft) {

    const pages = data.pages.map((page, i, array) => {
      const article_title = page_titles[page.id];

      if (searchString && !searchOverArticles(searchString, page, article_title)) {
        return null;
      }

      return (
        <li className={styles['list-item']} key={i}>
          <CollectionArticle
            collection_id={collection_id}
            data={page}
            article_title={article_title}
            index={i}
            key={`artucle${i}`}
            author_id={this.props.author_id}
            is_draft={is_draft}
            isPreviewable={this.props.isPreviewable}
            mode={this.props.mode}
            type="article"
            parentIndex={this.props.index}
            moveItem={this.props.moveItem}
            draggable={(array.length > 1 || this.props.draggable) && this.props.mode === 'write'}
            togglePreview={this.onToggleArticlePreview}
            toggleIsLesson={this.onToggleIsLesson}
            removeArticle={this.onRemoveArticle}
            cloneArticle={this.onCloneArticle}
          />
        </li>
      );
    });

    return pages.length ? <ul className={styles.list}>{ pages }</ul> : null;
  }

  onAddArticle() {
    this.props.addArticle(this.props.data.id);
  }

  onCloneArticle(srcArticleId, srcArticleTitle) {
    this.props.cloneArticle(this.props.data.id, srcArticleId, srcArticleTitle);
  }

  renderHeader(data) {

    const header = (
      <div className={styles.header}>
        { (!this.state.editMode ? [
          <h4 className={styles.title} key="title">{ data.title }</h4>,
          <i className={styles['icon-wrap']} key="edit" onClick={this.onEditToggle}>{ Icons.pencilIcon }</i>,
        ] : <CollectionCategoryTitleEditor saveTitle={this.onSaveTitle} title={data.title}/>) }

        { !data.pages.length ? <i className={`${styles['icon-wrap']} ${styles['remove-category']}`}
                                  onClick={this.onRemoveCategory}>
                                { Icons.closeIcon }
                               </i> : null }
      </div>
    );

    if (this.props.mode === 'write') return header;
    else if (this.props.mode === 'read') {
      return (
        <div className={styles.header}>
          <h4 className={styles.title}>{ data.title }</h4>
        </div>
      );
    }
  }

  render() {

    if (this.props.data.hide) return null;

    const { collection_id, data, page_titles, draggable, searchString,
           connectDragSource, connectDropTarget,
           isDragging, mode, is_draft } = this.props;

    const pagesList = this.renderPages(collection_id, data, page_titles, searchString, is_draft);
    const opacity   = isDragging ? 0.4 : 1;

    const category = (
      <li className={styles.category} style={{ opacity }}>

        { draggable ? <div className={styles.drag}>{ Icons.moveIcon }</div> : null }

        { this.renderHeader(data) }

        { pagesList }

        { mode === 'write' ? <div className={styles.footer}>
                              <Btn  className="b-btn_green-border"
                                    text="Add Lesson"
                                    medium
                                    onClick={this.onAddArticle}/>
                            </div> : null }
      </li>
    );

    if (data.title === '__default') {

      return (
        <CollectionDefaultCategory mode={mode} addArticle={this.onAddArticle}>
          { pagesList }
        </CollectionDefaultCategory>
      );

    } else if (mode === 'write') {

      return connectDragSource(connectDropTarget(category));

    }

    return category;
  }

  onSaveTitle(title) {
    if (!title) {
      this.onEditToggle(false);
      return;
    }

    this.props.saveTitle(this.props.data.id, title);
  }

  onEditToggle(value = true) {
    this.setState({
      editMode : value,
    });
  }

  onToggleArticlePreview(articleId) {
    this.props.togglePreview(this.props.data.id, articleId);
  }

  onToggleIsLesson(articleId) {
    this.props.toggleIsLesson(this.props.data.id, articleId);
  }

  onRemoveArticle(articleId) {
    this.props.removeArticle(this.props.data.id, articleId);
  }

  onRemoveCategory() {
    this.props.removeCategory(this.props.data.id);
  }
}

export default CollectionCategoryEdit;
