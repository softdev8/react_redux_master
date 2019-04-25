import React, { Component, PropTypes } from 'react';
import { sortable } from 'react-sortable';
import styles from './codeMultiFilesEditorTab.module.scss';
import EditText from '../../common/editabletext';
import { SomethingWithIcon, Icons } from '../../index';

class CodeFileTab extends Component {

  static propTypes = {
    onFilenameChange: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    draggingIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    onTabSelect: PropTypes.func.isRequired,
    onRemoveTab: PropTypes.func.isRequired,
    children: PropTypes.shape({
      fileName: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.onFilenameChange = this.onFilenameChange.bind(this);
  }

  onFilenameChange(filename) {
    this.props.onFilenameChange(filename, this.props.index);
  }

  render() {
    const { selected, index, draggingIndex, onTabSelect, onRemoveTab, onFilenameChange, ...props } = this.props;
    const { fileName, staticFile } = this.props.children;
    const tabStyle = {};
    const removeButtonStyle = {
      float: 'right',
      background: 'white',
    };

    if (index === draggingIndex) {
      tabStyle.borderLeft = '3px solid #f5945e'; // $orange-light
    } else if (selected) {
      tabStyle.borderLeft = '3px solid #58bd91'; // $base-green
      tabStyle.color = '#4DA981'; // $green-dark
      tabStyle.background = '#eee';
      removeButtonStyle.background = '#eee';
    }

    return (
      <div {...props} onClick={() => onTabSelect(index)}>
        <div className={styles.tabWrapper} style={tabStyle}>
          {
            staticFile ?
              fileName :
                <EditText
                  content={fileName}
                  onValueChange={this.onFilenameChange}
                  maxLength={19}
                />
          }
          {
            !staticFile &&
            <button
              className="cmcomp-glyphicon-remove"
              style={removeButtonStyle}
              onClick={() => onRemoveTab(index)}
            >
              <SomethingWithIcon icon={Icons.closeIcon1} />
            </button>
          }
        </div>
      </div>
    );
  }
}

export default sortable(CodeFileTab);
