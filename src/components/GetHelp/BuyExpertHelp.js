import styles from './BuyExpertHelp.module.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { showModal } from '../../actions';
import { ModalTypes } from '../../constants';

@connect()
export default class BuyExpertHelp extends Component {
  constructor(props, context) {
    super(props, context);

    this.onPriceClick = this.onPriceClick.bind(this);
  }

  onPriceClick(e) {
    // console.log('onPriceClick ', this.props, e);
    const { title, author_id, collection_id, userInfo, tuition_offer_id,
      price, discounted_price } = this.props;

    if (!userInfo || !userInfo.user_id) {
      this.props.dispatch(showModal(ModalTypes.LOGIN, { ru: `/collection/${author_id}/${collection_id}/experthelp` }));
      return;
    }

    const paramsToCheckout = {
      title,
      author_id,
      work_id: collection_id,
      tuition_offer_id,
      price         : discounted_price !== undefined && discounted_price !== null ? discounted_price : price,
      work_type     : 'work_tuition_sale',
      redirect_url  : `/collection/${author_id}/${collection_id}/experthelp`,
    };

    this.props.dispatch(showModal(ModalTypes.CHECKOUT, paramsToCheckout));
  }

  render() {
    let priceBeforeDiscount = null;
    let price = this.props.price;
    if (this.props.discounted_price) {
      priceBeforeDiscount =
        (<s className={styles.discounted_price_s}>
          <span className={styles.discounted_price}>${this.props.price}</span>
        </s>);
      price = this.props.discounted_price;
    }

    return (
      <div>
        <span
          role="button"
          onClick={this.onPriceClick}
          className={styles['price-accent']}
        >
          Get for ${price}
        </span>
        {priceBeforeDiscount}
      </div>
    );
  }
}

BuyExpertHelp.propTypes = {
  author_id        : PropTypes.string.isRequired,
  collection_id    : PropTypes.string.isRequired,
  price            : PropTypes.number.isRequired,
  title            : PropTypes.string.isRequired,
  tuition_offer_id : PropTypes.number.isRequired,
  dispatch         : PropTypes.func,
  discounted_price : PropTypes.number,
  userInfo         : PropTypes.object
};
