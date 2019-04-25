import React, { Component, PropTypes } from 'react';
import styles from './runButton.module.scss';

export default class RunButton extends Component {
  render() {
    return (
      <button className={styles.runButton} onClick={this.props.onClick}>
        Run
      </button>
    );
  }
}

RunButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
