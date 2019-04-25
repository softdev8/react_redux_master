import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { FormControl, Checkbox } from 'react-bootstrap';
import styles from './editorCodeOptions.module.scss';
import { CodeMirrorThemes } from '../../helpers/codeoptions';
import HighlightLines from '../../helpers/highlightLines';
import { LoaderOptions } from './editorLoaderOptions';

const MIN_CODEPANEL_HEIGHT = 100;
const MAX_CODEPANEL_HEIGHT = 2048;
const MIN_OUTPUT_HEIGHT = 100;
const MAX_OUTPUT_HEIGHT = 2048;

export default class CodeOptions extends Component {

  static propTypes = {
    theme: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
    hideCodeView: PropTypes.bool.isRequired,
    codePanelHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    outputHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    loaders: PropTypes.object.isRequired,
    highlightedLines: PropTypes.string,
    onThemeSelect: PropTypes.func.isRequired,
    onShowLineNumbers: PropTypes.func.isRequired,
    onLoadersChange: PropTypes.func.isRequired,
    onOutputHeightChange: PropTypes.func.isRequired,
    onCodePanelHeightChange: PropTypes.func.isRequired,
    onHideCodeViewChange: PropTypes.func.isRequired,
    onHighlightedLinesChange: PropTypes.func.isRequired,
  };

  onUpdateCodePanelHeight(value) {
    if (!value || isNaN(value) ||
        value < MIN_CODEPANEL_HEIGHT || value > MAX_CODEPANEL_HEIGHT) {
      findDOMNode(this.codePanelHeight).value = this.props.codePanelHeight;
    } else {
      this.props.onCodePanelHeightChange(value);
    }
  }

  onUpdateOutputHeight(value) {
    if (!value || isNaN(value) ||
        value < MIN_OUTPUT_HEIGHT || value > MAX_OUTPUT_HEIGHT) {
      findDOMNode(this.outputHeight).value = this.props.outputHeight;
    } else {
      this.props.onOutputHeightChange(value);
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div>
          <label className={`${styles.label} ${styles['label-theme']}`}>Theme
            <FormControl
              componentClass="select"
              className={styles.inputOptions}
              value={this.props.theme}
              onChange={
                event => this.props.onThemeSelect(event.target.value)
              }
            >
              {
                Object.keys(CodeMirrorThemes).map((key) => {
                  return (
                    <option key={key} value={key}>{CodeMirrorThemes[key]}</option>
                  );
                })
              }
            </FormControl>
          </label>
          <label className={`${styles.label} form-label`}>Line Numbers
            <Checkbox
              checked={this.props.showLineNumbers}
              onChange={
                e => this.props.onShowLineNumbers(!!e.target.checked)
              }
            />
          </label>
          <label className={`${styles.label} form-label`}>Hide Code
            <Checkbox
              checked={this.props.hideCodeView}
              onChange={
                e => this.props.onHideCodeViewChange(!!e.target.checked)
              }
            />
          </label>
          <LoaderOptions
            loaders={this.props.loaders}
            onLoadersChange={this.props.onLoadersChange}
          />
        </div>
        <div>
          <label className={`${styles.label} form-label`}>Code Height(px)
            <FormControl
              maxLength={4}
              ref={c => (this.codePanelHeight = c)}
              defaultValue={this.props.codePanelHeight}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  this.onUpdateCodePanelHeight(findDOMNode(this.codePanelHeight).value);
                }
              }}
              onBlur={({ target: { value } }) => {
                this.onUpdateCodePanelHeight(value);
              }}
              style={{ marginLeft: 5 }}
            />
          </label>
          <label className={`${styles.label} form-label`}>Output Height(px)
            <FormControl
              maxLength={4}
              ref={c => (this.outputHeight = c)}
              defaultValue={this.props.outputHeight}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  this.onUpdateOutputHeight(findDOMNode(this.outputHeight).value);
                }
              }}
              onBlur={({ target: { value } }) => {
                this.onUpdateOutputHeight(value);
              }}
              style={{ marginLeft: 5 }}
            />
          </label>
          <HighlightLines
            value={this.props.highlightedLines}
            onChangeLines={(event) => this.props.onHighlightedLinesChange(event.target.value)}
          />
        </div>
      </div>
    );
  }
}
