import styles from './GetHelpComponent.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import TuitionOffer from './TuitionOffer';
import Helmet from 'react-helmet';

export default class GetHelpComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.getCourseLink = this.getCourseLink.bind(this);
  }

  getCourseLink() {
    const { author_id, collection_id } = this.props;
    return `/collection/${author_id}/${collection_id}`;
  }

  render() {
    let tuition_offers = null;
    const { author_id, collection_id, userInfo } = this.props;

    if (this.props.tuition_offers) {
      tuition_offers = this.props.tuition_offers.map((comp, i) => {
        return (
          <TuitionOffer
            key={i}
            title={comp.title}
            description={comp.description}
            duration={comp.duration}
            price={comp.price}
            discounted_price={comp.discounted_price || null}
            offer_id={comp.offer_id}
            author_id={author_id}
            collection_id={collection_id}
            userInfo={userInfo}
          />
        );
      });
    }

    const pageTitle = `Live 1:1 mentoring - ${this.props.title}`;

    return (
      <div>
        <Helmet
          title={pageTitle}
          meta={[{ property: 'og:title', content: pageTitle }]}
        />
        <h3 className={styles.courseNameBacklinkWrapper}>
          <Link className={styles.courseNameBacklink} to={this.getCourseLink()}>
              <span>{this.props.title}</span>
          </Link>
        </h3>
        <h1 className={styles.gethelpHeading}>
          Live 1:1 mentoring from course experts
        </h1>
        <h3 className={styles.getHelpHeaderInfo}>
          Learn directly from the author(s) and fully-vetted mentors of this course.
        </h3>
        <ul className={styles['helpServices-list']}>
          {tuition_offers}
        </ul>
      </div>
    );
  }
}

GetHelpComponent.propTypes = {
  author_id       : PropTypes.string.isRequired,
  collection_id   : PropTypes.string.isRequired,
  title           : PropTypes.string.isRequired,
  userInfo        : PropTypes.object,
  tuition_offers  : PropTypes.array,
};
