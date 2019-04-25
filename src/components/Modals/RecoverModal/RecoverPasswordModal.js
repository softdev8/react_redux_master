import styles from './RecoverPasswordModal.module.scss';

import React, {Component, PropTypes} from 'react';

import {ForgotPasswordForm} from '../../index';
import ModalFooter from '../ModalFooter/ModalFooter';

export default class RecoverPasswordModal extends Component {

  static PropTypes = {
    // icon node
    closeIcon : PropTypes.object,
  };

  render() {
    const footer = <ModalFooter helpers={this.getFooterHelpers()}/>

    return  <div className={styles.recover}>

              { this.props.closeIcon }
              <ForgotPasswordForm isModal footer={footer}/>

            </div>;
  }

  getFooterHelpers() {
    return [{
      text     : '',
      method   : () => { this.props.dispatch(showModal(ModalTypes.LOGIN)); },
      linkText : 'Login',
    }];
  }
}
