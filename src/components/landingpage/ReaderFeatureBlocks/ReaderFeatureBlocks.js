import styles from './ReaderFeatureBlocks.module.scss';

require('typed.js');
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
// import scrollTo from '../../../utils/scrollTo';
import { ModalTypes } from '../../../constants';
import { showModal } from '../../../actions';
import { connect } from 'react-redux';
const animatedScrollTo = require('animated-scrollto');
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';

@connect()
class ReaderFeatureBlocks extends Component {

  componentDidMount() {
      $(this.refs.typed_main_text).typed({
          strings: ['Learn Faster by Doing', 'Self-paced Courses', 'Visualize Complex Algorithms', 'Step-by-step Explanations', 'Hands-on Coding Exercises', 'Run Code from Browser'],
          typeSpeed: 10,
          // backspacing speed
          backSpeed: 10,
          // time before backspacing
          backDelay: 5000,
          loop: true,
          showCursor: true,
      });
  }

  onFeaturedClick = () => {
    const featuredNode = document.getElementById('featured');
    const featuredTop = featuredNode.offsetTop - 60;

    // scrollTo(featuredTop);

    // Option1
    // document.getElementById('app-container').scrollTop = featuredTop;
    // Option2
    // document.getElementById('featured').scrollIntoView();

    animatedScrollTo(
        document.getElementById('app-container'),
        featuredTop,
        500
    );

    sendEvent(eventCategory.VIEW, eventAction.VIEW_LANDING_COURSES);
  };

  onSignupClicked = (e) => {
    if(e) e.target.blur(); // remove focus from button

    sendEvent(eventCategory.SIGNUP, eventAction.SIGNUP_INIT_LANDING, 'RegisterForFree');

    this.props.dispatch(showModal(ModalTypes.SIGNUP));
  }

  render() {

    const leftBlock = classnames(styles.block, styles.block_big, styles.green);
    // const featuredBtn = classnames(styles.button, styles.arrow, styles.arrow_bottom);
    return (
      <div className={styles.blocks}>
        <div className={leftBlock}>
          <div className={styles.inn}>
            <p className={styles.text1}>
              Interactive Courses for Software Developers
            </p>
            <p className={styles.text}>
                <span ref="typed_main_text"></span>
            </p>

            <div className={styles.buttons}>
              <button className={styles.landingViewCourse} onClick={this.onFeaturedClick}>View Courses</button>
              <button className={styles.landingRegisterFree} onClick={this.onSignupClicked}>Create Free Account</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReaderFeatureBlocks;
