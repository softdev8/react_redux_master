import styles from './ViewCollectionArticlesContent.module.scss';

import React, { PropTypes, Component } from 'react';
import { pushState } from 'redux-router';
import classnames from 'classnames';

import { Header } from '../../index';
import ArticleEditorButtonsPanel from '../../ArticlePagesContent/ArticleEditorButtonsPanel/ArticleEditorButtonsPanel';

import isDraftPage from '../../../utils/isDraftPage';

class ViewCollectionArticlesContent extends Component {

  getCustomButtons() {
    const { page_id, collection_id } = this.props;
    const editUrl = !collection_id ? `/pageeditor/${page_id}` : `/pageeditor/${collection_id}/${page_id}`;

    return [{
      type   : 'primary',
      text   : 'Edit',
      method : ()=>this.props.dispatch(pushState(null, editUrl)),
      icon   : 'pencilIcon',
    }];
  }

  render() {
    const { collapsed, children, toggleSidebar } = this.props;

    const mainClassName = classnames(
      styles.main,
      {
        [styles.collapsed] : collapsed,
      },
    );

    return (
      <div className={mainClassName}>

        <Header logoSize="small" menuButton className="header_dim"
                toggleSidebar={toggleSidebar}/>

        { isDraftPage(window.location) ? <ArticleEditorButtonsPanel customButtons={this.getCustomButtons()}/> : null }

        { children }

      </div>
    );
  }
}

ViewCollectionArticlesContent.propTypes = {
  children      : PropTypes.node.isRequired,
  collapsed     : PropTypes.bool.isRequired,
  collection_id : PropTypes.string.isRequired,
  dispatch      : PropTypes.func.isRequired,
  page_id       : PropTypes.string.isRequired,
  toggleSidebar : PropTypes.func.isRequired,
};

export default ViewCollectionArticlesContent;
