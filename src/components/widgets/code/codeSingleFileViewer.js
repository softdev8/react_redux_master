import React, { Component, PropTypes } from 'react';
import copy from 'copy-to-clipboard';

const CodeMirrorEditor = require('../../helpers/codeeditor');
const CodeDownload = require('../../helpers/codedownload');

export default class CodeSingleFileViewer extends Component {
  static propTypes = {
    codeContent: PropTypes.shape({
      allowDownload: PropTypes.bool.isRequired,
      language: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  }

  render() {
    const { content, language, allowDownload } = this.props.codeContent;

    return (
      <div className="cmcomp-single-editor-container">
        <CodeMirrorEditor
          key="viewEditor"
          codeContent={this.props.codeContent}
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
              onClick={() => copy(content)}
            />
          </div>
          {
            allowDownload ?
              <CodeDownload
                content={content}
                language={language}
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
    );
  }
}
