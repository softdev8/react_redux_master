import React from 'react'
import { findDOMNode } from 'react-dom';
import {Link} from 'react-router';
import Icon from '../components/common/Icon';
import PaymentDropIn from './widgets/paymentDropIn.js'
import { FormControl } from 'react-bootstrap';
import Button from './common/Button';

import {postBraintreeBuyRequest} from '../actions'

class Payment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onApplyCoupon = this.onApplyCoupon.bind(this);
    this.onNonceReceived = this.onNonceReceived.bind(this);
    this.onReady = this.onReady.bind(this);

    this.state = {
      originalPrice: props.price,
      appliedCouponCode: null,
      priceWithCoupon: null,
      transactionId: null,
    };
  }

  onApplyCoupon() {
    const couponCode = findDOMNode(this.couponCodeInputRef).value;

    console.log('Apply coupon code', couponCode);

    if (couponCode == "hello") { // ajax success
      this.setState({
        appliedCouponCode: couponCode,
        priceWithCoupon: 0,
      });
    }
    else if (couponCode == "hello2") { // ajax success2
      this.setState({
        appliedCouponCode: couponCode,
        priceWithCoupon: 10,
      });
    }
    else { //failure
      this.setState({
        appliedCouponCode: null,
        priceWithCoupon: null,
      });
    }
  }

  onNonceReceived(timeStamp, nonce) {
    postBraintreeBuyRequest({
      transaction_id: this.state.transactionId,
      author_id: this.props.authorId,
      work_id: this.props.workId,
      coupon: this.state.appliedCouponCode,
      payment_method_nonce: nonce,
    }).then(()=>{
      // TODO: close modal.
      // Show success.
    }).catch((err)=>{
      // TODO: show failure.
      // @support
      console.log(err);
    });
  }

  onReady(transactionId) {
    this.state.transactionId = transactionId;
  }

  render() {
    let priceWithCoupon = null;
    if (this.state.priceWithCoupon != null) {
      const priceStr = "Price with coupon '{0}': {1}".format(
                        this.state.appliedCouponCode,
                        this.state.priceWithCoupon);
      priceWithCoupon = <label>{priceStr}</label>;
    }

    let dropIn = null;
    if (this.state.priceWithCoupon == null ||
        this.state.priceWithCoupon != 0) {
      dropIn = <PaymentDropIn onNonceReceived={this.onNonceReceived}
                              onReady={this.onReady}/>;
    }
    else {
      dropIn = <Button style={{marginLeft:5 }} sm outlined bsStyle='darkgreen45' onClick={this.ongetTitle}>
            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
            Get
        </Button>
    }

    return (
      <div>
        <label>Title: {this.props.title}</label>
        <label>Price: {this.props.price}</label>
        {priceWithCoupon}
        <label>Coupon</label>
        <FormControl type='text' style={{marginLeft:8 , marginRight:8, width:'200px', display:'inline'}}
                     ref={(node) => this.couponCodeInputRef = node}/>
        <Button style={{marginLeft:5 }} sm outlined bsStyle='darkgreen45'
                  onClick={this.onApplyCoupon}>
            <Icon glyph='fa fa-plus' style={{fontSize:15}}/>
            Apply
        </Button>
        {dropIn}
      </div>
    );
  }
}

Payment.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Payment;
