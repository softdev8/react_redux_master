import React, { Component, PropTypes } from 'react';

const CodeMultiFilesEditor = require('./codeMultiFilesEditor');
const CodeMultiFilesViewer = require('./codeMultiFilesViewer');
const CodeSingleFileViewer = require('./codeSingleFileViewer');

export default class CodeFiles extends Component {

  static propTypes = {
    codeContent: PropTypes.shape({
      allowDownload: PropTypes.bool.isRequired,
      additionalContent: PropTypes.arrayOf(PropTypes.shape({
        fileName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      })).isRequired,
      selectedIndex: PropTypes.number.isRequired,
    })
  }

  render() {
    if (!this.props.readOnly) {
      return (
        <CodeMultiFilesEditor
          codeContent={this.props.codeContent}
          onlyCodeChanged={this.props.onlyCodeChanged}
          onEditorChange={this.props.onEditorChange}
          onSelectedIndexChange={this.props.onSelectedIndexChange}
          handleMultiChange={this.props.handleMultiChange}
        />
      );
    }

    const { additionalContent } = this.props.codeContent;

    if (additionalContent.length > 0) {
      return (
        <CodeMultiFilesViewer
          codeContent={this.props.codeContent}
          onlyCodeChanged={this.props.onlyCodeChanged}
          onEditorChange={this.props.onEditorChange}
          onSelectedIndexChange={this.props.onSelectedIndexChange}
        />
      );
    }
    else {
      return (
        <CodeSingleFileViewer
          codeContent={this.props.codeContent}
          onlyCodeChanged={this.props.onlyCodeChanged}
          onEditorChange={this.props.onEditorChange}
        />
      );
    }
  }
}
