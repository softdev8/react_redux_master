import styles from './ArticlePageSummary.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import PureMixin from 'react-pure-render/mixin';
import {Link} from 'react-router';
import {Grid, Col, Row} from 'react-bootstrap';
import Immutable from 'immutable';

import Icon from '../../common/Icon';
import Input from '../../common/Input';
import Textarea from '../../common/TextArea';
import Tags from '../../commonUI/Tags/Tags';
import { PageSummary } from '../../index';
import {SomethingWithIcon, Icons} from '../../index';


export default React.createClass({
  mixins: [PureMixin],

  statics: {
    getDefaultSummaryObject() {
      return {
        title: "[Page Title]",
        author: "[Author Name]",
        description: "[Description]",
        tags: "technology",
        date: "01/20/2015",
        viewCount: 0,
        commentsCount: 0,
        likesCount: 0,
        shareCount: 0,
      };
    },
  },

  handleTitleChange(event) {
    if(event.target.value === this.props.pageSummary.get('title')){
      return;
    }

    this.props.handlePageSummaryChange({title : event.target.value});
  },

  handleSummaryChange(event) {
    if(event.target.value === this.props.pageSummary.get('description')){
      return;
    }

    this.props.handlePageSummaryChange({description : event.target.value});
  },

  componentDidMount() {
    if(this.props.mode == 'edit'){
     this.updateSummary();
     findDOMNode(this.refs.title).focus();
    }
  },

  componentDidUpdate() {
    if(this.props.mode == 'edit'){
      this.updateSummary();
    }
  },

  updateSummary() {
    let title = this.props.pageSummary? this.props.pageSummary.get('title') : "";
    let description = this.props.pageSummary? this.props.pageSummary.get('description') : "";
    title = title == undefined || title == "undefined" ? "" : title;
    description = description == undefined || description == "undefined" ? "" : description;
    this.refs.title.getInputDOMNode().value = title ;
    this.refs.description.getInputDOMNode().value = description;
  },

  onTagsChange(tags) {
    this.props.handlePageSummaryChange(this.props.pageSummary.update('tags', ()=>tags))
  },

  render() {
    const summary = this.props.pageSummary.toJS();

    let summarySocailGrid =
      <Grid fluid>
        <Row>
          <Col xs={4} style={{paddingTop: 12.5, paddingBottom: 12.5}}>
            <div>
              <small>
                <Icon glyph='icon-ikons-hashtag' 
                      style={{position: 'relative', top: 1}}/> {summary.tags}
              </small>
            </div>
          </Col>
          <Col xs={8} className='text-right' 
                style={{paddingTop: 12.5, paddingBottom: 12.5}}>
            <div style={{display: 'inline-block', marginLeft: 25}}>
              <Icon style={{position: 'relative', lineHeight: 0, top: 2}}
                    glyph='icon-ikons-speech-3'/>
              <span> {summary.commentsCount}</span>
            </div>
            {' '}
            <div className='summary-share-icon' style={{display: 'inline-block', marginLeft: 25}}>
              <SomethingWithIcon icon={Icons.shareIcon}/>          
              <span> {summary.shareCount}</span>
            </div>
            <div className='fg-pink' 
                  style={{display: 'inline-block', marginLeft: 25}}>
              <Icon style={{position: 'relative', lineHeight: 0, top: 2}}
                    glyph='icon-ikons-heart'/>
              <span> {summary.likesCount}</span>
            </div>
          </Col>
        </Row>
      </Grid>;
    // TODO: remove this when implementing social features
    summarySocailGrid = null;



    let summaryViewCount =
      <Col xs={6} collapseLeft collapseRight className='text-right'>
        <div className='fg-darkgray25 fg-hover-black50'>
          <small>
            <Icon glyph='icon-ikons-time' 
                  style={{position: 'relative', top: 1}}/>
              <span> {summary.viewCount} views</span>
            </small>
        </div>
      </Col>;
    // TODO: remove this when implementing social features
    summaryViewCount = null;


    let summaryContent = null;

    const { pageSummary = {}, mode, author, isCollectionArticle } = this.props;

    if (mode === 'view') {
      summaryContent = <PageSummary pageSummary={pageSummary.toJS()} author={author} hideAuthorBlock={isCollectionArticle}/>;
    } else {

      summaryContent =  <div className={styles.edit}>

                          <div className={styles.title}>
                            <Input ref='title' placeholder='Title'
                                   onBlur={this.handleTitleChange}/>
                          </div>

                          <div className={styles.description}>
                            <Textarea id='textarea' rows='4' 
                                      ref='description'
                                      className='form-control'
                                      placeholder='Summary'
                                      onBlur={this.handleSummaryChange}/>
                          </div>

                          <Tags tags={summary.tags} mode='write' 
                                className={styles.tags}
                                onChange={this.onTagsChange}/>

                        </div>; 
    }

    return (
      <div className={styles.summary}>
        {summaryContent}
        {summarySocailGrid}
      </div>
    );
  },
});
