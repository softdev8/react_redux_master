import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CodeTabsView from './editorCodeTabs';
import CodeOptions from './editorCodeOptions';
import OutputView from './outputView';
import genOutput from './genOutput';
import { findTreeNode, parseTree } from './filesTreeview/treeUtils';

@connect(({ ajaxMode:{ enabled }, router:{ params : { user_id, collection_id, page_id } } }) => ({
  isDemo: !enabled,
  author_id: user_id || null,
  collection_id: collection_id || null,
  page_id: page_id || null
}))
export default class WebpackBinEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outputUrl: null,
      executionInProgress: false,
      execError: null,
    };

    this.onThemeSelect = this.onThemeSelect.bind(this);
    this.onShowLineNumbers = this.onShowLineNumbers.bind(this);
    this.onHideCodeViewChange = this.onHideCodeViewChange.bind(this);
    this.onLoadersChange = this.onLoadersChange.bind(this);
    this.onCodePanelHeightChange = this.onCodePanelHeightChange.bind(this);
    this.onOutputHeightChange = this.onOutputHeightChange.bind(this);
    this.onHighlightedLinesChange = this.onHighlightedLinesChange.bind(this);
    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.onRunClicked = this.onRunClicked.bind(this);
    this.genOutputCallback = this.genOutputCallback.bind(this);
  }

  componentDidMount() {
    const { codeContents, loaders, comp_id } = this.props.content;
    const { author_id, collection_id, page_id, isDraft } = this.props;

    genOutput(codeContents,
      loaders,
      author_id,
      collection_id,
      page_id,
      isDraft,
      comp_id,
      this.genOutputCallback);
  }

  onThemeSelect(theme) {
    this.props.updateContentState({ theme });
  }

  onShowLineNumbers(showLineNumbers) {
    this.props.updateContentState({ showLineNumbers });
  }

  onHideCodeViewChange(hideCodeView) {
    this.props.updateContentState({ hideCodeView });
  }

  onLoadersChange(loaders) {
    this.props.updateContentState({ loaders });
  }

  onUpdateContent(content) {
    this.props.updateContentState(content);
  }

  onHighlightedLinesChange(highlightedLines) {
    const { codeContents, codeContents:{ selectedId } } = this.props.content;

    const updateHighlightedLines = (node, highlightedLines) => {
      node.data.highlightedLines = highlightedLines;
    }

    parseTree(codeContents, selectedId, updateHighlightedLines, highlightedLines);
    this.onUpdateContent({ codeContents });
  }

  getHighlightedLines = () => {
    let highlightedLines = '';

    const { codeContents, codeContents:{ selectedId } } = this.props.content;
    const activeNode = findTreeNode(codeContents, selectedId);

    if (activeNode && activeNode.data) {
      highlightedLines = activeNode.data.highlightedLines;
    }

    return highlightedLines;
  }

  onRunClicked() {
    const { codeContents, loaders, comp_id } = this.props.content;
    const { author_id, collection_id, page_id, isDraft } = this.props;

    genOutput(codeContents, loaders, author_id, collection_id, page_id, isDraft, comp_id, this.genOutputCallback);
  }

  genOutputCallback(executionInProgress, execError, outputUrl) {
    this.setState({
      executionInProgress,
      execError,
      outputUrl,
    });
  }

  onCodePanelHeightChange(codePanelHeight) {
    this.props.updateContentState({ codePanelHeight });
  }

  onOutputHeightChange(outputHeight) {
    this.props.updateContentState({ outputHeight });
  }

  getCodeTheme(){
    const { content: { theme }, default_themes } = this.props;

    if (theme === 'default' && default_themes && default_themes.SPA) {
      return default_themes.SPA;
    }

    return theme;
  }

  render() {
    const {
      content: {
        codeContents, showLineNumbers, theme,
        loaders, outputHeight, codePanelHeight, hideCodeView
      } } = this.props;

    return (
      <div>
        <CodeOptions
          theme={theme}
          showLineNumbers={showLineNumbers}
          hideCodeView={hideCodeView}
          loaders={loaders}
          outputHeight={outputHeight}
          codePanelHeight={codePanelHeight}
          highlightedLines={this.getHighlightedLines()}
          onThemeSelect={this.onThemeSelect}
          onHighlightedLinesChange={this.onHighlightedLinesChange}
          onShowLineNumbers={this.onShowLineNumbers}
          onHideCodeViewChange={this.onHideCodeViewChange}
          onLoadersChange={this.onLoadersChange}
          onOutputHeightChange={this.onOutputHeightChange}
          onCodePanelHeightChange={this.onCodePanelHeightChange}
        />
        <CodeTabsView
          codeContents={codeContents}
          showLineNumbers={showLineNumbers}
          codePanelHeight={codePanelHeight}
          theme={this.getCodeTheme()}
          onUpdateContent={this.onUpdateContent}
          onRunClicked={this.onRunClicked}
          executionInProgress={this.state.executionInProgress}
        />
        <OutputView
          outputHeight={outputHeight}
          outputUrl={this.state.outputUrl}
          executionInProgress={this.state.executionInProgress}
          execError={this.state.execError}
        />
      </div>
    );
  }
}

WebpackBinEditor.propTypes = {
  content: PropTypes.shape({
    codeContents: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool.isRequired,
    hideCodeView: PropTypes.bool.isRequired,
    loaders: PropTypes.object.isRequired,
    outputHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    codePanelHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    comp_id: PropTypes.string,
  }).isRequired,
  updateContentState: PropTypes.func.isRequired,
};
