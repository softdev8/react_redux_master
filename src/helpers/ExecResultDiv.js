import React, { Component, PropTypes } from 'react';

export default class ExecResultDiv extends Component {

  render() {
    const { styles, rendered_output, className, reasonClass, executionResult } = this.props;

    if(this.props.treatOutputAsHTML){
      return (<div className={className}>
                {rendered_output}
                <p className={reasonClass}>{executionResult.reason}</p>
                {executionResult.compilation_result ? <p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.compilation_result }</p> : null}
                {executionResult.stdout ? <div key="html_output" dangerouslySetInnerHTML={{ __html: executionResult.stdout }}></div> : null}
                {executionResult.stderr ? <div><p className={styles.stdlabels}>stderr</p><p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.stderr }</p></div> : null}
              </div>)
    }
    else{
      return (<div className={className}>
                {rendered_output}
                <p className={reasonClass}>{executionResult.reason}</p>
                {executionResult.compilation_result ? <p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.compilation_result }</p> : null}
                {executionResult.stdout ? <div key="stdout"><p className={styles.stdlabels}>stdout</p><p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.stdout }</p></div> : null}
                {executionResult.stderr ? <div><p className={styles.stdlabels}>stderr</p><p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.stderr }</p></div> : null}
              </div>)
    }
  }
}

