import styles from './CheckoutFormInvoice.module.scss';

import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';

import RedeemCoupon from './RedeemCoupon';

@connect(( {payment} ) => {
  return {payment};
})
export default class CheckoutFormInvoice extends Component {

  render() {
    const {payment}   = this.props;
    const workData    = payment.get('workData');
    const total_price = payment.get('total_price');

    return <div className={styles.invoice}>
            <ul className={styles.list}>
              <li>
                <span className={styles.title}>{ workData.title }</span>
                <span className={styles.price}>{ `$${workData.price}` }</span>
              </li>
            </ul>

            <RedeemCoupon/>

            <div className={styles.total}>
              <span className={styles.title}>Total</span>
              <span className={styles.price}>{ `$${total_price.toFixed(2)}` }</span>
            </div>
           </div>;
  }
}