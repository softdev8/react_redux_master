import React from 'react';
import {findDOMNode} from 'react-dom';

const CodeMirror = require('codemirror/lib/codemirror');
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
require('codemirror/mode/jsx/jsx');
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

// Available Code Mirror languages in our component
import { CodeMirrorModes } from './codeoptions';
import _ from 'underscore';

//------------------------------------------------------------------------------
// EDITOR COMPONENT
//------------------------------------------------------------------------------

/*
 * The code mirror editor used to display the current code content.
 * Note that the same instance is used for all code contents.
 *
 * Available props:
 * codeContent - the current code content to display
 * readOnly - disables content editing
 * onEditorChange(newValue) - callback when content is changed in the editor
 */
class CodeMirrorEditor extends React.Component {

  static defaultProps = {
    codeMirrorStyle: 'cmcomp-editor-container',
    placeholder: '',
    showRuler: true,
    tabsAsSpaces: false,
  };

  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.getRulers = this.getRulers.bind(this);
  }

  componentDidMount() {
    let lineNumbers = true;
    if (this.props.codeContent.hasOwnProperty('lineNumbers')) {
      lineNumbers = this.props.codeContent.lineNumbers;
    }

    let lineWrapping = false;
    if (this.props.codeContent.hasOwnProperty('lineWrapping')) {
      lineWrapping = this.props.codeContent.lineWrapping;
    }

    let readOnly = this.props.readOnly && !this.props.codeContent.runnable;
    if (readOnly) {
      readOnly = "nocursor";
    }

    this.editor = CodeMirror.fromTextArea(
      findDOMNode(this.refs.editorTextArea),
      {
        lineNumbers,
        lineWrapping,
        styleActiveLine: true,
        matchBrackets: true,
        readOnly,
        fixedGutter: false,
        rulers: this.getRulers(),
        tabSize: 2,
      },
    );

    if (this.props.tabsAsSpaces) {
      this.editor.setOption("extraKeys", {
        Tab: function(cm) {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        }
      });
    }

    this.editor.on('change', this.handleChange);
    this.componentDidUpdate();
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.onlyCodeChanged)
      return false;
    return true;
  }

  componentDidUpdate() {

    let readOnly = this.props.readOnly && !this.props.codeContent.runnable && !this.props.codeContent.judge;
    if (readOnly) {
      readOnly = "nocursor";
    }

    let lineNumbers = true;
    if (this.props.codeContent.hasOwnProperty('lineNumbers')) {
      lineNumbers = this.props.codeContent.lineNumbers;
    }

    let languageMode = CodeMirrorModes['javascript'].mime;
    if (({}).hasOwnProperty.call(CodeMirrorModes, this.props.codeContent.language)) {
      languageMode = CodeMirrorModes[this.props.codeContent.language].mime;
    }

    this.editor.setValue(this.props.codeContent.content);
    this.editor.setOption('mode', languageMode);
    this.editor.setOption('readOnly', readOnly);
    this.editor.setOption('theme', this.props.codeContent.theme);
    this.editor.setOption('rulers', this.getRulers());
    this.editor.setOption('lineNumbers', lineNumbers);

    if (this.props.codeContent.highlightedLines && this.props.codeContent.highlightedLines.length) {
      const lines = this.extractLineNumbers(this.props.codeContent.highlightedLines);
      lines.forEach(lineNumber => {
        this.editor.addLineClass(lineNumber - 1, "background", "CodeMirror-selected");
      });
    }

    this.editor.refresh();
  }

  extractLineNumbers(raw) {
    const intervals = raw.split('\n').map(i => i.split(/[ -]/));

    const linesByIntervals = intervals.map(interval => {
      if (interval.length === 1) {
        return parseInt(interval);
      }
      return _.range(parseInt(interval[0]), parseInt(interval[1]) + 1);
    });

    const lines = _.uniq(_.compact(_.flatten(linesByIntervals)));

    return lines;
  }

  getRulers() {
    let rulers = [];
    if (!this.props.readOnly && this.props.showRuler) {
      rulers.push({color: '#A02314', column: 50, lineStyle: "dashed"});
    }

    return rulers;
  }

  handleChange(editor, changeObj) {
    if (this.props.onEditorChange) {
      this.props.onEditorChange(this.editor.getValue());
    }
  }

  render() {
    return (
      <div className={this.props.codeMirrorStyle}>
        <textarea ref='editorTextArea' placeholder={this.props.placeholder}/>
      </div>
    );
  }
}

module.exports = CodeMirrorEditor;
