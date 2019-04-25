import React, { Component, PropTypes } from 'react';
const cx = require('classnames');
import styles from './editorCodeTabs.module.scss';
import CodeTab from './editorCodeTab';
import AddCodeButton from './editorAddCodeButton';
import RunButton from '../../helpers/runCodeButton';
import CodeTabPanel from './editorCodeTabPanel';
import TreeView from './filesTreeview/filesTreeview';
import { findTreeNode, parseTree, deleteTreeNode } from './filesTreeview/treeUtils';
import cmLanguageFromFilename from '../../../utils/cmLanguageFromFilename';

export default class CodeTabs extends Component {

  static propTypes = {
    onUpdateContent: PropTypes.func.isRequired,
    onRunClicked: PropTypes.func.isRequired,
    codeContents: PropTypes.object.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
    codePanelHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    theme: PropTypes.string.isRequired,
    executionInProgress: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.onCodeChange = this.onCodeChange.bind(this);
    this.onFilenameChange = this.onFilenameChange.bind(this);
  }

  onAddCodeFile = (name) => {
    let filename = name.replace(/\s+/g, '');

    if (this.isValidFilename(filename)) {

      const { codeContents, codeContents:{ maxId } } = this.props;
      const newId = maxId + 1;

      codeContents.children.unshift({
        id: newId,
        module: filename,
        leaf: true,
        data: {
          content: '',
          language: cmLanguageFromFilename(filename),
          staticFile: false,
          hidden: false,
          highlightedLines: '',
        }
      });

      codeContents.maxId = newId;
      codeContents.selectedId = newId;

      this.props.onUpdateContent({ codeContents });
    }
  }

  onAddCodeFolder = (name) => {
    let foldername = name.replace(/\s+/g, '');

    if (this.isValidFilename(foldername)) {

      const { codeContents, codeContents:{ maxId } } = this.props;
      const newId = maxId + 1;

      codeContents.children.unshift({
        id: newId,
        module: foldername,
        leaf: false,
        children: []
      });

      codeContents.maxId = newId;

      this.props.onUpdateContent({ codeContents });
    }
  }

  onFilenameChange(_fileName, index) {
    // const fileName = _fileName.replace(/\s+/g, '');
    // if (this.isValidFilename(fileName)) {
    //   const codeContents = this.props.codeContents;
    //   codeContents[index].fileName = fileName;
    //   codeContents[index].language = cmLanguageFromFilename(fileName);
    //   this.props.onUpdateContent({ codeContents });
    // }
  }

  onCodeChange(content) {
    const { codeContents, codeContents:{ selectedId } } = this.props;

    const updateCode = (node, content) => {
      node.data.content = content;
    }

    parseTree(codeContents, selectedId, updateCode, content);
    this.props.onUpdateContent({ codeContents });
  }

  isValidFilename(fileName) {
    if (!fileName || fileName.length === 0) {
      return false;
    }

    // for (const content of this.props.codeContents) {
    //   if (content.fileName === fileName) {
    //     return false;
    //   }
    // }

    return true;
  }

  handleChange = (codeContents) => {
    this.props.onUpdateContent({ codeContents });
  }

  onClickNode = (node) => {
    if (node.leaf) {
      const { codeContents } = this.props;
      codeContents.selectedId = node.id;

      this.props.onUpdateContent({ codeContents });
    }
  }

  onRemoveNode = (node) => {
    console.log('_onRemoveNode', node);

    const { codeContents } = this.props;

    deleteTreeNode(codeContents, node.id);
    codeContents.selectedId = 0;

    // TODO: Select previous/next file

    this.props.onUpdateContent({ codeContents });
  }

  renderNode = (node) => {

    const { codeContents:{ selectedId } } = this.props;
    const isActive = node.id === selectedId;
    let name = node.module;
    let style = {};

    if (!node.leaf) {
      name = '▶ ' + name;
      style = {
        fontSize: 14,
        color: 'gray',
      };
    }
    else {
      style = {
        fontSize: 15
      };
    }

    let removeNode = null;
    if (node.id !== 0) {
      removeNode =  <i
                      style={{ marginLeft:10, float:'right', width:30, height:30, fontSize:16 }}
                      className="fa fa-times cmcomp-glyphicon-remove"
                      title="Remove"
                      aria-hidden="true"
                      onClick={() => this.onRemoveNode(node)}
                    />
    }

    return(
      <span style={style}>
        <span
          onClick={() => this.onClickNode(node)}
          className={
            cx('node', {
              'is-active': isActive
            })
          }
        >
          {name}
          {removeNode}
        </span>
      </span>
    );
  }

  render() {
    const { codeContents:{ selectedId }, codeContents, showLineNumbers, theme,
      executionInProgress, onRunClicked, codePanelHeight, onlyCodeChanged } = this.props;

    const activeContent = {
      theme,
      lineNumbers: showLineNumbers,
      language: 'javascript',
      content: '',
    };

    const activeNode = findTreeNode(codeContents, selectedId);
    if (activeNode) {
      const { content, language, highlightedLines } = activeNode.data;

      activeContent.content = content;
      activeContent.language = language;
      activeContent.highlightedLines = highlightedLines;
    }

    return (
      <div className={styles.container}>
        <div className={styles.tabslist}>
          <div className={styles.buttonsWrapper}>
            <AddCodeButton label="Add file" onAddCodeTab={this.onAddCodeFile} />
            <AddCodeButton label="Add folder" onAddCodeTab={this.onAddCodeFolder} />
          </div>
          <TreeView
              tree={codeContents}
              onChange={this.handleChange}
              renderNode={this.renderNode}
              draggable={true}
              treeHeight={codePanelHeight - 40}
              treeWidth={280}
          />
          <div
            style = {{
                textAlign: 'center',
                paddingTop: 10,
            }}
          >
            <RunButton executionInProgress={executionInProgress} onClick={onRunClicked} />
          </div>
        </div>
        <CodeTabPanel
          codeContent={activeContent}
          onCodeChange={this.onCodeChange}
          codePanelHeight={codePanelHeight}
          onlyCodeChanged={onlyCodeChanged}
        />
      </div>
    );
  }
}
