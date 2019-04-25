import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './viewer.module.scss';
import CodeTabsView from './viewerCodeTabs';
import OutputView from './outputView';
import genOutput from './genOutput';

@connect(({ ajaxMode:{ enabled }, router:{ params : { user_id, collection_id, page_id } } }) => ({
  isDemo: !enabled,
  author_id: user_id || null,
  collection_id: collection_id || null,
  page_id: page_id || null
}))
export default class WebpackBinViewer extends Component {

  static propTypes = {
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
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      outputUrl: null,
      executionInProgress: false,
      execError: null,
      codeContents: this.props.content.codeContents,
      onlyCodeChanged: false,
    };

    this.onUpdateCodeContents = this.onUpdateCodeContents.bind(this);
    this.onRunClicked = this.onRunClicked.bind(this);
    this.genOutputCallback = this.genOutputCallback.bind(this);
  }

  componentDidMount() {
    const { hideCodeView, codeContents, loaders, comp_id } = this.props.content;
    const { author_id, collection_id, page_id, isDraft } = this.props;

    if (hideCodeView) {
      genOutput(codeContents,
        loaders,
        author_id,
        collection_id,
        page_id,
        isDraft,
        comp_id,
        this.genOutputCallback);
    }
  }

  onUpdateCodeContents(codeContents, onlyCodeChanged=false) {
    this.setState({
      codeContents,
      onlyCodeChanged
    });
  }

  onRunClicked() {
    const { loaders, comp_id } = this.props.content;
    const { author_id, collection_id, page_id, isDraft } = this.props;

    genOutput(this.state.codeContents,
      loaders,
      author_id,
      collection_id,
      page_id,
      isDraft,
      comp_id,
      this.genOutputCallback);
  }

  genOutputCallback(executionInProgress, execError, outputUrl) {
    this.setState({
      executionInProgress,
      execError,
      outputUrl,
    });
  }

  render() {
    const {
      content: {
        showLineNumbers, theme, outputHeight, codePanelHeight, hideCodeView,
      }, default_themes } = this.props;

      let codeTheme = theme;
      if (theme === 'default' && default_themes && default_themes.SPA) {
        codeTheme = default_themes.SPA;
      }

    return (
      <div className={styles.viewerWrapper}>
        {
          !hideCodeView &&
          <CodeTabsView
            theme={codeTheme}
            showLineNumbers={showLineNumbers}
            codePanelHeight={codePanelHeight}
            codeContents={this.state.codeContents}
            onlyCodeChanged={this.state.onlyCodeChanged}
            executionInProgress={this.state.executionInProgress}
            onRunClicked={this.onRunClicked}
            onUpdateCodeContents={this.onUpdateCodeContents}
          />
        }

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