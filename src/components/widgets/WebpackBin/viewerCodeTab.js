import React, { Component, PropTypes } from 'react';
import { sortable } from 'react-sortable';
import styles from './viewerCodeTab.module.scss';

class CodeTab extends Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    draggingIndex: PropTypes.number,
    onTabSelect: PropTypes.func.isRequired,
    children: PropTypes.shape({
      fileName: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { selected, index, draggingIndex, onTabSelect } = this.props;
    const fileName = this.props.children.fileName;
    const style = {};

    if (index === draggingIndex) {
      style.borderBottom = '2px solid #f5945e'; // $orange-light
    } else if (selected) {
      style.borderLeft = '3px solid #58bd91'; // $base-green
      style.color = '#4DA981'; // $green-dark
      style.background = '#eee';
    }

    return (
      <div onClick={() => onTabSelect(index)}>
        <div
          className={styles.tabWrapper}
          style={style}
        >
          {fileName}
        </div>
      </div>
    );
  }
}

export default sortable(CodeTab);
