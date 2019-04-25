import styles from './CheckoutModal.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {CheckoutForm} from '../../index';

import {setPaymentWorkData} from '../../../actions';

@connect(( {modals} ) => {
  return {modals} 
})
export default class CheckoutModal extends Component {

  static PropTypes = {
    closeIcon : PropTypes.node,
  };

  componentDidMount() {
    this.props.dispatch(setPaymentWorkData(this.props.modals.get('params')));
  }

  render() {

    return  <div className={styles.checkout}>

              { this.props.closeIcon }

              <CheckoutForm/>

            </div>;
  }
}