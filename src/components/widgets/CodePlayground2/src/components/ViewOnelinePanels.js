/* eslint-disable no-console, prefer-const, react/jsx-boolean-value, func-names */

import React, { Component, PropTypes } from 'react';
import CodeMirrorEditor from '../../../../helpers/codeeditor';
import * as H from './helpers/runjsPanelsHelper';
import styles from './ViewOnelinePanels.module.scss';
const RunButton = require('../../../../helpers/runCodeButton');
const JudgeButton = require('../../../../helpers/judgeCodeButton');

const DEFAULT_HEIGHT = 400;

export default class CodePlaygroundOnelinePanelsView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      availableCodes: [
        { html: !props.hideHtml && !!props.files.html },
        { css: !props.hideCss && !!props.files.css },
        { js: !props.hideJs && !!props.files.js },
        { result: !props.hideResult },
      ],
      focusClasses: H.focusClasses,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      availableCodes: [
        { html: !nextProps.hideHtml && !!nextProps.files.html },
        { css: !nextProps.hideCss && !!nextProps.files.css },
        { js: !nextProps.hideJs && !!nextProps.files.js },
        { result: !nextProps.hideResult },
      ],
    });
  }

  getPaneContent(type) {
    if (type === 'result') {
      return this.getResultView();
    }

    const language = type === 'js' ? 'javascript' : type;
    const { files, showLineNumbers, theme, onlyCodeChanged, onCodeChange,
      readOnly, autoRun, default_themes } = this.props;

    let highlightedLines = '';
    if (this.props.panelsHighlightedLines) {
      highlightedLines = this.props.panelsHighlightedLines[type];
    }

    let codeTheme = theme;
    if (theme === 'default' && default_themes) {
      codeTheme = default_themes.RunJS;
    }

    const activeContent = {
      content: files[type],
      language,
      theme: codeTheme,
      highlightedLines,
      lineNumbers: showLineNumbers,
    };

    return (
      <CodeMirrorEditor
        codeContent={activeContent}
        readOnly={readOnly}
        showRuler={false}
        onlyCodeChanged={onlyCodeChanged}
        onEditorChange={(value) => {
          onCodeChange(type, value, autoRun);
        }}
      />
    );
  }

  getResultView() {
    if (!!this.props.compiledHtml) {
      const style = {
        width: '100%',
        border: 'none',
        height: '100%',
      };

      if (this.props.height) {
        style.height = this.props.height;
      }

      return (
        <iframe srcDoc={this.props.compiledHtml} style={style}></iframe>
      );
    }

    return <div />;
  }

  handleToggleCode = (type) => {
    this.props.onPaneToggleStateChange(type, !this.props.paneToggleState[type]);
  }

  onFocus = (type) => {
    if (type !== 'result') {
      let focusClasses = { ...this.state.focusClasses };
      focusClasses[type] = 'focus-pane';
      this.setState({ focusClasses });
    }
  }

  onBlur = () => {
    this.setState({ focusClasses: H.focusClasses });
  }

  render() {
    const { hideNav, autoRun, exercise, hideResult, hideHtml, hideCss, hideJs, height, paneToggleState } = this.props;
    const { availableCodes, focusClasses } = this.state;

    const availableCodesList = H.getTrueKeys(availableCodes);
    const navNames = H.navNames;

    let hiddenCodesClasses = '';
    const stringHiddenCodesClasses = H.stringHiddenCodesClasses(paneToggleState, !hideResult);
    stringHiddenCodesClasses.split(' ').map((c) => { hiddenCodesClasses += c ? `${styles[c]} ` : ''; });

    let panesHasBorder = '';
    H.arrayPanesHasSeparatorOnelinePanels(stringHiddenCodesClasses).map((c) => { panesHasBorder += c ? `${styles[c]} ` : ''; });

    let baseClassName = `${styles['runjs-container']} ${hiddenCodesClasses} ${panesHasBorder}`;

    if (!hideResult && hideHtml && hideCss && hideJs) baseClassName += `${baseClassName} ${styles['result-single-pane']}`;

    const panesRowHeightStyle = {
      height: height || DEFAULT_HEIGHT,
    };

    return (
      <div className={baseClassName}>
        <ul className="runjs-nav-list">
          {
            !hideNav && availableCodesList.map((type, t) => {
              return (
                <li onClick={this.handleToggleCode.bind(null, type)} key={t} className={`runjs-nav-item runjs-nav-item-${type}`}>
                  <a>{navNames[type]}</a>
                </li>
              )
            })
          }
          {
            (!autoRun || exercise) &&
              <span
                style={{
                  float: 'right'
                }}
              >
                { !autoRun &&
                  <span style={{ marginLeft: 10 }}>
                    <RunButton onClick={this.props.onRunClicked} executionInProgress={false}/>
                  </span>
                }
                {
                  exercise &&
                  <span style={{ marginLeft: 10 }}>
                    <JudgeButton onClick={this.props.onJudgeClicked} executionInProgress={false}/>
                  </span>
                }
              </span>
          }
        </ul>
        <div className="runjs-panes-row">
          {
            availableCodesList.map((type, p) => {
              return (
                <div key={p}
                  className={`runjs-pane runjs-pane-${type} ${focusClasses[type]}`}
                  onFocus={ this.onFocus.bind(this,type) }
                  onBlur={ this.onBlur }>
                  <div style={panesRowHeightStyle}>
                    {this.getPaneContent(type)}
                  </div>
                </div>
              );
            })
          }
        </div>
        {
          hideResult &&
          <div style={{ display: 'none' }}>{this.getResultView()}</div>
        }
      </div>
    );
  }
}

CodePlaygroundOnelinePanelsView.propTypes = {
  hideCss: PropTypes.bool.isRequired,
  hideHtml: PropTypes.bool.isRequired,
  hideJs: PropTypes.bool.isRequired,
  hideResult: PropTypes.bool.isRequired,
  hideNav: PropTypes.bool.isRequired,
  showLineNumbers: PropTypes.bool.isRequired,
  autoRun: PropTypes.bool.isRequired,
  onlyCodeChanged: PropTypes.bool.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onRunClicked: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  files: PropTypes.objectOf(PropTypes.string).isRequired,
  compiledHtml: PropTypes.string,
  height: PropTypes.string,
  paneToggleState: PropTypes.shape({
    result: PropTypes.bool.isRequired,
    html: PropTypes.bool.isRequired,
    css: PropTypes.bool.isRequired,
    js: PropTypes.bool.isRequired,
  }).isRequired,
  onPaneToggleStateChange: PropTypes.func.isRequired,
};
