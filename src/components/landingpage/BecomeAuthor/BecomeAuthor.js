import styles from './BecomeAuthor.module.scss';
import { Link } from 'react-router';
import React, { Component } from 'react';
import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';
import { connect } from 'react-redux';
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';

@connect()
class BecomeAuthor extends Component {

  openModalWindow(type, e) {
    if(e) e.target.blur(); // remove focus from button

    sendEvent(eventCategory.SIGNUP, eventAction.SIGNUP_INIT_AUTHOR_LANDING, 'GetStarted');

    this.props.dispatch(showModal(type));
  }

  render() {
    return (
      <div className={styles.block}>
        <div className={styles.inn}>
          <div className={styles.left}>
            <h1 className={styles.header}>Become an author</h1>
            <p className={styles.text}>Got questions or feedback? Contact us: <a href="mailto:authors@educative.io?Subject=Hello" target="_top">authors@educative.io</a></p>
          </div>

          <div className={styles.right}>
           <button className={styles.button} onClick={this.openModalWindow.bind(this, ModalTypes.SIGNUP)}>Get Started</button>
          </div>
        </div>
      </div>
    );
  }
}

export default BecomeAuthor;
