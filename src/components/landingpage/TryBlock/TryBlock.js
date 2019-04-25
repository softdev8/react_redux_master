import styles from './TryBlock.module.scss';
import { Link } from 'react-router'
import React, { Component } from 'react';

class TryBlock extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles.inn}>
          <h1 className={styles.header}>Best toolset to teach online</h1>
          <h4 className={styles.text}>Educative provides the best toolset to quickly create interactive & visually immersive courses for software engineers. We believe that learning by doing is the best way to learn. University professors, industry leaders, technical writers, and subject matter experts in computer science - become a part of this journey.
          Online Coding Exercises, Data Structures, Matrices or SVGs, In-browser Code Execution in your lessons, and Quizzes are few examples of the widgets.</h4>
          <h4 style ={{ marginBottom: '25px' }}><Link to={'/demo'} style={{ 'text-decoration' : 'underline', 'font-weight' : 300 }}>Test Drive our Editor</Link></h4>
        </div>
        <div className={styles.widgets_image_container}>
          <img className={styles.widgets_image} src="/imgs/landing/widgets.png" href="demo"/>
        </div>
      </div>
    );
  }
}

export default TryBlock;
