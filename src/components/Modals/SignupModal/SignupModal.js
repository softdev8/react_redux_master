import styles from './SignupModal.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {SignupForm} from '../../index';
import ModalFooter from '../ModalFooter/ModalFooter';

import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';

@connect( state => ({}) )
export default class SignupModal extends Component {

  static PropTypes = {
    // icon node
    closeIcon : PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      status : null,
    }
  }

  render() {

    const footer = <ModalFooter helpers={this.getFooterHelpers()}/>

    return  <div className={styles.register}>

              { this.props.closeIcon }

              <SignupForm isModal footer={footer}/>

            </div>;
  }

  getFooterHelpers() {
    return [{
      text     : 'Have an account?',
      linkText : 'Login',
      method   : () => { this.props.dispatch(showModal(ModalTypes.LOGIN)); },
    }, {
      text     : '',
      linkText : 'Forgot password',
      method   : () => { this.props.dispatch(showModal(ModalTypes.RECOVER)); },
    }];
  }

}