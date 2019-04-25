import React, { Component, PropTypes } from 'react';
import styles from './codeMultiFilesEditorTab.module.scss';

class CodeFileTab extends Component {

  static propTypes = {
    selected: PropTypes.bool.isRequired,
    onTabSelect: PropTypes.func.isRequired,
    fileName: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  };

  render() {
    const { selected, onTabSelect, fileName, index } = this.props;

    const tabStyle = {};

    if (selected) {
      tabStyle.borderLeft = '3px solid #58bd91'; // $base-green
      tabStyle.color = '#4DA981'; // $green-dark
      tabStyle.background = '#eee';
    }

    return (
      <div
        className={styles.tabWrapper}
        style={tabStyle}
        onClick={() => onTabSelect(index)}
      >
      {fileName}
      </div>
    );
  }
}

export default CodeFileTab;
