import styles from './codejudge.module.scss';

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import { FormControl, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import { connect } from 'react-redux';

import { Btn, SomethingWithIcon, Icons, InlineStatusControl } from '../index';
import { codeJudge } from '../../actions';
import codeJudgeDefaults from './codejudge.defaults';
import CodeJudgeEvaluationCodeEditor from './codejudge.EvaluationCodeEditor';
import CodeJudgeHintsViewer from './codeJudgeHintsViewer';
import JudgeCodeButton from './judgeCodeButton';
const CodeMirrorEditor = require('./codeeditor');
const jsStringEscape = require('js-string-escape');
const uuid = require('node-uuid');
require('../common/ed_util');
require('../widgets/widgets.scss');

@connect(({ ajaxMode:{ enabled }, router:{ params : { user_id, collection_id, page_id } } }) => ({
  isDemo: !enabled,
  author_id: user_id || null,
  collection_id: collection_id || null,
  page_id: page_id || null
}))
export default class CodeJudge extends Component {

  static propTypes = {
    language                 : PropTypes.string.isRequired,
    theme                    : PropTypes.string.isRequired,
    content                  : PropTypes.string.isRequired,
    onlyCodeChanged          : PropTypes.bool.isRequired,
    evaluateWithoutExecution : PropTypes.bool.isRequired,
    solutionContent          : PropTypes.string.isRequired,
    onSolutionContentChange  : PropTypes.func.isRequired,
    showSolution             : PropTypes.bool.isRequired,
    comp_id                  : PropTypes.string,

    judgeContent             : PropTypes.shape({
      authorCode             : PropTypes.string.isRequired,
      edCode                 : PropTypes.string.isRequired,
      version                : PropTypes.string.isRequired,
      test_output_on_console : PropTypes.bool,
      userCodeStringFormat   : PropTypes.string,
    }),

    judgeHints               : PropTypes.array,
    onJudgeHintsUpdate       : PropTypes.func.isRequired,

    judgeContentPrepend      : PropTypes.string.isRequired,

    readOnly                 : PropTypes.bool.isRequired,
    onJudgeContentChange     : PropTypes.func.isRequired,

    // optional param from redux model
    isDemo                   : PropTypes.bool,
    author_id                : PropTypes.number,
    collection_id            : PropTypes.number,
    page_id                  : PropTypes.string,
    isDraft                  : PropTypes.bool.isRequired,
  };


  constructor(props) {
    super(props);

    this.generateStubEvaluationCode = this.generateStubEvaluationCode.bind(this);
    this.generateStubEvaluationCodeForConsole = this.generateStubEvaluationCodeForConsole.bind(this);
    this.getEdCodeAndVersionDefaults = this.getEdCodeAndVersionDefaults.bind(this);
    this.handleAuthorContentChange = this.handleAuthorContentChange.bind(this);
    this.handleExpandCollapse = this.handleExpandCollapse.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleStdinChange = this.handleStdinChange.bind(this);
    this.handleStdinEnable = this.handleStdinEnable.bind(this);
    this.changeJudgeType = this.changeJudgeType.bind(this);
    this._truncateText = this._truncateText.bind(this);

    this.state = {
      executionInProgress: false,
      stdin: '',
      enableStdin: false,
      executionComplete: false,
      executionResult: null,
      testResult: null,
      testPassed: null,
      testPaneActive: true,
      outputExpanded: false,
      solutionInView: false,
      judgeHintsInView: false,
    };
  }

  componentDidMount() {
    if (!this.props.judgeContent) {
      this.props.onJudgeContentChange({
        authorCode: codeJudgeDefaults[this.props.language].testresults.authorCode,
        edCode: codeJudgeDefaults[this.props.language].testresults.edCode,
        version: codeJudgeDefaults[this.props.language].testresults.version,
        userCodeStringFormat: codeJudgeDefaults[this.props.language].testresults.userCodeStringFormat || null,
        test_output_on_console: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.setState({
        oldLanguage: this.props.language,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.oldLanguage) {

      this.reportUpdatedLanguageDefaults(this.state.oldLanguage, this.props.language);

      this.setState({
        oldLanguage: null,
      });
    }
  }

  handleRun(e) {
    e.stopPropagation();

    this.setState({
      executionInProgress: !this.state.executionInProgress,
      executionComplete: false,
      outputExpanded: true
    });

    let source_code = '';

    if (this.props.evaluateWithoutExecution &&
        this.props.judgeContent.userCodeStringFormat) {
      const appendUserCodeAsString = this.props.judgeContent.userCodeStringFormat.format(jsStringEscape(this.props.content)) + '\n';
      source_code += appendUserCodeAsString;
    }

    if (this.props.judgeContentPrepend.trim().length > 0) {
      source_code += this.props.judgeContentPrepend.trim() + '\n';
    }

    if (!this.props.evaluateWithoutExecution) {
      source_code += this.props.content + '\n';
    }

    source_code += this.props.judgeContent.authorCode + '\n' +
                   this.props.judgeContent.edCode + '\n';


    // const source_code = `${appendUserCodeAsString}\n${this.props.judgeContentPrepend}\n${userCodeContent}\n${this.props.judgeContent.authorCode}\n${this.props.judgeContent.edCode}`;
    const { author_id, collection_id, page_id, isDraft } = this.props;

    codeJudge({
      language: this.props.language,
      source_code,
      stdin: this.state.stdin,
      test_output_on_console: !!this.props.judgeContent.test_output_on_console,
      author_id,
      collection_id,
      page_id,
      is_draft_page: isDraft,
      comp_id: this.props.comp_id || null
    }).then((res) => {
      const result = JSON.parse(res);

      let passedCount = 0;
      for (let i = 0; i < result.test_results.length; i++) {
        if (result.test_results[i].succeeded) {
          passedCount++;
        }
      }

      const testPassed = passedCount === result.test_results.length;

      this.setState({
        executionInProgress: false,
        executionComplete: true,
        executionResult: result.execution_result,
        testResult: result.execution_result.status === 0 ? result.test_results : null,
        testPassed: result.execution_result.status === 0 ? testPassed : false,
        testPassedCount: passedCount,
        testTotalCount: result.test_results.length,
        testPaneActive: result.execution_result.status === 0 ? true : false,
      });
    }).catch((error) => {
      console.log(error);
      this.setState({
        executionInProgress: false,
        executionComplete: true,
        testResult: null,
        testPaneActive: false,

        executionResult: {
          reason : error.status !== 401 ? error.responseText : 'Please login to use code judge.',
        },
      });
    });
  }

  reportUpdatedLanguageDefaults(oldLanguage, newLanguage) {
    // If judge is not supported for the new language,
    // keep content for the old one.
    let newLang = newLanguage;
    if (!codeJudgeDefaults[newLang]) {
      newLang = oldLanguage;
    }

    const test_output_on_console = this.props.judgeContent ? !!this.props.judgeContent.test_output_on_console : false;
    let authorCode = codeJudgeDefaults[newLang].testresults.authorCode;

    if (test_output_on_console) {
      authorCode = codeJudgeDefaults[newLang].console.authorCode;
    }

    if (this.props.judgeContent && this.props.judgeContent.authorCode && this.props.judgeContent.authorCode !== '') {
      authorCode = this.props.judgeContent.authorCode;
    }

    const defaults = this.getEdCodeAndVersionDefaults(
      test_output_on_console,
      newLang);

    this.props.onJudgeContentChange({
      authorCode,
      edCode: defaults.edCode,
      version: defaults.version,
      test_output_on_console: defaults.test_output_on_console,
      userCodeStringFormat: defaults.userCodeStringFormat
    }, true);
  }

  handleStdinEnable() {
    this.setState({
      enableStdin: !this.state.enableStdin,
      stdin: '',
    });
  }

  handleStdinChange(e) {
    this.setState({
      stdin: e.target.value,
    });
  }

  getEdCodeAndVersionDefaults(test_output_on_console, language) {
    let edCode = codeJudgeDefaults[language].testresults.edCode;
    let version = codeJudgeDefaults[language].testresults.version;
    let userCodeStringFormat = codeJudgeDefaults[language].testresults.userCodeStringFormat || null;

    if (test_output_on_console) {
      edCode = codeJudgeDefaults[language].console.edCode;
      version = codeJudgeDefaults[language].console.version;
      userCodeStringFormat = codeJudgeDefaults[language].console.userCodeStringFormat;
      test_output_on_console = true;
    }

    return {
      edCode,
      version,
      test_output_on_console,
      userCodeStringFormat,
    };
  }

  handleExpandCollapse() {
    this.setState({
      outputExpanded: !this.state.outputExpanded
    });
  }

  changeJudgeType(value) {
    const test_output_on_console = value === 'console';

    const defaults = this.getEdCodeAndVersionDefaults(
      test_output_on_console,
      this.props.language);

    let authorCode = codeJudgeDefaults[this.props.language].testresults.authorCode;

    if (test_output_on_console) {
      authorCode = codeJudgeDefaults[this.props.language].console.authorCode;
    }

    if (this.props.judgeContent && this.props.judgeContent.authorCode && this.props.judgeContent.authorCode !== '') {
      authorCode = this.props.judgeContent.authorCode;
    }

    this.props.onJudgeContentChange({
      authorCode,
      edCode: defaults.edCode,
      version: defaults.version,
      test_output_on_console,
      userCodeStringFormat: defaults.userCodeStringFormat
    }, true);
  }

  handleAuthorContentChange(e) {
    const defaults = this.getEdCodeAndVersionDefaults(
      this.props.judgeContent ? !!this.props.judgeContent.test_output_on_console : false,
      this.props.language);

    this.props.onJudgeContentChange({
      authorCode: e,
      edCode: defaults.edCode,
      version: defaults.version,
      test_output_on_console: defaults.test_output_on_console,
      userCodeStringFormat: defaults.userCodeStringFormat,
    });
  }

  generateStubEvaluationCode() {
    this.props.onJudgeContentChange({
      authorCode: codeJudgeDefaults[this.props.language].testresults.authorCode,
      edCode: codeJudgeDefaults[this.props.language].testresults.edCode,
      version: codeJudgeDefaults[this.props.language].testresults.version,
      userCodeStringFormat: codeJudgeDefaults[this.props.language].testresults.userCodeStringFormat || null,
      test_output_on_console: false,
    }, true);
  }

  generateStubEvaluationCodeForConsole() {
    this.props.onJudgeContentChange({
      authorCode: codeJudgeDefaults[this.props.language].console.authorCode,
      edCode: codeJudgeDefaults[this.props.language].console.edCode,
      version: codeJudgeDefaults[this.props.language].console.version,
      userCodeStringFormat: codeJudgeDefaults[this.props.language].console.userCodeStringFormat || null,
      test_output_on_console: true,
    }, true);
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

  _openPopover(long_txt){
    return(
      <Popover className={styles.popover} id={uuid.v4()}>
        <span>{long_txt}</span>
      </Popover>
    )
  }

  render() {
    const { executionComplete, executionResult, testResult, testPassed,
      testPassedCount, testTotalCount, testPaneActive } = this.state;

    if (this.props.isDemo) {
      return (<div style={{ textAlign:'center' }}>Code Judge not available in demo mode</div>);
    }

    let executionResultDiv = null;
    if (executionComplete && testResult && testPaneActive) {
      const reasonClass = testPassed ? styles.reason_success : styles.reason_error;

      testResult.sort((a, b) => {
        let r1 = a.succeeded ? 2 : 1;
        let r2 = b.succeeded ? 2 : 1;
        return r1 - r2;
      });

      let testsResultRows = null;
      testsResultRows = testResult.map((test, index) => {
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

      const table = (
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
      );


      executionResultDiv = (<div className={styles.executon_result}>
                          <p className={reasonClass}>{`${testPassedCount} of ${testTotalCount} tests passed.`}</p>
                          {table}
                        </div>);
    } else if (executionComplete && executionResult) {
      const reasonClass = executionResult.status === 0 ? styles.reason_success : styles.reason_error;
      executionResultDiv = (<div className={styles.executon_result}>
                          <p className={reasonClass}>{executionResult.reason}</p>
                          {executionResult.compilation_result ? <p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.compilation_result }</p> : null}
                          {executionResult.stdout ? <div><p className={styles.stdlabels}>stdout</p><p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.stdout }</p></div> : null}
                          {executionResult.stderr ? <div><p className={styles.stdlabels}>stderr</p><p style={{ whiteSpace:'pre-wrap' }}>{ executionResult.stderr }</p></div> : null}
                        </div>);
    }

    const codeEditorContent = {
      content: this.props.judgeContent ? this.props.judgeContent.authorCode : '',
      language: this.props.language,
      theme: this.props.theme,
    };

    const solutionContent = {
      content: this.props.solutionContent,
      language: this.props.language,
      theme: this.props.theme,
    };

    const judgeContentPrepend = {
      content: this.props.judgeContentPrepend,
      language: this.props.language,
      theme: this.props.theme,
    }

    const test_output_on_console = this.props.judgeContent ? !!this.props.judgeContent.test_output_on_console : false;

    return  (<div>
                {
                  !this.props.readOnly &&
                  <CodeJudgeEvaluationCodeEditor
                    test_output_on_console={test_output_on_console}
                    language={this.props.language}
                    changeJudgeType={this.changeJudgeType}
                    generateStubEvaluationCode={test_output_on_console ? this.generateStubEvaluationCodeForConsole : this.generateStubEvaluationCode}
                    codeContent={codeEditorContent}
                    onlyCodeChanged={this.props.onlyCodeChanged}
                    onEditorChange={this.handleAuthorContentChange}
                    solutionContent={solutionContent}
                    onSolutionContentChange={this.props.onSolutionContentChange}
                    judgeHints={this.props.judgeHints}
                    onJudgeHintsUpdate={this.props.onJudgeHintsUpdate}
                    judgeContentPrepend={judgeContentPrepend}
                    onJudgeContentPrependChange={this.props.onJudgeContentPrependChange}
                  />
                }

                <div className={styles.run}>
                  <JudgeCodeButton onClick={this.handleRun} executionInProgress={false} />
                  {
                    this.props.judgeHints && this.props.judgeHints.length > 0 &&
                    <Btn default className={styles.stdin_button} style={{ textTransform:'none' }}
                      onClick={() => this.setState({ judgeHintsInView: !this.state.judgeHintsInView }) }
                    >
                      {this.state.judgeHintsInView ? 'Hide Hint' : 'Need Hint?'}
                    </Btn>
                  }
                  {
                    this.props.showSolution &&
                    <Btn default className={styles.stdin_button} style={{ textTransform:'none' }}
                      onClick={() => this.setState({ solutionInView: !this.state.solutionInView }) }
                    >
                      {this.state.solutionInView ? 'Hide Solution' : 'Show Solution'}
                    </Btn>
                  }
                  <ReactCSSTransitionGroup
                    transitionName="runnable"
                    transitionEnter={true}
                    transitionEnterTimeout={500}
                    transitionLeave={true}
                    transitionLeaveTimeout={500}>
                    {
                      this.state.judgeHintsInView &&
                      <div style={{ margin:10, padding:5 }}>
                        <CodeJudgeHintsViewer judgeHints={this.props.judgeHints} />
                      </div>
                    }
                  </ReactCSSTransitionGroup>
                  <ReactCSSTransitionGroup
                    transitionName="runnable"
                    transitionEnter={true}
                    transitionEnterTimeout={500}
                    transitionLeave={true}
                    transitionLeaveTimeout={500}>
                    {
                      this.state.solutionInView &&
                      <div style={{ border:'1px solid #58bd91', borderRadius:5, margin:10, padding:5 }}>
                        <CodeMirrorEditor
                          codeContent={solutionContent}
                          readOnly
                        />
                      </div>
                    }
                  </ReactCSSTransitionGroup>
                  <ReactCSSTransitionGroup
                    transitionName="runnable"
                    transitionEnter={true}
                    transitionEnterTimeout={500}
                    transitionLeave={true}
                    transitionLeaveTimeout={500}>
                    {
                      this.state.outputExpanded ?
                      <div
                        className={this.state.executionInProgress ?
                            styles.initial_height : styles.limit_height}
                        style={{ borderTop:'2px solid rgb(64,181,255)', marginTop:10, padding:5 }}
                      >
                        <div style={{ width:'100%', display:'block' }}>
                          <i>
                            <Btn small default link onClick={() => {this.setState({ testPaneActive:true });}} style={{ textTransform:'none' }}>Test Results</Btn>
                            <Btn small default link onClick={() => {this.setState({ testPaneActive:false });}} style={{ textTransform:'none' }}>Show Console</Btn></i>
                            <Btn small default link onClick={this.handleExpandCollapse} style={{ textTransform:'none', float:'right' }}><SomethingWithIcon icon={Icons.closeIcon}/></Btn>
                        </div>
                        <div className={styles.input_output}>
                          {this.state.enableStdin ? <FormControl type="textarea" value={this.state.stdin} placeholder="stdin" groupClassName={styles.stdin} onChange={this.handleStdinChange} /> : null}
                          {this.state.executionInProgress ? <InlineStatusControl statusData={{ status: 'WAIT', text:'Code Execution in progress' }}/> : null}
                          {executionResultDiv ? executionResultDiv : !this.state.executionInProgress && 'Press Judge to execute'}
                        </div>
                      </div> : null
                    }
                  </ReactCSSTransitionGroup>
                </div>
            </div>);
  }
}