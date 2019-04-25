import React, { Component, PropTypes } from 'react';
import styles from './viewerCodeTabPanel.module.scss';
import CodeMirrorEditor from '../../helpers/codeeditor';

export default class CodeTabPanel extends Component {
  render() {
    const { codeContent, onCodeChange, codePanelHeight, onlyCodeChanged } = this.props;

    if (codeContent.language === 'javascript') {
      codeContent.language = 'jsx';
    }

    return (
      <div className={styles.codePanel} style={{ height: codePanelHeight }}>
        <CodeMirrorEditor
          codeContent={codeContent}
          onEditorChange={value => onCodeChange(value)}
          showRuler={false}
          onlyCodeChanged={onlyCodeChanged}
        />
      </div>
    );
  }
}

CodeTabPanel.propTypes = {
  codeContent: PropTypes.object.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  codePanelHeight: PropTypes.number.isRequired,
  onlyCodeChanged: PropTypes.bool.isRequired,
};
