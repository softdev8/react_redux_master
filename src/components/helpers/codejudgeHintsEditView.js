import React, { Component, PropTypes } from 'react';
import styles from './codejudgeHintsEditView.module.scss';
import { Btn } from '../index';
import MarkdownViewer from './markdownViewer';
const CodeMirrorEditor = require('./codeeditor');
const markdownToHtml = require('../../utils/markdownToHtml');

export default class CodeJudgeHintsEditView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      judgeHints: props.judgeHints,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      judgeHints: nextProps.judgeHints,
    });
  }

  onHintUpdate = (content, index) => {
    const { judgeHints } = this.state;
    judgeHints[index].markdown = content;
    judgeHints[index].html = markdownToHtml(content);

    this.setState({
      judgeHints
    }, this.props.onJudgeHintsUpdate(judgeHints, true));
  }

  removeHint = (index) => {
    const { judgeHints } = this.state;

    if (judgeHints && judgeHints.length > index) {
      judgeHints.splice(index, 1);
      this.props.onJudgeHintsUpdate(judgeHints);
    }
  }

  render() {
    let hints = null;
    const { judgeHints } = this.state;

    if (judgeHints && judgeHints.length > 0) {

      hints = this.props.judgeHints.map((hint, index) => {
        const hintMarkdown = {
          content: hint.markdown,
          language: 'markdown',
          theme: 'default',
        };

        return(
          <div key={index}>
            <div className={styles.hintWrapper}>
              <span className={styles.hintNumber}>
                Hint #{index+1}
                <span
                  className={styles.hintRemove}
                  onClick={() => this.removeHint(index)}
                >
                  Remove
                </span>
              </span>
              <div className={styles.hintEditor}>
                <CodeMirrorEditor
                  placeholder={'Write hint in markdown'}
                  showRuler={false}
                  codeContent={hintMarkdown}
                  readOnly={false}
                  onlyCodeChanged={this.props.onlyCodeChanged}
                  onEditorChange={(content) => {
                    this.onHintUpdate(content, index);
                  }}
                />
              </div>
              <div className={styles.hintViewer}>
                <MarkdownViewer mdHtml={hint.html} />
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div style={{ minHeight:200 }}>
        {hints}
      </div>
    );
  }
};