import styles from './ArticleSummary.module.scss';

import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import { Icons,
        Btn,
        SomethingWithIcon } from '../../index';

import ArticleSummaryBanner from './ArticleSummaryBanner';
import ArticleSummaryMain from './ArticleSummaryMain';
import ArticleSummaryFooter from './ArticleSummaryFooter';

import { serverUrl } from '../../../config-old';

@connect(state => ({}), { pushState })
export default class ArticleSummary extends Component {

  static PropTypes = {
    data : PropTypes.object.isRequired,
    mode : PropTypes.string.isRequired,
    userInfo  : PropTypes.object.isRequired,
  };

  buildArticleClassName(data, isLanding) {

    const baseClassName = styles['article-summary'];

    // add landing modificator if it's landing page
    let articleClass = isLanding ? `${baseClassName} landing` : baseClassName;

    articleClass = data.doc_type == 'collection' ? `${articleClass} ${styles.collection}` : articleClass;

    // add modificator for empty banner
    articleClass = !data.cover_image_id ? `${articleClass} ${styles['no-image']}` : articleClass;

    return articleClass;
  }

  render() {
    const {data, mode = 'read', userInfo} = this.props;
    const previewMode = '/draft';

    // is landing page if it doesn't contain "published" property
    const isLanding = data.instance_type == 'published';

    const isPublished = data.is_published;

    // don't show repeat icon if article not published
    const showRepeatControl = !isPublished;

    const articleClass      = this.buildArticleClassName(data, isLanding);

    // urls, buttons etc.
    const misc = this.getArticleMisc();

    const viewUrl = misc.isPreview ? misc.viewUrl + previewMode : misc.viewUrl;


    let cover_image;

    if (!!data.cover_image_id) {
      if (mode === 'write') {
        cover_image = `${serverUrl}/api/author/${data.doc_type}/${data.id}/image/${data.cover_image_id}`;
      } else if (mode === 'read') {
        cover_image = `${serverUrl}/api/${data.doc_type}/${data.author_id}/${data.id}/image/${data.cover_image_id}.png`;
      }
    }

    return (<article className={articleClass}>
            <div className={styles['banner-wrapper']}>
              <ArticleSummaryBanner {...this.props} banner={cover_image} url={viewUrl}/>
            </div>
            <ArticleSummaryMain {...this.props} url={viewUrl}/>
            <ArticleSummaryFooter {...this.props} url={viewUrl} loggedInUserId={userInfo ? userInfo.user_id : null}>
              { this.renderArticleSummaryControls(misc, mode) }
            </ArticleSummaryFooter>
          </article>);
  }

  renderArticleSummaryControls(misc, mode) {

    if (mode !== 'write') return null;

    const buttons = misc.buttons.map((btn, i) => {
      let btnClassName = 'b-btn_primary';
      let icon = Icons.pencilIcon;
      if (btn.type === 'publish') {
        btnClassName = 'b-btn_secondary';
        icon = Icons.globeIcon;
      } else if (btn.type === 'stats') {
        btnClassName = 'b-btn_secondary';
        icon = Icons.barChartIcon;
      }

      return  (<li key={i}>
                <Btn className={`${btnClassName} b-btn_inverse`} onClick={() => this.props.pushState(null, btn.url)}>
                  <SomethingWithIcon icon={icon} text={btn.text}/>
                </Btn>
              </li>);
    });

    return  (<ul className={styles['buttons-list']}>
              { buttons }
            </ul>);
  }

  getArticleMisc() {
    const isPreview = this.props.mode === 'write';
    const { is_published, instance_type, doc_type, id, author_id, owned_by_reader, is_priced } = this.props.data;
    const user_id = isPreview ? this.props.userInfo.user_id : author_id;

    const result = { buttons: [] };
    const editorUrl = `/${doc_type}editor/${id}`;
    const pageviewerUrl = !isPreview && is_priced && !owned_by_reader ? `/page/preview/${user_id}/${id}` : `/page/${user_id}/${id}`;
    const collectionViewerUrl = `/collection/${user_id}/${id}`;
    const publishBtnText = 'Published';
    let editBtnText = 'Continue Editing';
    const viewUrl = doc_type === 'page' ? pageviewerUrl : collectionViewerUrl;

    const publishBtn = {
      type : 'publish',
      text : publishBtnText,
      url  : viewUrl,
    };

    if (is_published) {
      if (doc_type !== 'page') {
        const statsBtn = {
          type : 'stats',
          text : 'Stats',
          url  : viewUrl + '/stats'
        };
        result.buttons.push(statsBtn);
      }

      result.buttons.push(publishBtn);
    }

    if (instance_type === 'published' && is_published) {
      editBtnText = 'Start Editing';
    }

    const editBtn = {
      type : 'edit',
      text : editBtnText,
      url  : editorUrl,
    };

    result.buttons.push(editBtn);

    result.viewUrl   = viewUrl;
    result.isPreview = isPreview;

    return result;
  }
}
