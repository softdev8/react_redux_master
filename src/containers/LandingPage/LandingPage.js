import React, {Component, PropTypes} from 'react';

import {Header, Btn, ModalWindow,
        LandingFeature} from '../../components';

import { ModalTypes } from '../../constants';
import { showModal } from '../../actions';
import { connect } from 'react-redux';

@connect()
export default class LandingPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='b-page b-page_landing b-landing'>
        <Header/>
        <div className='b-page__content'>
          <Btn secondary onClick={this.openModalWindow.bind(this, ModalTypes.LOGIN)}>Login</Btn>
          <Btn primary onClick={this.openModalWindow.bind(this, ModalTypes.SIGNUP)}>Register</Btn>
          <Btn secondary onClick={this.openModalWindow.bind(this, ModalTypes.RECOVER)}>Recover password</Btn>
          <Btn primary onClick={this.openModalWindow.bind(this, ModalTypes.RESETPASSWORD)}>Reset password</Btn>
          <Btn secondary onClick={this.openModalWindow.bind(this, ModalTypes.TOS)}>Terms of service</Btn>
          <Btn primary onClick={this.openModalWindow.bind(this, ModalTypes.PP)}>Privacy policy</Btn>
        </div>

        <LandingFeature/>

        <div className='container'>
          <div className='b-page__content'>

          </div>
        </div>
      </div>
    );

  }


  openModalWindow(type, e) {
    if(e) e.target.blur(); // remove focus from button
    
    this.props.dispatch(showModal(type));

  }

}