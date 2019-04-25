import styles from './codeoptions.module.scss';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import HighlightLines from './highlightLines';
import { FormControl, Checkbox } from 'react-bootstrap';

// Available Code Mirror languages in our component
export const CodeMirrorModes = {
  c: { title: 'C', mime: 'text/x-csrc', runnable: true, judge: false },
  'c++': { title: 'C++', mime: 'text/x-c++src', runnable: true, judge: true },
  'c#': { title: 'C#', mime: 'text/x-csharp', runnable: true, judge: true },
  css: { title: 'CSS', mime: 'text/css', runnable: false, judge: false },
  erlang: { title: 'Erlang', mime: 'text/x-erlang', runnable: true, judge: false },
  go: { title: 'Go', mime: 'text/x-go', runnable: true, judge: false },
  haskell: { title: 'Haskell', mime: 'text/x-haskell', runnable: true, judge: false },
  html: { title: 'HTML', mime: 'text/html', runnable: false, judge: false },
  java: { title: 'Java', mime: 'text/x-java', runnable: true, judge: true },
  javascript: { title: 'JavaScript', mime: 'text/javascript', runnable: true, judge: true },
  jsx: { title: 'JavaScript (JSX)', mime: 'text/jsx', runnable: true, judge: true },
  markdown: { title: 'Markdown', mime: 'text/x-markdown', runnable: false, judge: false },
  perl: { title: 'Perl', mime: 'text/x-perl', runnable: true, judge: false },
  php: { title: 'PHP', mime: 'text/x-php', runnable: true, judge: false },
  python: { title: 'Python', mime: 'text/x-python', runnable: true, judge: true },
  python3: { title: 'Python3', mime: 'text/x-python', runnable: true, judge: true },
  r: { title: 'R', mime: 'text/x-rsrc', runnable: true, judge: false },
  ruby: { title: 'Ruby', mime: 'text/x-ruby', runnable: true, judge: true },
  rust: { title: 'Rust', mime: 'text/x-rustsrc', runnable: false, judge: false },
  scala: { title: 'Scala', mime: 'text/x-scala', runnable: true, judge: false },
  scheme: { title: 'Scheme', mime: 'text/x-scheme', runnable: true, judge: false },
  shell: { title: 'Shell', mime: 'text/x-sh', runnable: true, judge: false },
  sql: { title: 'Sql', mime: 'text/x-sql', runnable: true, judge: false },
  xml: { title: 'XML', mime: 'application/xml', runnable: false, judge: false },
};

export const defaultLanguage = 'javascript';

// Available Code Mirror themes in our component
export const CodeMirrorThemes = {
  default: 'Default',
  '3024-day': '3024-day',
  '3024-night': '3024-night',
  ambiance: 'Ambiance',
  'base16-dark': 'Base16-dark',
  'base16-light': 'Base16-light',
  blackboard: 'Blackboard',
  cobalt: 'Cobalt',
  dracula: 'Dracula',
  eclipse: 'Eclipse',
  elegant: 'Elegant',
  'erlang-dark': 'Erlang-dark',
  'lesser-dark': 'Lesser-dark',
  material: 'Material',
  mbo: 'Mbo',
  'mdn-like': 'Mdn-like',
  midnight: 'Midnight',
  monokai: 'Monokai',
  neat: 'Neat',
  neo: 'Neo',
  night: 'Night',
  'paraiso-dark': 'Paraiso-dark',
  'paraiso-light': 'Paraiso-light',
  'pastel-on-dark': 'Pastel-on-dark',
  rubyblue: 'Rubyblue',
  seti: 'Seti',
  'solarized light': 'Solarized Light',
  'the-matrix': 'The-matrix',
  'tomorrow-night-eighties': 'Tomorrow-night-eighties',
  twilight: 'Twilight',
  'vibrant-ink': 'Vibrant-ink',
};


/*
 * Utility method to get the keys of the given object.
 */
const keys = function getAllKeys(obj) {
  const keysArray = [];
  for (const key in obj) {
    if ({}.hasOwnProperty.call(obj, key)) {
      keysArray.push(key);
    }
  }
  return keysArray;
};

//------------------------------------------------------------------------------
// OPTIONS COMPONENT
//------------------------------------------------------------------------------

/*
 * Options to change the language and the theme for the active code content.
 *
 * Available props:
 * language - code mirror mode
 * theme - code mirror theme
 * onLanguageSelect(language) - callback when a language is selected
 * onThemeSelect(theme) - callback when a theme is selected
 */
export class CodeMirrorOptions extends Component {

  static propTypes = {
    language                          : PropTypes.string.isRequired,
    theme                             : PropTypes.string.isRequired,
    runnable                          : PropTypes.bool,
    judge                             : PropTypes.bool,
    allowDownload                     : PropTypes.bool,
    treatOutputAsHTML                 : PropTypes.bool,
    enableHiddenCode                  : PropTypes.bool,
    enableStdin                       : PropTypes.bool,
    showSolution                      : PropTypes.bool,
    evaluateWithoutExecution          : PropTypes.bool,
    onRunnableChange                  : PropTypes.func.isRequired,
    onJudgeChange                     : PropTypes.func.isRequired,
    onThemeSelect                     : PropTypes.func.isRequired,
    onLanguageSelect                  : PropTypes.func.isRequired,
    onMultiChange                     : PropTypes.func.isRequired,
    onAllowDownloadChange             : PropTypes.func.isRequired,
    onTreatOutputAsHTMLChange         : PropTypes.func.isRequired,
    onEnableHiddenCodeChange          : PropTypes.func.isRequired,
    onEnableStdinChange               : PropTypes.func.isRequired,
    onEvaluateWithoutExecutionChange  : PropTypes.func.isRequired,
    onShowSolutionChange              : PropTypes.func.isRequired,
    onHighlightedLinesChange          : PropTypes.func.isRequired,
    highlightedLines                  : PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
    this.handleSelectTheme = this.handleSelectTheme.bind(this);
    this.handleRunnableChange = this.handleRunnableChange.bind(this);
    this.handleJudgeChange = this.handleJudgeChange.bind(this);
    this.handleAllowDownloadChange = this.handleAllowDownloadChange.bind(this);
    this.handleTreatOutputAsHTMLChange = this.handleTreatOutputAsHTMLChange.bind(this);
    this.handleEnableHiddenCodeChange = this.handleEnableHiddenCodeChange.bind(this);
    this.handleEnableStdinChange = this.handleEnableStdinChange.bind(this);
    this.handleShowSolutionChange = this.handleShowSolutionChange.bind(this);
    this.handleEvaluateWithoutExecutionChange = this.handleEvaluateWithoutExecutionChange.bind(this);
    this.handleHighlighedLinesChange = this.handleHighlighedLinesChange.bind(this);
  }

  handleSelectLanguage(event) {
    if (this.props.judge) {
      if (!CodeMirrorModes[event.target.value].judge) {
        this.props.onJudgeChange(false);
      }
    }

    if (this.props.runnable) {
      if (!CodeMirrorModes[event.target.value].runnable) {
        this.props.onRunnableChange(false);
      }
    }

    this.props.onLanguageSelect(event.target.value);

  }

  handleSelectTheme(event) {
    this.props.onThemeSelect(event.target.value);
  }

  handleShowSolutionChange(event) {
    this.props.onShowSolutionChange(event.target.checked ? true : false);
  }

  handleEvaluateWithoutExecutionChange(event) {
    this.props.onEvaluateWithoutExecutionChange(event.target.checked ? true : false);
  }

  handleAllowDownloadChange(event) {
    this.props.onAllowDownloadChange(event.target.checked);
  }

  handleTreatOutputAsHTMLChange(event) {
    this.props.onTreatOutputAsHTMLChange(event.target.checked);
  }

  handleEnableHiddenCodeChange(event) {
    this.props.onEnableHiddenCodeChange(event.target.checked);
  }

  handleEnableStdinChange(event) {
    this.props.onEnableStdinChange(event.target.checked);
  }

  handleRunnableChange(event) {
    if (event.target.checked) {
      this.props.onMultiChange({
        judge : false,
        runnable : true,
      });
    } else {
      this.props.onRunnableChange(false);
    }
  }

  handleJudgeChange(event) {
    if (event.target.checked) {
      this.props.onMultiChange({
        judge : true,
        runnable : false,
      });
    } else {
      if (this.props.onJudgeChange) {
        this.props.onJudgeChange(false);
      }
    }
  }

  handleHighlighedLinesChange(event) {
    this.props.onHighlightedLinesChange(event.target.value);
  }

  render() {
    return (
      <div className="edcomp-toolbar" style={{ border:'none' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', paddingLeft:15, paddingTop:2, paddingBottom:2, marginTop:5, marginBottom:3, border:'1px solid #ddd', borderRadius:3}}>
            <label className={`${styles.label} ${styles.alignCenter} form-label`}>
              Language
              <FormControl componentClass="select" style={{ marginLeft:5 }}
                value={this.props.language}
                onChange={this.handleSelectLanguage}
              >
                {
                  keys(CodeMirrorModes).map(function codeMirrorModesMapper(key) {
                    return (
                      <option key={key} value={key}>{CodeMirrorModes[key].title}</option>
                    );
                  })
                }
              </FormControl>
            </label>
            <label className={`${styles.label} ${styles.alignCenter} form-label`}>
              Theme
              <FormControl componentClass="select" style={{ marginLeft:5 }}
                value={this.props.theme}
                onChange={this.handleSelectTheme}
              >
                {
                  keys(CodeMirrorThemes).map(function codeMirrorThemesMapper(key) {
                    return (
                      <option key={key} value={key}>{CodeMirrorThemes[key]}</option>
                    );
                  })
                }
              </FormControl>
            </label>
            <HighlightLines
              value={this.props.highlightedLines}
              onChangeLines={this.handleHighlighedLinesChange}
            />
          </div>
          </div>
          <div style={{ border:'1px solid #ddd', padding:5, paddingLeft:15, marginRight:10, marginTop:5, marginBottom:5, borderRadius:3, display:'inline-block' }}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Execute</span>
              <Checkbox inline disabled={!CodeMirrorModes[this.props.language].runnable} checked={this.props.runnable} onChange={this.handleRunnableChange}/>
            </label>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Exercise</span>
              <Checkbox inline disabled={!CodeMirrorModes[this.props.language].judge} checked={this.props.judge} onChange={this.handleJudgeChange}/>
            </label>
          </div>
          <div style={{ border:'1px solid #ddd', padding:5, paddingLeft:15, marginRight:5, marginTop:5, marginBottom:5, borderRadius:3, display:'inline-block' }}>
            {this.props.runnable ? <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Hidden Code</span>
              <Checkbox inline checked={this.props.enableHiddenCode} onChange={this.handleEnableHiddenCodeChange}/>
            </label> : null}
            {this.props.runnable ? <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Stdin</span>
              <Checkbox inline checked={this.props.enableStdin} onChange={this.handleEnableStdinChange}/>
            </label> : null}
            {this.props.runnable ? <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Treat Output as HTML</span>
              <Checkbox inline checked={this.props.treatOutputAsHTML} onChange={this.handleTreatOutputAsHTMLChange}/>
            </label> : null}
            {this.props.judge ? <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Solution</span>
              <Checkbox inline checked={this.props.showSolution} onChange={this.handleShowSolutionChange}/>
            </label> : null}
            {this.props.judge ? <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Evaluate without Execution</span>
              <Checkbox inline checked={this.props.evaluateWithoutExecution} onChange={this.handleEvaluateWithoutExecutionChange}/>
            </label> : null}
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Downloadable</span>
              <Checkbox inline checked={this.props.allowDownload} onChange={this.handleAllowDownloadChange}/>
            </label>
          </div>
      </div>
    );
  }
}