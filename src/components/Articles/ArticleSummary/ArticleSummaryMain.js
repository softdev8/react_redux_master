import styles from './ArticleSummary.module.scss';

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {AuthorBlock} from '../../index';
import elapsedDays from '../../../utils/elapsedDays';

const summaryLength = 280;

export default class ArticleSummaryMain extends Component {

  static PropTypes = {
    data : PropTypes.object.isRequired,
    url  : PropTypes.string.isRequired,
    mode : PropTypes.string.isRequired,
  };

  render() {
    const {data, url, mode = 'read'} = this.props;
    const summary = data.summary? this.truncateText(data.summary, summaryLength) : "";

    let authorData = {}

    if(mode == 'read') {
      authorData.author_id   = data.author_id;
      authorData.author_name = data.author_name;
      authorData.tags        = data.tags;
    }

    return  <div className={styles.main}>
                <h3 className={styles.title}>
                  { mode == 'read' ? <Link to={url} query={{ authorName: data.author_name }}>{ data.title }</Link> : <Link to={url}>{ data.title }</Link> }
                  { data.doc_type == 'collection' && <span className={styles.badge}>{data.page_count == 1?"1 Lesson":`${data.page_count} Lessons`}</span> }
                </h3>

                { mode == 'read' ? <AuthorBlock {...authorData} className={styles.author}/> : null }

                { mode == 'read' ? 
                  <Link to={url}  query={{ authorName: data.author_name }}>
                    <p className={styles.desc} style={{ textAlign:'justify', fontSize:16 }}>{ summary }</p>
                  </Link> : 
                  <Link to={url}>
                    <p className={styles.desc}>{ summary }</p>
                  </Link> }
            </div>;
  }

  truncateText(text, maxLength) {

    // take substring with maxLength length
    let substr = text.substring(0, maxLength + 1);

    // if text shorter than maxLenght return it as is 
    if(substr.length <= maxLength) return text;

    // else truncate it to the latest whitespace.
    while(substr[substr.length - 1] != ' ') {

      // truncate latest symbol
      substr = substr.slice(0, -1);
    }

    // truncate space
    return `${substr.slice(0, -1)}...`;

  }

}