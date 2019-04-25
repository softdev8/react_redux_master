import styles from './AuthorHowItWorks.module.scss';

import React, { Component } from 'react';

class PageFeature extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
     return (
      <div className={styles.block}>
        <div className={styles.inn}>
          <h1 id="timeline" style={{ textAlign: 'center', color: '#E17E49' }}>How It Works!</h1>
          <ul className={styles.timeline} style={{ fontStyle: 'italic' }}>
            <li>
              <div className={styles.timeline_badge}><i className="glyphicon glyphicon-plane"></i></div>
              <div className={styles.timeline_panel}>
                <div className={styles.timeline_heading}>
                  <h3 className={styles.timeline_title}>Have an Idea</h3>
                </div>
                <div className={styles.timeline_body}>
                  <p>We know you are an expert on something. Here is your chance to become an author. Think of a course you always wanted to write but never had the tools.</p>
                </div>
              </div>
            </li>
            <li className={styles.timeline_inverted}>
              <div className={styles.timeline_badge + " " + styles.warning}><i className="glyphicon glyphicon-edit"></i></div>
              <div className={styles.timeline_panel}>
                <div className={styles.timeline_heading}>
                  <h3 className={styles.timeline_title}>Write</h3>
                </div>
                <div className={styles.timeline_body}>
                  <p>Use our context aware editor to create visually immersive content. You get all the widgets for your interactive CS articles/courses. If we are missing any features don't hesitate to ask.</p>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.timeline_badge + ' ' + styles.danger}><i className="glyphicon glyphicon-send"></i></div>
              <div className={styles.timeline_panel}>
                <div className={styles.timeline_heading}>
                  <h3 className={styles.timeline_title}>Publish</h3>
                </div>
                <div className={styles.timeline_body}>
                  <p>You always own the rights to your content. Publishing is Free. You can price your content or Keep it Free. </p>
                </div>
              </div>
            </li>
            <li className={styles.timeline_inverted}>
              <div className={styles.timeline_badge + ' ' + styles.info}><i className="glyphicon glyphicon-user"></i></div>
              <div className={styles.timeline_panel}>
                <div className={styles.timeline_heading}>
                  <h3 className={styles.timeline_title}>Make a difference</h3>
                </div>
                <div className={styles.timeline_body}>
                  <p>Make a difference in the world by educating people in a modern way and by providing them with next generation content that will increase their understanding of complex topics.</p>
                </div>
              </div>
            </li>
            <li>
              <div className={styles.timeline_badge + ' ' + styles.success}><i className="glyphicon glyphicon-usd"></i></div>
              <div className={styles.timeline_panel}>
                <div className={styles.timeline_heading}>
                  <h3 className={styles.timeline_title}>Earn</h3>
                </div>
                <div className={styles.timeline_body}>
                  <p>Educative will help build your brand and bring traffic to your content as you earn for your expertise and hardwork.</p>
                  <p>Educative will take care of payments, hosting and availability of your content with absolutely no cost to you.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>);
  }
}

export default PageFeature;
