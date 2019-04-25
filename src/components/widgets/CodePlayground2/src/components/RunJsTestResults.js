import React, { Component, PropTypes } from 'react';
import { Table, Popover, OverlayTrigger } from 'react-bootstrap';
const uuid = require('node-uuid');
import styles from './RunJsTestResults.module.scss';
import { InlineStatusControl } from '../../../../index';

export default class RunJsTestResults extends Component {
  getStderrView(stderr) {
    return (
      stderr && stderr.length > 0 ?
        <div style={{ padding: 10 }}>
          <div className={styles.stderrTitle}>stderr</div>
          <div className={styles.stderrText}>{stderr}</div>
        </div> :
        null
    );
  }

  getStdoutView(stdout) {
    return (
      stdout && stdout.length > 0 ?
        <div style={{ padding: 10 }}>
          <div className={styles.stdoutTitle}>stdout</div>
          <div className={styles.stdoutText}>{stdout}</div>
        </div> :
        null
    );
  }

  getExecutionFailedView(execution_result) {
    const { stderr, stdout, reason } = execution_result;
    return (
      <div style={{ paddingTop: 10 }}>
        <div className={styles.reasonError}>{reason}</div>
        {this.getStderrView(stderr)}
        {this.getStdoutView(stdout)}
      </div>
    );
  }

  _openPopover(long_txt){
    return(
      <Popover className={styles.popover} id={uuid.v4()}>
        <span>{long_txt}</span>
      </Popover>
    )
  }

  _truncateText(long_txt){
    if (long_txt.length > 40)
      return (
        <OverlayTrigger rootClose={true} placement="top" trigger="click" overlay={this._openPopover(long_txt)}>
          <span style={{ cursor:'pointer' }}>
            {long_txt.substring(0,40)}
            <i className="fa fa-ellipsis-h" style={{background: '#999',color: 'white',padding: '0 5px 0 5px', borderRadius: '6px', float: 'right'}} aria-hidden="true" ></i>
          </span>
        </OverlayTrigger>
      );
    else
      return long_txt;
  }

  getTestCasesResultView(execution_result, test_results) {
    const count = test_results.length;

    let passedCount = 0;
    test_results.forEach((result) => {
      if (result.succeeded) {
        passedCount++;
      }
    });
    const resultClass = (passedCount === count) ? styles.reasonSuccess : styles.reasonError;

    test_results.sort((a, b) => {
      let r1 = a.succeeded ? 2 : 1;
      let r2 = b.succeeded ? 2 : 1;
      return r1 - r2;
    });

    let testsResultRows = null;
    testsResultRows = test_results.map((test, index) => {
      const result_icon = test.succeeded ?
        <i className={'fa fa-check'} style={{ fontSize:15, color:'#4F8A10' }} /> :
        <i className={'fa fa-times-circle'} style={{ fontSize:16, color:'#db1924' }} />

      return (
        <tr key={index}>
          <td>{result_icon}</td>
           <td>{this._truncateText(test.input)}</td>
          <td>{this._truncateText(test.expected_output)}</td>
          <td>{this._truncateText(test.actual_output)}</td>
          <td>{this._truncateText(test.reason)}</td>
        </tr>
      );
    });

    return (
      <div>
        <p className={resultClass}>{`${passedCount} of ${count} tests passed.`}</p>
        <Table responsive bordered style={{ marginBottom:7 }}>
          <thead>
            <tr>
              <th>Result</th>
              <th>Input</th>
              <th>Expected Output</th>
              <th>Actual Output</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {testsResultRows}
          </tbody>
        </Table>
        {this.getStdoutView(execution_result.stdout)}
      </div>
    );
  }

  getResultsView(testExecResult) {
    const { execution_result, test_results } = testExecResult;
    let resultView = null;

    if (execution_result.status === 0) {
      resultView = this.getTestCasesResultView(execution_result, test_results);
    }
    else {
      resultView = this.getExecutionFailedView(execution_result);
    }

    return <div>{resultView}</div>
  }

  render() {
    // console.log('------------RESULTS', this.props);

    const { testExecResult, testExecError, testExecInProgress } = this.props;
    let resultView = null;

    if (testExecResult === null &&
        testExecError === null &&
        testExecInProgress === false) {
      resultView = <div>Click on Test to evaluate your code.</div>
    }
    else if (testExecInProgress) {
      resultView = <InlineStatusControl
                      statusData={{
                        status: 'WAIT', text:'Evaluating code '
                      }}
                   />
    }
    else if (testExecError) {
      resultView = <div className={styles.reasonError}>{testExecError}</div>
    }
    else if (testExecResult) {
      resultView = this.getResultsView(testExecResult);
    }

    return (
      <div className={styles.testResultWrapper}>
        {resultView}
      </div>
      );
  }
}

RunJsTestResults.propTypes = {
  testExecResult     : PropTypes.object,
  testExecError      : PropTypes.object,
  testExecInProgress : PropTypes.bool.isRequired,
};
