import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { CodeMirrorModes } from './codeoptions';

const codeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/display/placeholder.js');
require('codemirror/addon/display/rulers');
require('codemirror/mode/clike/clike');
require('codemirror/mode/css/css');
require('codemirror/mode/erlang/erlang');
require('codemirror/mode/go/go');
require('codemirror/mode/haskell/haskell');
require('codemirror/mode/htmlembedded/htmlembedded');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/perl/perl');
require('codemirror/mode/php/php');
require('codemirror/mode/python/python');
require('codemirror/mode/r/r');
require('codemirror/mode/ruby/ruby');
require('codemirror/mode/rust/rust');
require('codemirror/mode/scheme/scheme');
require('codemirror/mode/shell/shell');
require('codemirror/mode/sql/sql');
require('codemirror/mode/xml/xml');

require('../widgets/widgets.scss');

import { defaultLanguage } from './codeoptions';


class MarkdownViewer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.updateView();
  }

  componentDidUpdate() {
    this.updateView();
  }

  addCodeMirror() {
    const markdownViewer = findDOMNode(this.refs.markdownViewer);
    const codeTheme = this.props.default_themes ?
                        this.props.default_themes.Markdown :
                        'default';

    $(markdownViewer).find('pre').each(function() {
      const pre = $(this);
      const code = pre.find('code');

      if (!code.length) {
        return;
      }

      const div = $('<div>')
        .addClass('cm-viewer-markdown')
        .addClass('disable-cursor');
      pre.replaceWith(div[0]);

      let text = code.text();
      if (text.length) {
        const ch = text.charAt(text.length - 1);
        if (ch === '\n' || ch === '\r') {
          text = text.slice(0, -1);
        }
      }

      const langAttr = code.attr('class') ? code.attr('class').replace('language-', '') : defaultLanguage;
      const mode = (langAttr in CodeMirrorModes) ? CodeMirrorModes[langAttr].mime : CodeMirrorModes[defaultLanguage].mime;

      codeMirror(div[0], {
        value: text,
        mode,
        lineNumbers: false,
        lineWrapping: false,
        readOnly: true,
        theme: codeTheme,
        tabSize: 2,
      });

    });
  }


  updateView() {
    findDOMNode(this.refs.markdownViewer).innerHTML = this.props.mdHtml;
    this.addCodeMirror();
  }

  render() {
    return  <div ref="markdownViewer" className={this.props.viewerClass}>_</div>;
  }
}

MarkdownViewer.propTypes = {
  mdHtml: PropTypes.string.isRequired,
  viewerClass: PropTypes.string.isRequired
};

MarkdownViewer.defaultProps = {
  viewerClass: 'mediumTextViewer'
};

module.exports = MarkdownViewer;
