import styles from './RedeemCoupon.module.scss';

import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import {FormControl} from 'react-bootstrap';
import { connect } from 'react-redux';

import {Btn} from '../../index';

import {getCoupon, setCouponData, resetCouponData, setTransactionId, setUserTransactionId} from '../../../actions';

@connect(( {payment} ) => {
  return {payment}
})
export default class RedeemCoupon extends Component {
  constructor(props) {
    super(props);

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.toggleCouponEditor = this.toggleCouponEditor.bind(this);
    this.removeCoupon = this.removeCoupon.bind(this);

    this.state = {
      isEditMode : false,
      couponCode : null,
    }
  }

  componentDidUpdate() {
    if(this.state.isEditMode) {
      const input = findDOMNode(this.inputRef);

      input.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error : nextProps.error,
    });
  }

  onSubmitHandler(e) {
    e.preventDefault();

    this.toggleCouponEditor();

    if(this.state.couponCode) {
      this.addCoupon();
    }
  }

  onChangeHandler(e) {
    this.setState({
      couponCode : e.target.value.trim(),
    });
  }

  render() {

    const {couponCode, isEditMode} = this.state;
    let child = null;

    if(isEditMode) child = this.renderForm();

    else if(couponCode) child = this.renderEnteredCoupon();

    else if(this.props.payment.get('workData').price == 0) child = null;

    else child = this.renderDefaulView();

    const { error } = this.state;

    return <div className={styles.redeem}>
            { child }

            { error && !isEditMode ? <p className={styles.error}>{ error }</p> : null }
           </div>;
  }

  renderForm() {
    return <form onSubmit={this.onSubmitHandler} className={styles.form}>
              <FormControl placeholder='Enter Coupon' name='coupon'
                     ref={node => this.inputRef = node}
                     onChange={this.onChangeHandler}
                     onBlur={this.onSubmitHandler}/>
              <Btn secondary small type='submit' text='Apply'/>
            </form>;
  }

  renderEnteredCoupon() {
    const {couponCode} = this.state;
    const {payment}    = this.props;

    const total_discounted = payment.get('workData').price - payment.get('total_price');

    return <div className={styles.entered}>
            <span className={styles.title}>Coupon</span>
            <span className={styles.coupon}>{ couponCode }</span>
            <i className='fa fa-times' onClick={this.removeCoupon}/>
            <span className={styles.price}>{ `-$${total_discounted.toFixed(2)}` }</span>
           </div>;
  }

  renderDefaulView() {
    return <span className={styles.link} onClick={this.toggleCouponEditor}>Redeem a Coupon</span>
  }

  toggleCouponEditor() {
    this.setState({
      isEditMode : !this.state.isEditMode,

      // reset error message on toggle to edit mode
      error      : this.state.isEditMode && null,
    });
  }

  addCoupon() {
    const workData = this.props.payment.get('workData');
    const { work_id, author_id } = workData;
    const tuition_offer_id = workData.tuition_offer_id || null;
    const { couponCode } = this.state;

    getCoupon({ work_id, author_id, couponCode, tuition_offer_id }).then( couponData => {
      couponData = JSON.parse(couponData);

      if (this.state.error) {
        this.setState({
          error : null,
        });
      }

      this.props.dispatch(setCouponData(couponData));

    }).catch( error => {
      this.setState({
        couponCode : null,
        error      : parseError(error),
      });

      this.props.dispatch(resetCouponData());
    });
  }

  removeCoupon() {
    this.setState({
      couponCode : null,
      error      : null,
    });
    this.props.dispatch(resetCouponData());
    this.props.dispatch(setTransactionId(null));
    this.props.dispatch(setUserTransactionId(null));
  }
}

function parseError(error) {
  let result;

  if(error.statusCode == 404) result = 'Invalid Coupon Code';
  else result = 'Unable to Apply Coupon Code';

  return result;
}
