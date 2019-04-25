import React, { Component, PropTypes } from 'react';
import styles from './runButton.module.scss';

export default class RunButton extends Component {
  render() {
    const { executionInProgress, onClick } = this.props;
    return (
      <button
        className={styles.runButton}
        disabled={executionInProgress}
        onClick={onClick}
      >
        Run
      </button>
    );
  }
}

RunButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  executionInProgress: PropTypes.bool.isRequired,
};
