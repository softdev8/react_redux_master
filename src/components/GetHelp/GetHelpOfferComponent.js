import styles from './GetHelpComponent.module.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import TuitionOffer from './TuitionOffer';

export default class GetHelpComponent extends Component {
  getCourseLink = () => {
    const { author_id, collection_id } = this.props;
    return `/collection/${author_id}/${collection_id}`;
  }

  getCourseOffersLink = () => {
    const { author_id, collection_id } = this.props;
    return `/collection/${author_id}/${collection_id}/experthelp`;
  }

  render() {
    const { title, author_id, collection_id, offer_id, tuition_offers, userInfo } = this.props;

    let tuitionOffer =  null;
    if (tuition_offers) {
      tuitionOffer = tuition_offers.find((offer) => {
        return parseInt(offer.offer_id) === parseInt(offer_id);
      });
    }

    const pageTitle = 'Educative.io: ' + (tuitionOffer ? tuitionOffer.title : title);

    return (
      <div>
        <Helmet
          title={pageTitle}
          meta={[{ property: 'og:title', content: pageTitle }]}
        />
        <h3 className={styles.getHelpHeaderInfo}>
          <span>Learn directly from the author(s) and fully-vetted mentors of </span>
          <Link className={styles.courseNameBacklink} to={this.getCourseLink()}>
              <span>{this.props.title}.</span>
          </Link>
        </h3>
        <ul className={styles['helpServices-list']}>
          {
            tuitionOffer &&
            <TuitionOffer
              key={'tuitionOffer'}
              title={tuitionOffer.title}
              description={tuitionOffer.description}
              duration={tuitionOffer.duration}
              price={tuitionOffer.price}
              discounted_price={tuitionOffer.discounted_price || null}
              offer_id={tuitionOffer.offer_id}
              author_id={author_id}
              collection_id={collection_id}
              userInfo={userInfo}
            />
          }
        </ul>
        <h4 className={styles.courseNameBacklinkWrapper}>
          <Link className={styles.courseNameBacklink} to={this.getCourseOffersLink()}>
              <span>View all offers for this course.</span>
          </Link>
        </h4>
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
