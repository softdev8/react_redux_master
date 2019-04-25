import styles from './ArticleSummary.module.scss';

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {Icons, Btn, SomethingWithIcon} from '../../index';

export default class ArticleSummaryBanner extends Component {

  static PropTypes = {
    banner : PropTypes.object.isRequired,
    url    : PropTypes.string.isRequired,
    data : PropTypes.object.isRequired,
  };

  render() {
    const {banner, url, data, mode = 'read'} = this.props;
    const style = banner ? {backgroundImage : `url(${banner})`} : {};
    const bannerClassName = styles.banner;

    return  <div className={bannerClassName}>
              
              {mode == 'read' ?
                <Link to={ url }  query={{ authorName: data.author_name }}>
                  <div className={styles.image} style={style}/>
                  <img src={ banner }/>
                </Link>
                : <Link to={ url }>
                  <div className={styles.image} style={style}/>
                  <img src={ banner }/>
                </Link> }

            </div>;
  }

}