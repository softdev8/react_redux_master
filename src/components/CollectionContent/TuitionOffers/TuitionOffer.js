import styles from './TuitionOffer.module.scss';
import React, { Component, PropTypes } from 'react';
import { Btn } from '../../';

export default class TuitionOffer extends Component {
  getOfferRow(key, value) {
    return (
      <div className={styles.tuition_offer_row}>
        <div className={styles.tuition_offer_key}>{key}</div>
        <div className={styles.tuition_offer_value}>{value}</div>
      </div>
    );
  }

  getOfferDescriptionRow(key, value) {
    return (
      <div className={styles.tuition_offer_row}>
        <div className={styles.tuition_offer_key}>{key}</div>
        <div
          className={styles.tuition_offer_value}
          style={{ whiteSpace: 'pre-line' }}
        >
          {value}
        </div>
      </div>
    );
  }

  render() {
    const { offer } = this.props;

    return (
      <div className={styles.tuition_offer_container }>
          {
            this.getOfferRow('Title', offer.title)
          }
          {
            this.getOfferDescriptionRow('Description', offer.description)
          }
          {
            this.getOfferRow('Duration', offer.duration)
          }
          {
            this.getOfferRow('Price', offer.price)
          }
          {
            offer.discounted_price &&
              this.getOfferRow('Discounted price', offer.discounted_price)
          }
          <Btn small primary
            className={styles.tuition_offer_remove_button}
            onClick={() => this.props.onRemoveTuitionOffer(this.props.index)}
            text="Remove offer"
          />
      </div>
    );
  }
}

TuitionOffer.propTypes = {
  offer : PropTypes.shape({
    title              : PropTypes.string.isRequired,
    description      : PropTypes.string.isRequired,
    duration         : PropTypes.number.isRequired,
    price            : PropTypes.number.isRequired,
    discounted_price : PropTypes.number
  }).isRequired,
  index                : PropTypes.number.isRequired,
  onRemoveTuitionOffer : PropTypes.func.isRequired,
};
