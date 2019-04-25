import styles from './CodePlayground2.module.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

const jsStringEscape = require('js-string-escape');

import RunJsUtil from './runJsUtil';
import ReactScriptHelper from '../../../../common/reactscripthelper.js';

const EducativeUtil = require('../../../../common/ed_util');
const ViewTabs = require('./ViewTabs');
const ViewOnelinePanels = require('./ViewOnelinePanels');
const ViewResultBelow = require('./ViewResultBelow');
import RunJsTestResults from './RunJsTestResults';
import { codeJudge } from '../../../../../actions';

const listScriptsToLoad = [
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.17.0/babel.min.js',
];

const edJudgeCode = 'var main = function() {\r\n  let results = executeTests(userJsCode, userCssCode, userHtmlCode, userHtmlPage);\r\n  let test_results = []\r\n\r\n  for (let result in results) {\r\n    let jres = {}\r\n    jres[\"succeeded\"] = results[result].succeeded\r\n    jres[\"reason\"] = results[result].reason\r\n    jres[\"input\"] = results[result].input\r\n    jres[\"expected_output\"] = results[result].expected_output\r\n    jres[\"actual_output\"] = results[result].actual_output\r\n\r\n    test_results.push(jres)\r\n  }\r\n\r\n  let output = {\"test_results\": test_results};\r\n  let json_output = JSON.stringify(output);\r\n\r\n  console.log(\"<__educative_test_results__>\" + json_output + \"<\/__educative_test_results__>\");\r\n}\r\n\r\nmain();'

@connect(({ router:{ params : { user_id, collection_id, page_id } } }) => ({
  author_id: user_id || null,
  collection_id: collection_id || null,
  page_id: page_id || null
}))
export default class CodePlayground extends Component {
  constructor(props) {
    super(props);

    this.onCodeChange = this.onCodeChange.bind(this);
    this.onRunClicked = this.onRunClicked.bind(this);
    this.onCompiledHtmlChange = this.onCompiledHtmlChange.bind(this);
    this.isConsoleEnabled = this.isConsoleEnabled.bind(this);
    this.onPaneToggleStateChange = this.onPaneToggleStateChange.bind(this);

    this.state = {
      files: {},
      onlyCodeChanged: false,
      compiledHtml: null,
      testExecResult: null,
      testExecError: null,
      testExecInProgress: false,
      scriptsLoaded: false,
      consoleEnabled: this.isConsoleEnabled(),
      consoleId: `runjs_console_output_${EducativeUtil.getKey()}`,
      paneToggleState: props.jotted.toggleState ||
        {
          html: true, css: true, js: true, result: true,
        },
    };
  }

  componentWillMount() {
    this.updateFilesinState(this.props.jotted.files);
  }

  componentWillReceiveProps(nextProps) {
    this.updateFilesinState(nextProps.jotted.files);
  }

  saveComponent = () => {}

  onCodeChange(type, content, autoRun) {
    const files = this.state.files;
    if (hasOwnProperty.call(files, type)) {
      files[type] = content;
      const newState = {
        files,
        onlyCodeChanged: true,
      };

      if (autoRun) {
        this.getCompiledHtml();
      }

      this.setState(newState);
    } else {
      console.log('Error: onCodeChange: unknown file type', type);
    }
  }

  onPaneToggleStateChange(type, value) {
    const paneToggleState = this.state.paneToggleState;
    paneToggleState[type] = value;
    this.setState({
      paneToggleState,
      onlyCodeChanged: false,
    });
  }

  onCompiledHtmlChange(compiledHtml) {
    this.setState({
      compiledHtml,
    });
  }

  onRunClicked() {
    this.getCompiledHtml();
  }

  onJudgeClicked = () => {
    const jsCodeStringFormat = 'var userJsCode = "{0}";';
    const cssCodeStringFormat = 'var userCssCode = "{0}";';
    const htmlCodeStringFormat = 'var userHtmlCode = "{0}";';
    const htmlPageStringFormat = 'var userHtmlPage = "{0}";';

    const { files, compiledHtml } = this.state;

    const jsCodeString = jsCodeStringFormat.format(jsStringEscape(files['js']));
    const cssCodeString = cssCodeStringFormat.format(jsStringEscape(files['css']));
    const htmlCodeString = htmlCodeStringFormat.format(jsStringEscape(files['html']));
    const htmlPageString = htmlPageStringFormat.format(jsStringEscape(compiledHtml));
    const edCode = jsCodeString + cssCodeString + htmlCodeString + htmlPageString + edJudgeCode;


    const source_code = files['exercise'] + '\n' + edCode;
    const { author_id, collection_id, page_id, isDraft, comp_id } = this.props;

    this.setState({
      testExecResult: null,
      testExecError: null,
      testExecInProgress: true,
    });

    codeJudge({
      language: 'javascript',
      source_code,
      stdin: '',
      test_output_on_console: false,
      author_id,
      collection_id,
      page_id,
      is_draft_page: isDraft,
      comp_id: comp_id || null
    }).then((res) => {
      this.setState({
        testExecResult: JSON.parse(res),
        testExecInProgress: false,
      });
    }).catch((error) => {
      console.log('codeJudge error in runjs', error);
      const errorReason = error.status !== 401 ? error.responseText || error.toString() : 'Please login to use code judge.';
      this.setState({
        testExecError: errorReason,
        testExecInProgress: false,
      })
    });
  }

  getCompiledHtml() {
    const { plugins } = this.props.jotted;
    const { files } = this.state;

    const filesList = [];
    const hiddenJs = files.hiddenjs || '';

    for (const type in files) {
      if (hasOwnProperty.call(files, type) &&
          (type === 'js' || type === 'html' || type === 'css')) {
        filesList.push({
          type,
          content: files[type],
        });
      }
    }

    if (this.state.scriptsLoaded) {
      RunJsUtil.jottedParamsToCompiledHtml(filesList, plugins, hiddenJs, this.onCompiledHtmlChange, this.state.consoleId);
    }
  }

  getCodeFilesAsHash(codeFiles) {
    const files = {};

    for (let i = 0; i < codeFiles.length; i++) {
      const file = codeFiles[i];
      files[file.type] = file.content;
    }

    return files;
  }

  getPropsForViewers() {
    const { jotted, editorMarkerForViewMode, jotted: { hideCss, hideHtml,
      hideJs, hideNav, hideResult, showLineNumbers, pane, height,
      heightCodepanel, plugins, exercise }, default_themes } = this.props;
    const props = {};
    props.default_themes = default_themes;
    props.hideCss = hideCss;
    props.hideHtml = hideHtml;
    props.hideJs = hideJs;
    props.hideNav = hideNav;
    props.hideResult = hideResult;
    props.showLineNumbers = showLineNumbers === undefined ? true : showLineNumbers;
    props.pane = pane;
    props.height = height;
    props.heightCodepanel = heightCodepanel;
    props.plugins = plugins;
    props.readOnly = editorMarkerForViewMode;
    props.onCodeChange = this.onCodeChange;
    props.onRunClicked = this.onRunClicked;
    props.onJudgeClicked = this.onJudgeClicked;
    props.exercise = exercise;
    props.onlyCodeChanged = this.state.onlyCodeChanged;
    props.files = this.state.files;
    props.compiledHtml = this.state.compiledHtml || this.getCompiledHtml();
    props.paneToggleState = this.state.paneToggleState;
    props.onPaneToggleStateChange = this.onPaneToggleStateChange;

    if (jotted.hasOwnProperty('panelsHighlightedLines')) {
      props.panelsHighlightedLines = jotted.panelsHighlightedLines;
    }

    if (jotted.hasOwnProperty('theme')) {
      props.theme = jotted.theme;
    } else {
      props.theme = 'default';
      jotted.plugins.forEach((plugin) => {
        if (plugin.name === 'codemirror' &&
            plugin.options.theme !== undefined) {
          props.theme = plugin.options.theme;
        }
      });
    }

    if (jotted.hasOwnProperty('autoRun')) {
      props.autoRun = jotted.autoRun;
    } else {
      props.autoRun = true;
      jotted.plugins.forEach((plugin) => {
        if (plugin.name === 'play') {
          props.autoRun = false;
        }
      });
    }

    return props;
  }

  isConsoleEnabled() {
    let enabled = false;
    this.props.jotted.plugins.forEach((plugin) => {
      if (plugin.name === 'console') {
        enabled = true;
      }
    });
    return enabled;
  }

  updateFilesinState(files) {
    this.setState({
      files: this.getCodeFilesAsHash(files),
      onlyCodeChanged: false,
    });
  }

  saveComponent() {
  }

  getPlaygroundType() {
    const { jotted: { codePlaygroundTemplate, arrangeSideBySide } } = this.props;

    if (codePlaygroundTemplate) {
      return codePlaygroundTemplate;
    }

    if (arrangeSideBySide) {
      return 'onelinePanels';
    }

    return 'jottedTabs';
  }

  render() {
    const props = this.getPropsForViewers();
    let viewer = null;
    // console.log('_________runJS2_________', this.props, props);

    switch (this.getPlaygroundType()) {
      case 'jottedTabs':
        viewer = <ViewTabs {...props} />;
        break;

      case 'onelinePanels':
        viewer = <ViewOnelinePanels {...props} />;
        break;

      case 'resultBelow':
        viewer = <ViewResultBelow {...props} />;
        break;

      default:
        viewer = (
          <div className={styles.styles}>
            CodePlayground not available.
          </div>
        );
    }

    let consoleEnabledStyle = '';
    if (this.isConsoleEnabled()) {
      consoleEnabledStyle = styles.consoleEnabledStyle;
    }

    const { testExecResult, testExecError, testExecInProgress } = this.state;

    return (
      <div className={styles.codePlaygroundContainer}>
        {
          this.props.editorMarkerForViewMode ?
            <p className={styles.clickEdit}>Click here to edit</p> : null
        }
        <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={consoleEnabledStyle}>{viewer}</div>
          {
            this.isConsoleEnabled() &&
            <div className={styles.consoleContainer}>
              <span className={styles.consoleLabel}>Console</span>
              <div ref={'runjs_console_output'} id={this.state.consoleId}/>
            </div>
          }
          {
            props.exercise &&
            <RunJsTestResults
              testExecResult={testExecResult}
              testExecError={testExecError}
              testExecInProgress={testExecInProgress}
            />
          }
          <ReactScriptHelper
            scripts={listScriptsToLoad}
            onScriptsLoaded={() => this.setState({ scriptsLoaded: true })}
            onScriptsLoadError={() => this.setState({ scriptsLoaded: false })}
          />
        </div>
      </div>
    );
  }
}

CodePlayground.propTypes = {
  editorMarkerForViewMode : PropTypes.bool.isRequired,
  default_themes          : PropTypes.object,
  jotted                  : PropTypes.shape({
    codePlaygroundTemplate  : PropTypes.string.isRequired,
    hideCss                 : PropTypes.bool.isRequired,
    hideHtml                : PropTypes.bool.isRequired,
    hideJs                  : PropTypes.bool.isRequired,
    hideNav                 : PropTypes.bool.isRequired,
    hideResult              : PropTypes.bool.isRequired,
    pane                    : PropTypes.string.isRequired,
    exercise                : PropTypes.bool,
    showLineNumbers         : PropTypes.bool,
    height                  : PropTypes.string,
    heightCodepanel         : PropTypes.string,
    theme                   : PropTypes.string,
    autoRun                 : PropTypes.bool,
    plugins                 : PropTypes.array,
    toggleState             : PropTypes.shape({
      result : PropTypes.bool,
      html   : PropTypes.bool,
      css    : PropTypes.bool,
      js     : PropTypes.bool,
    }),
    files                   : PropTypes.arrayOf(PropTypes.shape({
      content : PropTypes.string.isRequired,
      type    : PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
