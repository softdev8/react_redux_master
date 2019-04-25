import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './codeMultiFilesEditorAddCodeFile.module.scss';

// Based on editabletext. Cleanup as needed.

export default class AddCodeFileButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateValue = this.updateValue.bind(this);

    this.state = {
      mode: 'view',
    };
  }

  componentDidUpdate() {
    // select the text content when entering edit mode
    if (this.state.mode === 'edit') {
      this.editor.select();
    }
  }

  gotoEdit() {
    this.setState({
      mode: 'edit',
    });
  }

  gotoView() {
    this.setState({
      mode: 'view',
    });
  }

  handleKeyUp(event) {
    if (event.key === 'Enter') {
      this.updateValue();
    } else if (event.key === 'Escape') {
      this.gotoView();
    }
  }

  updateValue() {
    const value = findDOMNode(this.editor).value.trim();
    this.gotoView();

    const content = {
      content: '',
      fileName: value,
      hidden: false,
      highlightedLines: '',
      staticFile: false,
    };

    this.props.onAddCodeFile(content);
  }

  render() {
    if (this.state.mode === 'edit') {
      // edit mode, display a text input
      return (
        <div className="cmcomp-edit-text">
          <input
            ref={(c) => { this.editor = c; }}
            type="text"
            maxLength="19"
            className={styles.inputFilename}
            defaultValue=""
            onKeyUp={this.handleKeyUp}
            onBlur={this.updateValue}
          />
        </div>
      );
    }

    // view mode, display a simple text and an edit icon
    return (
      <div className={'cmcomp-edit-text'}>
        <button className={styles.addFileButton} onClick={this.gotoEdit}>
          Add file
        </button>
      </div>
    );
  }
}

AddCodeFileButton.propTypes = {
  onAddCodeFile: PropTypes.func.isRequired,
};
