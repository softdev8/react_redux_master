import React, { PropTypes } from 'react';

const CodeMirrorEditor = require('./codeeditor');
const markdownToHtml = require('../../utils/markdownToHtml');

class MarkdownEditor extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onMarkdownChanged = this.onMarkdownChanged.bind(this);
  }

  onMarkdownChanged(mdText) {
    const mdHtml = markdownToHtml(mdText);

    this.props.onMarkdownUpdated({
      mdHtml,
      mdText
    });
  }

  render() {
    let { mdText, placeholder, onlyCodeChanged } = this.props;

    const activeCodeContent = {
      content: mdText,
      language: 'markdown',
      theme: 'default',
      lineNumbers:false,
      lineWrapping:true,
    };

    return (
      <CodeMirrorEditor
        key="editor"
        ref="codeMirrorEditorRef"
        codeContent={activeCodeContent}
        readOnly={false}
        placeholder={placeholder}
        showRuler={false}
        onEditorChange={this.onMarkdownChanged}
        codeMirrorStyle={this.props.codeMirrorStyle}
        onlyCodeChanged={onlyCodeChanged}
      />
    );
  }
}

MarkdownEditor.propTypes = {
  mdText: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onlyCodeChanged: PropTypes.bool.isRequired,
  codeMirrorStyle: PropTypes.string.isRequired,
  onMarkdownUpdated: PropTypes.func.isRequired,
};

MarkdownEditor.defaultProps = {
  placeholder: 'Write here ...',
  codeMirrorStyle: 'cmcomp-editor-container-markdown'
};

module.exports = MarkdownEditor;
