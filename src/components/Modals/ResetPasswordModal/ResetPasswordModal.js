import styles from './ResetPasswordModal.module.scss';

import React, {Component, PropTypes} from 'react';

import {ResetPasswordForm} from '../../index';

export default class ResetPasswordModal extends Component {

  static PropTypes = {
    openAnotherModal : PropTypes.func,

    // icon node
    closeIcon : PropTypes.object,
  };

  render() {

    return  <div className={styles.reset}>

              { this.props.closeIcon }

                <ResetPasswordForm/>

            </div>;
  }
}