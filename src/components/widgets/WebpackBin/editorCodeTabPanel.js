import React, { Component, PropTypes } from 'react';
import styles from './editorCodeTabPanel.module.scss';
import CodeMirrorEditor from '../../helpers/codeeditor';

export default class CodeTabPanel extends Component {

  static propTypes = {
    codeContent: PropTypes.object.isRequired,
    onCodeChange: PropTypes.func.isRequired,
    codePanelHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      onlyCodeChanged: false,
    };
  }

  componentDidMount() {
    this.state.onlyCodeChanged = false;
  }

  componentDidUpdate() {
    this.state.onlyCodeChanged = false;
  }

  render() {
    const { codeContent, onCodeChange, codePanelHeight } = this.props;
    const height = `${codePanelHeight}px`;

    return (
      <div className={styles.codePanel} style={{ height: height }}>
        <CodeMirrorEditor
          codeContent={codeContent}
          onlyCodeChanged={this.state.onlyCodeChanged}
          onEditorChange={(value) => {
            this.state.onlyCodeChanged = true;
            onCodeChange(value);
          }}
        />
      </div>
    );
  }
}
