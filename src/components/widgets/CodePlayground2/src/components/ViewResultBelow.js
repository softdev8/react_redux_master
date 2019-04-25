/* eslint-disable no-console, prefer-const, react/jsx-boolean-value, func-names */

import React, { Component, PropTypes } from 'react';
import CodeMirrorEditor from '../../../../helpers/codeeditor';
const RunButton = require('../../../../helpers/runCodeButton');
const JudgeButton = require('../../../../helpers/judgeCodeButton');
import * as H from './helpers/runjsPanelsHelper';
import styles from './ViewResultBelow.module.scss';

const DEFAULT_HEIGHT = 400;
const DEFAULT_CODE_HEIGHT = 400;
const RUNJS_SEPARATOR_COLOR = '#58bd91';

export default class CodePlaygroundResultBelowView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      availableCodes: [
        { html: !props.hideHtml && !!props.files.html },
        { css: !props.hideCss && !!props.files.css },
        { js: !props.hideJs && !!props.files.js },
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
      ],
    });
  }

  getPaneContent(type) {
    if (type === 'result') {
      return this.getResultView();
    }

    const language = type === 'js' ? 'javascript' : type;
    const { files, showLineNumbers, theme, onlyCodeChanged, onCodeChange, autoRun,
      readOnly, default_themes } = this.props;

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
    let focusClasses = { ...this.state.focusClasses };
    focusClasses[type] = 'focus-pane';
    this.setState({ focusClasses });
  }

  onBlur = () => {
    this.setState({ focusClasses: H.focusClasses });
  }

  render() {
    const { hideNav, autoRun, exercise, hideResult, hideHtml, hideCss, hideJs, height, heightCodepanel, paneToggleState } = this.props;
    const { availableCodes, focusClasses } = this.state;

    const availableCodesList = H.getTrueKeys(availableCodes);
    const navNames = H.navNames;

    let hiddenCodesClasses = '';
    const stringHiddenCodesClasses = H.stringHiddenCodesClasses(paneToggleState);
    stringHiddenCodesClasses.split(' ').map((c) => { hiddenCodesClasses += c ? `${styles[c]} ` : ''; });

    let panesHasBorder = '';
    H.arrayPanesHasSeparatorResultBelow(stringHiddenCodesClasses).map((c) => { panesHasBorder += c ? `${styles[c]} ` : ''; });

    let baseClassName = `${styles['runjs-container']} ${hiddenCodesClasses} ${panesHasBorder}`;

    if (!hideResult && hideHtml && hideCss && hideJs) baseClassName += `${baseClassName} ${styles['result-single-pane']}`;

    let panelsStyle = {
      panel: {
        height: heightCodepanel ? Math.min(heightCodepanel, 0.65 * window.screen.availHeight) : DEFAULT_CODE_HEIGHT,
      },
    };

    if (!hideHtml || !hideCss || !hideJs) {
      panelsStyle.result = {
        borderTop: `1px solid ${RUNJS_SEPARATOR_COLOR}`, // #a0daff
        height: height || DEFAULT_HEIGHT,
      };
    }

    return (
      <div className={baseClassName}>
        {
          (!hideNav || !autoRun) && <ul className="runjs-nav runjs-nav-list">
            {
              !hideNav && availableCodesList.map((type, t) => {
                return (
                  <li onClick={this.handleToggleCode.bind(null, type)} key={t} className={`runjs-nav-item runjs-nav-item-${type}`}>
                    <a>{navNames[type]}</a>
                  </li>
                );
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
        }

        {
          !(hideHtml && hideCss && hideJs) && !hideNav && <div className="runjs-panes-row" style={ panelsStyle.panel }>
            {
              availableCodesList.map((type, p) => {
                return (
                  <div key={p}
                    className={`runjs-pane runjs-pane-cell runjs-pane-${type} ${focusClasses[type]}`}
                    onFocus={ this.onFocus.bind(this,type) }
                    onBlur={ this.onBlur }>
                    {this.getPaneContent(type)}
                  </div>
                );
              })
            }
          </div>
        }

        {
          !hideResult && <div className="runjs-result-wrapper" style={{ ...panelsStyle.result }}>
            <div className="runjs-pane runjs-pane-result">
              {this.getPaneContent('result')}
            </div>
          </div>
        }
        {
          hideResult &&
          <div style={{ display: 'none' }}>{this.getResultView()}</div>
        }

      </div>
    );
  }
}

CodePlaygroundResultBelowView.propTypes = {
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
  heightCodepanel: PropTypes.string,
  paneToggleState: PropTypes.shape({
    result: PropTypes.bool.isRequired,
    html: PropTypes.bool.isRequired,
    css: PropTypes.bool.isRequired,
    js: PropTypes.bool.isRequired,
  }).isRequired,
  onPaneToggleStateChange: PropTypes.func.isRequired,
};
