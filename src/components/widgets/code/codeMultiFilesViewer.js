import React, { Component, PropTypes } from 'react';
import copy from 'copy-to-clipboard';
import styles from './codeMultiFilesViewer.module.scss';

const CodeMirrorEditor = require('../../helpers/codeeditor');
const CodeDownload = require('../../helpers/codedownload');
const CodeFileTab = require('./codeFileTab');

export default class CodeMultiFilesViewer extends Component {
  static propTypes = {
    codeContent: PropTypes.shape({
      allowDownload: PropTypes.bool.isRequired,
      additionalContent: PropTypes.arrayOf(PropTypes.shape({
        fileName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      })).isRequired,
      selectedIndex: PropTypes.number.isRequired,
    }),
    onlyCodeChanged: PropTypes.bool.isRequired,
    onSelectedIndexChange: PropTypes.func.isRequired,
  }

  render() {
    const { selectedIndex, content, highlightedLines, language, theme,
      additionalContent, allowDownload, runnable, judge } = this.props.codeContent;

    let srcCode = content;

    const codeContent = {
      content: srcCode,
      highlightedLines,
      language,
      theme,
      runnable,
      judge,
    };

    if (selectedIndex > 0 && selectedIndex <= additionalContent.length) {
      srcCode = additionalContent[selectedIndex-1].content;

      codeContent.content = srcCode;
      codeContent.highlightedLines = additionalContent[selectedIndex-1].highlightedLines;
    }

    const codeTabs = additionalContent.map((content, index) => {
      return (
        <CodeFileTab
          key={index}
          fileName={content.fileName}
          index={index + 1}
          selected={selectedIndex === (index + 1)}
          onTabSelect={this.props.onSelectedIndexChange}
        />
      );
    });

    codeTabs.unshift(
      <CodeFileTab
        key={'defaultTab'}
        fileName={'default'}
        index={0}
        selected={selectedIndex === 0}
        onTabSelect={this.props.onSelectedIndexChange}
      />
    );

    return (
      <div className={styles.container}>
        <div className={styles.tabslist}>
          <div
            style={{
              display: 'block',
              overflowY: 'scroll',
              minHeight: 200,
              maxHeight: '65vh',
            }}
          >
            {codeTabs}
          </div>
        </div>
        <div
          className="cmcomp-single-editor-container"
          style={{ paddingLeft: 3, paddingRight: 2 }}
        >
          <CodeMirrorEditor
            key="editor"
            codeContent={codeContent}
            readOnly={true}
            tabsAsSpaces={true}
            onlyCodeChanged={this.props.onlyCodeChanged}
            onEditorChange={this.props.onEditorChange}
          />
          <div className="code-buttons">
            <div>
              <i
                className="fa fa-files-o"
                title="Copy to clipboard"
                aria-hidden="true"
                onClick={() => copy(srcCode)}
              />
            </div>
            {
              allowDownload ?
                <CodeDownload
                  content={srcCode}
                  language={this.state.language}
                >
                  <i
                    className="fa fa-download"
                    title="Download"
                    aria-hidden="true"
                  />
                </CodeDownload> : null
            }
          </div>
        </div>
      </div>
    );
  }
}
