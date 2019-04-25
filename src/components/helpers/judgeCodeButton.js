import React, { Component, PropTypes } from 'react';
import styles from './judgeCodeButton.module.scss';

export default class JudgeCodeButton extends Component {
  render() {
    const { executionInProgress, onClick } = this.props;
    return (
      <button
        className={styles.runButton}
        disabled={executionInProgress}
        onClick={onClick}
      >
        <i className={'fa fa-flask'} style={{ marginRight:7 }} />
        Test
      </button>
    );
  }
}

JudgeCodeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  executionInProgress: PropTypes.bool.isRequired,
};
