import React, { Component, PropTypes } from 'react';
import styles from './runCodeButton.module.scss';

export default class RunCodeButton extends Component {
  render() {
    const { executionInProgress, onClick } = this.props;
    return (
      <button
        className={styles.runButton}
        disabled={executionInProgress}
        onClick={onClick}
      >
        <i className={'fa fa-play'} style={{ marginRight:7 }} />
        Run
      </button>
    );
  }
}

RunCodeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  executionInProgress: PropTypes.bool.isRequired,
};
