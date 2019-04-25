import React, { Component, PropTypes } from 'react';
import styles from './codeMultiFilesEditor.module.scss';

import CodeFileTab from './codeMultiFilesEditorTab';
import CodeFileDefaultTab from './codeFileTab';
const CodeMirrorEditor = require('../../helpers/codeeditor');
import AddCodeFile from './codeMultiFilesEditorAddCodeFile';

export default class CodeMultiFilesEditor extends Component {
  static propTypes = {
    codeContent: PropTypes.shape({
      allowDownload: PropTypes.bool.isRequired,
      additionalContent: PropTypes.arrayOf(PropTypes.shape({
        fileName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
      })).isRequired,
      selectedIndex: PropTypes.number.isRequired,
    })
  }

  constructor(props) {
    super(props);

    this.state = {
      draggingIndex: null,
    };

    this.onAddCodeFile = this.onAddCodeFile.bind(this);
    this.onFilenameChange = this.onFilenameChange.bind(this);
    this.onRemoveTab = this.onRemoveTab.bind(this);
    this.onTabSelect = this.onTabSelect.bind(this);
    this.onDefaultTabSelect = this.onDefaultTabSelect.bind(this);
    this.onUpdateTabsOrder = this.onUpdateTabsOrder.bind(this);
    this.getDefaultTab = this.getDefaultTab.bind(this);
    this.getAdditionalTabs = this.getAdditionalTabs.bind(this);
  }

  onAddCodeFile(_content) {
    const content = _content;
    content.fileName = content.fileName.replace(/\s+/g, '');

    if (this.isValidFilename(content.fileName)) {
      const additionalContent = this.props.codeContent.additionalContent;
      additionalContent.unshift(content);

      this.props.handleMultiChange({
        selectedIndex: 1,
        additionalContent,
        onlyCodeChanged: false,
      });
    }
  }

  onRemoveTab(index) {
    const { additionalContent } = this.props.codeContent;

    additionalContent.splice(index, 1);

    this.props.handleMultiChange({
      additionalContent,
      selectedIndex: 0,
      onlyCodeChanged: false,
    });
  }

  onFilenameChange(_fileName, index) {
    const fileName = _fileName.replace(/\s+/g, '');
    if (this.isValidFilename(fileName)) {
      const { additionalContent } = this.props.codeContent;
      additionalContent[index].fileName = fileName;

      this.props.handleMultiChange({
        additionalContent
      });
    }
  }

  onUpdateTabsOrder(obj) {
    let draggingIndex = null;
    if ({}.hasOwnProperty.call(obj, 'draggingIndex')) {
      draggingIndex = obj.draggingIndex;
    }

    if ({}.hasOwnProperty.call(obj, 'items')) {

      this.props.handleMultiChange({
        additionalContent: obj.items,
        selectedIndex: isNaN(draggingIndex) ?
                        this.props.codeContent.selectedIndex :
                        draggingIndex + 1,
        onlyCodeChanged: false,
      });
    }

    this.setState({
      draggingIndex: obj.draggingIndex,
    });
  }

  onDefaultTabSelect(index) {
    this.props.onSelectedIndexChange(index);
  }

  onTabSelect(index) {
    if (index < this.props.codeContent.additionalContent.length) {
      this.props.onSelectedIndexChange(index + 1);
    }
  }

  isValidFilename(fileName) {
    if (!fileName || fileName.length === 0) {
      return false;
    }

    for (const content of this.props.codeContent.additionalContent) {
      if (content.fileName === fileName) {
        return false;
      }
    }

    return true;
  }

  getDefaultTab() {
    const { selectedIndex } = this.props.codeContent;

    return (
      <CodeFileDefaultTab
        fileName='default'
        selected={selectedIndex === 0}
        index={0}
        onTabSelect={this.onDefaultTabSelect}
      />
    );
  }

  getAdditionalTabs() {
    const { selectedIndex, additionalContent } = this.props.codeContent;

    const listItems = additionalContent.map((item, i) => {
      const childProps = {
        selected: selectedIndex === (i + 1),
        index: i,
        draggingIndex: this.state.draggingIndex,
        onTabSelect: this.onTabSelect,
        onRemoveTab: this.onRemoveTab,
        onFilenameChange: this.onFilenameChange,
      };

      return (
        <CodeFileTab
          key={i}
          updateState={this.onUpdateTabsOrder}
          items={additionalContent}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          childProps={childProps}
        >
          {item}
        </CodeFileTab>
      );
    });

    return listItems;
  }

  render() {
    const { selectedIndex, content, highlightedLines, language, theme,
      additionalContent, allowDownload } = this.props.codeContent;

    let srcCode = content;

    const codeContent = {
      content: srcCode,
      highlightedLines,
      language,
      theme
    };

    if (selectedIndex > 0 && selectedIndex <= additionalContent.length) {
      srcCode = additionalContent[selectedIndex-1].content;

      codeContent.content = srcCode;
      codeContent.highlightedLines = additionalContent[selectedIndex-1].highlightedLines;
    }

    const defaultTab = this.getDefaultTab();
    const additionalTabs = this.getAdditionalTabs();

    return (
      <div className={styles.container}>
        <div className={styles.tabslist}>
          <div className={styles.buttonsWrapper}>
            <AddCodeFile onAddCodeFile={this.onAddCodeFile} />
          </div>
          <div
            style={{
              display: 'block',
              overflowY: 'scroll',
              minHeight: 200,
              maxHeight: '65vh',
            }}
          >
          {defaultTab}
          {additionalTabs}
          </div>
        </div>
        <div
          className="cmcomp-single-editor-container"
          style={{ paddingLeft: 3 }}
        >
          <CodeMirrorEditor
            key="editor"
            codeContent={codeContent}
            readOnly={false}
            tabsAsSpaces={true}
            onlyCodeChanged={this.props.onlyCodeChanged}
            onEditorChange={this.props.onEditorChange}
          />
        </div>
      </div>
    );
  }
}
