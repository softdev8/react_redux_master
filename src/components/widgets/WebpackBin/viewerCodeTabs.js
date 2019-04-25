import React, { Component, PropTypes } from 'react';
import styles from './viewerCodeTabs.module.scss';
import CodeTab from './viewerCodeTab';
import RunButton from '../../helpers/runCodeButton';
import CodeTabPanel from './viewerCodeTabPanel';
import TreeView from './filesTreeview/filesTreeview';
import { findTreeNode, parseTree } from './filesTreeview/treeUtils';

const cx = require('classnames');
require('./theme.css');
const Tree = require('../../helpers/react-ui-tree/react-ui-tree.js');
require('../../helpers/react-ui-tree/react-ui-tree.css');

export default class CodeTabs extends Component {
  onCodeChange = (content) => {
    const { codeContents, codeContents:{ selectedId } } = this.props;

    const updateCode = (node, content) => {
      node.data.content = content;
    }

    parseTree(codeContents, selectedId, updateCode, content);
    this.props.onUpdateCodeContents(codeContents, true);
  }

  handleChange = (tree) => {
    this.props.onUpdateCodeContents(codeContents, false);
  }

  onClickNode = (node) => {
    if (node.leaf) {
      const { codeContents } = this.props;
      codeContents.selectedId = node.id;

      this.props.onUpdateCodeContents(codeContents, false);
    }
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

    return(
      <span style={style}
        onClick={() => this.onClickNode(node)}
        className={
          cx('node', {
            'is-active': isActive
          })
        }
      >
        {name}
      </span>
    );
  }

  render() {
    const { showLineNumbers, theme,
      executionInProgress, onRunClicked, codePanelHeight, onlyCodeChanged } = this.props;

    const { codeContents, codeContents:{ selectedId } } = this.props;
    const activeNode = findTreeNode(codeContents, selectedId);

    const activeContent = {
      theme,
      lineNumbers: showLineNumbers,
      language: '',
      content: '',
    };

    if (activeNode) {
      const { content, language, highlightedLines } = activeNode.data;

      activeContent.content = content;
      activeContent.language = language;
      activeContent.highlightedLines = highlightedLines;
    }

    return (
      <div className={styles.container}>
        <div className={styles.tabslist}>
          <TreeView
              tree={codeContents}
              onChange={this.handleChange}
              renderNode={this.renderNode}
              draggable={false}
              treeHeight={codePanelHeight - 40}
              treeWidth={250}
          />
          <div
            style = {{
                textAlign: 'center',
                paddingTop: 10,
            }}
          >
            <RunButton
              executionInProgress={executionInProgress}
              onClick={onRunClicked}
            />
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

CodeTabs.propTypes = {
  onUpdateCodeContents: PropTypes.func.isRequired,
  onRunClicked: PropTypes.func.isRequired,
  codeContents: PropTypes.object.isRequired,
  onlyCodeChanged: PropTypes.bool.isRequired,
  showLineNumbers: PropTypes.bool.isRequired,
  codePanelHeight: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  executionInProgress: PropTypes.bool.isRequired,
};
