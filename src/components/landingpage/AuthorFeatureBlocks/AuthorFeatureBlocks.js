import styles from './AuthorFeatureBlocks.module.scss';

require('typed.js');
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
// import scrollTo from '../../../utils/scrollTo';
const animatedScrollTo = require('animated-scrollto');
import { eventCategory, eventAction, sendEvent } from '../../../utils/edGA';

class ReaderFeatureBlocks extends Component {

  componentDidMount() {
    $(this.refs.typed_main_text).typed({
      strings: ['Easy to use WYSIWYG Editor', 'Simple Revenue Sharing Model', 'Build Complex Visualizations in a few clicks', 'Execute Code in Multiple Languages', 'Create Coding Quizzes with Online Judge', 'Publish for Free'],
      typeSpeed: 20,
      // backspacing speed
      backSpeed: 25,
      // time before backspacing
      backDelay: 2000,
      loop: true,
      showCursor: true,
    });
  }

  onFeaturedClick = () => {
    const featuredNode = document.getElementById('featured');
    const featuredTop = featuredNode.offsetTop - 60;

    // scrollTo(featuredTop);
    animatedScrollTo(
      document.getElementById('app-container'),
      featuredTop,
      500
    );

    sendEvent(eventCategory.VIEW, eventAction.VIEW_AUTHOR_LANDING_COURSES);
  };

  onHowItWorksClick = () => {
    const timelineNode = document.getElementById('timeline');
    const timelineTop = timelineNode.offsetTop;

    // scrollTo(featuredTop);
    animatedScrollTo(
      document.getElementById('app-container'),
      timelineTop,
      500
    );

    sendEvent(eventCategory.VIEW, eventAction.VIEW_AUTHOR_HOWITWORKS);
  };

  onSignUpClick = () => {
    window.location = '/signup';
  };

  render() {

    const leftBlock = classnames(styles.block, styles.block_big, styles.green);
    const featuredBtn = classnames(styles.button, styles.arrow, styles.arrow_bottom);
    return (
      <div className={styles.blocks}>
        <div className={leftBlock}>
          <div className={styles.inn}>
            <p className={styles.text} style={{ fontStyle:'italic', color: '#B8B7B7' }}></p>
            <p className={styles.text}>
              Create and Publish Interactive Courses (paid or free)
              <p className={styles.text}>
                <span ref="typed_main_text"></span>
              </p>
            </p>
            <div className={styles.buttons}>
              <button className={featuredBtn}>
                <Link to={'/demo'}>Try our Editor
                </Link>
              </button>
              <button className={featuredBtn} onClick={this.onHowItWorksClick}>How It Works!</button>
              <button className={featuredBtn} onClick={this.onFeaturedClick}>Examples</button>
              {/*<button className={featuredBtn} onClick={this.onSignUpClick}>Start Writing</button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReaderFeatureBlocks;
