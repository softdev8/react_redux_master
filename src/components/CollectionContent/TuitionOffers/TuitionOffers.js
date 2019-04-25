import styles from './TuitionOffers.module.scss';
import React, { Component, PropTypes } from 'react';
import { Btn } from '../../';

const TuitionOffer = require('./TuitionOffer.js');
const AddTuitionOfferComp = require('./AddTuitionOfferComp');

export default class TuitionOffersComponent extends Component {
  render() {
    const { tuition_offers } = this.props;

    let  tuition_offer_list = null;
    tuition_offer_list = tuition_offers.map((offer, index) => {
      return (
        <TuitionOffer
          key={index}
          offer={offer}
          index={index}
          onRemoveTuitionOffer={this.props.onRemoveTuitionOffer}
        />
      );
    });

    return (
      <div className={styles.tuition_offers_container}>
        <div className={styles.label}>Mentoring options <i>(Beta)</i></div>
        {tuition_offer_list}
        <AddTuitionOfferComp onAddTuitionOffer={this.props.onAddTuitionOffer}/>
      </div>
    );
  }
}

TuitionOffersComponent.propTypes = {
  tuition_offers      : PropTypes.array,
  onAddTuitionOffer   : PropTypes.func,
  onRemoveTuitionOffer: PropTypes.func,
};

TuitionOffersComponent.defaultProps = {
  tuition_offers: [
    {
      title: 'title 1',
      description: 'Ad facilisis, penatibus condimentum purus nec auctor dapibus netus justo montes? Pretium at maecenas dictum et interdum mattis ullamcorper lobortis venenatis platea erat! Tortor ipsum proin massa molestie parturient cursus elementum vel congue, himenaeos mauris. Porta est diam curae; pellentesque, scelerisque conubia. Quisque elementum rhoncus blandit metus velit, augue molestie. Sem sociis volutpat sit congue faucibus laoreet sociosqu duis. Mauris elementum gravida justo! Aptent neque in pretium tempor torquent. Litora hendrerit nulla imperdiet. Sapien donec conubia tellus. Auctor magna elit lacus fermentum nascetur? Scelerisque tellus enim.',
      duration: 35,
      price: 230,
      discounted_price: 100
    },
    {
      title: 'title 2',
      description: 'Ad facilisis, penatibus condimentum purus nec auctor dapibus netus justo montes? Pretium at maecenas dictum et interdum mattis ullamcorper lobortis venenatis platea erat! Tortor ipsum proin massa molestie parturient cursus elementum vel congue, himenaeos mauris. Porta est diam curae; pellentesque, scelerisque conubia. Quisque elementum rhoncus blandit metus velit, augue molestie. Sem sociis volutpat sit congue faucibus laoreet sociosqu duis. Mauris elementum gravida justo! Aptent neque in pretium tempor torquent. Litora hendrerit nulla imperdiet. Sapien donec conubia tellus. Auctor magna elit lacus fermentum nascetur? Scelerisque tellus enim.',
      duration: 35,
      price: 230
    },
    {
      title: 'title 3',
      description: 'Ad facilisis, penatibus condimentum purus nec auctor dapibus netus justo montes? Pretium at maecenas dictum et interdum mattis ullamcorper lobortis venenatis platea erat! Tortor ipsum proin massa molestie parturient cursus elementum vel congue, himenaeos mauris. Porta est diam curae; pellentesque, scelerisque conubia. Quisque elementum rhoncus blandit metus velit, augue molestie. Sem sociis volutpat sit congue faucibus laoreet sociosqu duis. Mauris elementum gravida justo! Aptent neque in pretium tempor torquent. Litora hendrerit nulla imperdiet. Sapien donec conubia tellus. Auctor magna elit lacus fermentum nascetur? Scelerisque tellus enim.',
      duration: 35,
      price: 230,
      discounted_price: 100
    }
  ]
};
