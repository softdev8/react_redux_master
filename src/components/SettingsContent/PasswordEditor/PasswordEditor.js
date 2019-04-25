import styles from './PasswordEditor.module.scss';

import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';
import {FormControl} from 'react-bootstrap';

import {Btn} from '../../index';

export default class PasswordEditor extends Component {

  static PropTypes = {
    updatePassword : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {

    return <form className={styles.password} name={node => this.passwordRef = node} ref='password' onSubmit={this.onSubmit}>
            <FormControl type='password' name='password' required placeholder='Enter Current Password'/>
            <FormControl type='password' name='new_password' required placeholder='Enter New Password'/>
            <FormControl type='password' name='new_password_confirm' required placeholder='Retype New Password'/>
            <Btn secondary className={styles.change} text='Change Password' type='submit'/>
           </form>;
  }

  onSubmit(e) {
    e.preventDefault();

    let newPassword = this.collectData();

    this.props.updatePassword(newPassword);
  }

  collectData() {
    const form = this.passwordRef;
    const inputs = form.elements;

    let result = {};

    for(let i = 0; i < inputs.length; i++) {
      if(!inputs[i].name) continue;

      result[inputs[i].name] = inputs[i].value;
    }

    return result;
  }
}