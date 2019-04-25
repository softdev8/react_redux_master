import styles from './LoginModal.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {LoginForm} from '../../index';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';

import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';

@connect(( {modals} ) => {
  return {modals};
})
export default class LoginModal extends Component {

  static PropTypes = {
    closeIcon : PropTypes.node,
  };

  render() {

    const footer = <ModalFooter helpers={this.getFooterHelpers()}/>

    return  <div className={styles.login}>

              { this.props.closeIcon }

              <LoginForm isModal params={this.props.modals.params} footer={footer}/>

            </div>;
  }

  getFooterHelpers() {
    return [{
      text     : 'Don\'t have an account?',
      linkText : 'Signup',
      method   : () => { this.props.dispatch(showModal(ModalTypes.SIGNUP)); },
    }, {
      text     : '',
      linkText : 'Forgot Password',
      method   : () => { this.props.dispatch(showModal(ModalTypes.RECOVER)); },
    }];
  }
}