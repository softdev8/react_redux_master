import styles from './TuitionOffers.module.scss';
import React, { Component, PropTypes } from 'react';
import { Btn } from '../../';
import Textarea from 'react-textarea-autosize';

export default class AddTuitionOfferComponent extends Component {
  constructor(props) {
    super(props);

    this.onAddTuitionOffer = this.onAddTuitionOffer.bind(this);

    this.state = {
      title: '',
      description: '',
      duration: '',
      price: 0,
      discounted_price: 0
    };
  }

  onAddTuitionOffer() {
    const { title, description, duration, price, discounted_price } = this.state;

    this.props.onAddTuitionOffer({
      title,
      description,
      duration,
      price,
      discounted_price
    });
  }

  render() {
    return (
      <div className={styles.add_tuition_offer_container}>
        <div>
          <label className={styles.tuition_offer_label}>Title</label>
          <Textarea
            className={styles.tuition_offer_input}
            maxLength={160}
            minRows={1}
            maxRows={2}
            onChange={(e) => this.setState({ title: e.target.value })}
          />
          <label className={styles.tuition_offer_label}>Description</label>
          <Textarea
            className={styles.tuition_offer_input}
            maxLength={2*1024}
            minRows={1}
            maxRows={4}
            onChange={(e) => this.setState({ description: e.target.value })}
          />
          <label className={styles.tuition_offer_label}>Duration (minutes)</label>
          <Textarea
            className={styles.tuition_offer_input}
            maxLength={4}
            minRows={1}
            maxRows={1}
            onChange={(e) => this.setState({ duration: e.target.value })}
          />
          <label className={styles.tuition_offer_label}>Price ($)</label>
          <Textarea
            className={styles.tuition_offer_input}
            maxLength={4}
            minRows={1}
            maxRows={1}
            onChange={(e) => this.setState({ price: e.target.value })}
          />
          <label className={styles.tuition_offer_label}>Discounted Price ($)</label>
          <Textarea
            className={styles.tuition_offer_input}
            maxLength={4}
            minRows={1}
            maxRows={1}
            onChange={(e) => this.setState({ discounted_price: e.target.value })}
          />
        </div>
        <Btn small secondary
          className={styles.tuition_offer_add_button}
          onClick={this.onAddTuitionOffer}
          text="Add offer"
        />
      </div>
    );
  }
}

AddTuitionOfferComponent.propTypes = {
  onAddTuitionOffer: PropTypes.func.isRequired
};
