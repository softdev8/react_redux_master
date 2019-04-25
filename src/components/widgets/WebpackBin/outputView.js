import React, { Component, PropTypes } from 'react';
import { InlineStatusControl } from '../../index';
import styles from './outputView.module.scss';

export default class OutputView extends Component {

  static propTypes = {
    outputHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    executionInProgress: PropTypes.bool.isRequired,
    outputUrl: PropTypes.string,
    execError: PropTypes.string,
  };

  render() {
    const { outputUrl, outputHeight, executionInProgress, execError } = this.props;
    const style = {
      height: outputHeight.toString().indexOf('px') === -1 ? `${outputHeight}px` : outputHeight
    };

    if (executionInProgress) {
      return (
        <div className={styles.execInProgress} style={style}>
          <InlineStatusControl
            statusData={{
              status: 'WAIT',
              text: ' Generating output'
            }}
          />
        </div>
      );
    }

    if (execError) {
      return (
        <div className={styles.execError} style={style}>{execError}</div>
      );
    }

    if (outputUrl === null) {
      return (
        <div className={styles.clickRunMsg} style={style}>
          Click Run to view output here.
        </div>
      );
    }

    return (
      <iframe
        className={styles.wrapper}
        style={style}
        src={outputUrl}
      />
    );
  }
}
