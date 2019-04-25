import styles from './PageSummary.module.scss';

import React, { Component, PropTypes } from 'react';

import { AuthorBlock } from '../index';

class PageSummary extends Component {

  static propTypes = {
    author : PropTypes.shape({
      author_id : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,

      author_name : PropTypes.string,
    }).isRequired,

    children: PropTypes.node,

    pageSummary : PropTypes.shape({
      title       : PropTypes.string,
      description : PropTypes.string,
      tags        : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
      ]),
      price       : PropTypes.number,
    }).isRequired,

    hideAuthorBlock: PropTypes.bool,
  };

  render() {
    const { pageSummary = {}, author = {}, hideAuthorBlock } = this.props;
    const title = pageSummary.title || '';
    const tags  = pageSummary.tags  || [];
    const description = pageSummary.description || null;

    return (
      <div className={styles.summary}>
        <div className={styles.titleandauthor}>
          <h1 className={styles.title}>{title}</h1>

          {hideAuthorBlock ? null :
            <div className={styles.author}>
            <AuthorBlock {...author} tags={tags}/>
          </div>}
        </div>

        {description ?
          <div className={styles.description}>
            <p className={styles.descriptionText}>{description}</p>
            { this.props.children }
          </div> : this.props.children }

      </div>
    );
  }
}

export default PageSummary;
