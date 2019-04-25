import styles from './hiddenCode.module.scss';
import React, { Component, PropTypes } from 'react';
import { FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
const CodeMirrorEditor = require('./codeeditor');

export default class Runnable extends Component {
  constructor(props) {
    super(props);

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleCodeSelectionChange = this.handleCodeSelectionChange.bind(this);
  }

  handleCodeChange(value) {
    let newContent = this.props.hiddenCodeContent;

    if (newContent.codeSelection === 'prependCode') {
      newContent.prependCode = value;
    }
    else {
      newContent.appendCode = value;
    }

    this.props.onHiddenCodeContentChange(newContent, false);
  }

  handleCodeSelectionChange(e) {
    let newContent = this.props.hiddenCodeContent;
    newContent.codeSelection = e.target.value;

    this.props.onHiddenCodeContentChange(newContent, true);
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  render() {
    let { prependCode, appendCode, codeSelection } = this.props.hiddenCodeContent;
    let codeContent = {
      content: codeSelection === 'prependCode' ? prependCode : appendCode,
      language: this.props.language,
      theme: this.props.theme
    };

    return (
      <div>
        <div style={{ paddingTop: 5, paddingBottom: 10 }}>
          <OverlayTrigger placement="top" overlay={this.createTooltipObject(' We will prepend and append the hidden codes to the above code while executing.')}>
            <i>Hidden code goes here.</i>
          </OverlayTrigger>
          <FormControl componentClass='select' groupClassName={styles['code_select_form']}
            value={codeSelection}
            onChange={this.handleCodeSelectionChange} >
              <option value='prependCode'>Prepend</option>
              <option value='appendCode'>Append</option>
          </FormControl>
        </div>
        <div style={{ marginBottom: 20 }} className="cmcomp-single-editor-container">
         <CodeMirrorEditor
           key="editor"
           codeContent={codeContent}
           readOnly={false}
           onlyCodeChanged={this.props.onlyCodeChanged}
           onEditorChange={this.handleCodeChange}
         />
        </div>
      </div>
    );
  }
}
