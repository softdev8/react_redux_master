import styles from './SubscribeModal.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {FormControl} from 'react-bootstrap';
import { connect } from 'react-redux';

import ModalHeader from '../ModalHeader/ModalHeader';
import { Btn } from '../../index';
import isLocalStorageAvailable from '../../../utils/isLocalStorageAvailable';
import { SUBSCRIBE_DONT_SHOW_SETTING_NAME } from '../../../constants';
import { subscribeForAnnouncements} from '../../../actions';

@connect(( {router} ) => {
  return { router }
})
export default class SubscribeModal extends Component {

  static PropTypes = {
    // icon node
    closeIcon : PropTypes.object,

    closeModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDontShowMeAgain = this.handleDontShowMeAgain.bind(this);
  }

  componentDidMount(){
    findDOMNode(this.emailRef).focus();
  }

  handleKeyDown(e){
    if(e.key === 'Enter') {
      this.handleSubscribe(e);
    } else if(e.keyCode == 27){ //Escape Key
      this.props.closeModal();
    }
  }

  handleSubscribe(e){
    let email = this.refs.email.getInputDOMNode().value;
    if(email){
      const context = {
        url: this.props.router.location.pathname,
      }
      subscribeForAnnouncements({email, context: JSON.stringify(context)})
      .then((res) => {
        //do nothing
      }).catch((error) => {
        //do nothing
      });
    }

    this.handleDontShowMeAgain(e);
  }

  handleDontShowMeAgain(e) {
    if(isLocalStorageAvailable()) {
      localStorage.setItem(SUBSCRIBE_DONT_SHOW_SETTING_NAME, true);
    }
    this.props.closeModal();
  }

  render() {
    return  <div className={styles.subscribe}>

              { this.props.closeIcon }
              <ModalHeader title='Join Educative Community'/>

              <div className='b-modal__body' style={{textAlign:'center', padding:15}}>
                Subscribe to get updates on the new courses & tutorials straight to your inbox. We never spam.
                <FormControl ref={node => this.emailRef = node} placeholder='Enter Email or press Esc to cancel' groupClassName={styles.subscribe_email} onKeyDown={this.handleKeyDown} />
                <Btn primary onClick={this.handleSubscribe} >
                  Subscribe
                </Btn>
                <Btn link onClick={this.handleDontShowMeAgain} className={styles.dontShownButton} >
                  Don't Show Me This Again
                </Btn>
              </div>

            </div>;
  }
}
