import styles from './CollectionArticle.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { DragSource, DropTarget } from 'react-dnd';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import { Icons } from '../../index';

import misc from './misc';
import { ItemTypes, articleSource, articleTarget } from '../dragutils';

@DropTarget(ItemTypes.ARTICLE, articleTarget, connected => ({
  connectDropTarget : connected.dropTarget()
}))
@DragSource(ItemTypes.ARTICLE, articleSource, (connected, monitor) => ({
  connectDragSource : connected.dragSource(),
  isDragging        : monitor.isDragging()
}))
@connect(null, { pushState })
class CollectionArticle extends Component {

  static propTypes = {
    collection_id : PropTypes.string.isRequired,
    data          : PropTypes.object.isRequired,
    article_title : PropTypes.string,
    author_id     : PropTypes.number.isRequired,
    index         : PropTypes.number.isRequired,
    parentIndex   : PropTypes.number.isRequired,
    mode          : PropTypes.string.isRequired,
    is_draft      : PropTypes.bool.isRequired,
    draggable     : PropTypes.bool.isRequired,
    isPreviewable : PropTypes.bool.isRequired,
    pushState     : PropTypes.func.isRequired,
    togglePreview : PropTypes.func,
    toggleIsLesson: PropTypes.func,
    removeArticle : PropTypes.func,
    cloneArticle  : PropTypes.func,

    connectDropTarget : PropTypes.func.isRequired,
    connectDragSource : PropTypes.func.isRequired,
    isDragging : PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.onPreviewToggle = this.onPreviewToggle.bind(this);
    this.onIsLessonToggle = this.onIsLessonToggle.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onClone = this.onClone.bind(this);
  }

  onPreviewToggle() {
    this.props.togglePreview(this.props.data.id);
  }

  onIsLessonToggle() {
    this.props.toggleIsLesson(this.props.data.id);
  }

  onRemove() {
    this.props.removeArticle(this.props.data.id);
  }

  onClone() {
    const { data, article_title } = this.props;

    this.props.cloneArticle(
      data.id,
      article_title ? article_title : data.title);
  }

  render() {

    const { collection_id, data, article_title, draggable,
            connectDragSource, connectDropTarget, isPreviewable,
            mode, is_draft, author_id } = this.props;

    const iconWrapperClass  = `${styles['icon-wrapper']} ${styles.preview}`;
    const previewClassModifier = data.is_preview ? styles.enabled : styles.disabled;
    const lessonClassModifier = data.is_lesson === undefined || data.is_lesson === true ?
                                  styles.enabled : styles.disabled;
    const previewIcon = data.is_preview ? Icons.eyeIcon : Icons.eyeSlashIcon;

    const urls = misc(author_id, collection_id, data.id, is_draft || mode === 'write');

    return  connectDragSource(connectDropTarget(
      <div className={styles.article}>

        { draggable ? <div className={styles.drag}>{ Icons.moveIcon }</div> : null }

        <h4 className={styles.title}>
          <Link to={urls.viewUrl}>{ article_title ? article_title : data.title }</Link>
        </h4>

        { mode === 'write' ? <div className={styles.controls}>
                              <i className={`${iconWrapperClass} ${lessonClassModifier}`}
                                 title="Toggle preview state"
                                 onClick={this.onIsLessonToggle}
                              >
                                 <span style={{ fontSize: 12, marginRight: 20 }}>
                                   Lesson
                                 </span>
                              </i>

                              <i className={`${iconWrapperClass} ${styles.edit}`}
                                 title="Edit lesson in a new window"
                                 onClick={()=> this.props.pushState(null, urls.editUrl)}>{ Icons.pencilIcon }</i>

                              <i className={`${iconWrapperClass} ${styles.clone}`}
                                 title="Clone this lesson"
                                 onClick={this.onClone}>{ Icons.cloneIcon }</i>

                              { isPreviewable && (
                                  <i className={`${iconWrapperClass} ${previewClassModifier}`}
                                     title="Toggle preview state"
                                     onClick={this.onPreviewToggle}>{previewIcon}</i>) }

                              <i className={`${iconWrapperClass} ${styles.delete}`}
                                 title="Delete lesson"
                                 onClick={this.onRemove}>{ Icons.thinTrashIcon }</i>

                            </div> : null }
      </div>
    ));
  }
}

export default CollectionArticle;
