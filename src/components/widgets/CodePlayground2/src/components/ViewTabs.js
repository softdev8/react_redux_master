import styles from './ViewTabs.module.scss';
import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CodeMirrorEditor from '../../../../helpers/codeeditor';
const RunButton = require('../../../../helpers/runCodeButton');
const JudgeButton = require('../../../../helpers/judgeCodeButton');

const DEFAULT_HEIGHT = 225;

export default class CodePlaygroundTabsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleRunClicked = this.handleRunClicked.bind(this);
  }

  componentDidMount() {
    if (this.props.autoRun) {
      this.props.onRunClicked();
    }
  }

  getResultView() {
    if (this.props.compiledHtml) {
      const style = {
        width: '100%',
        height: '100%',
        border: 'none',
      };

      if (this.props.height) {
        style.height = this.props.height.toString().indexOf('px') === -1 ?
          `${this.props.height}px` : this.props.height;
      }

      return (
        <iframe srcDoc={this.props.compiledHtml} style={style}></iframe>
      );
    }

    return <div />;
  }

  getTabContent(type) {
    if (type === 'result') {
      return this.getResultView();
    }

    // Render code tabs
    const language = type === 'js' ? 'javascript' : type;
    const { files, showLineNumbers, theme, onlyCodeChanged, onCodeChange,
      autoRun, readOnly, height, default_themes } = this.props;

    let highlightedLines = '';
    if (this.props.panelsHighlightedLines) {
      highlightedLines = this.props.panelsHighlightedLines[type];
    }

    let codeTheme = theme;
    if (theme === 'default' && default_themes) {
      codeTheme = default_themes.RunJS;
    }

    const activeContent = {
      language,
      theme: codeTheme,
      highlightedLines,
      content: files[type],
      lineNumbers: showLineNumbers,
    };

    return (
      <div className={styles.codeContainer} style={{ height: height || DEFAULT_HEIGHT }}>
        <CodeMirrorEditor
          codeContent={activeContent}
          readOnly={readOnly}
          showRuler={false}
          onlyCodeChanged={onlyCodeChanged}
          onEditorChange={(value) => {
            onCodeChange(type, value, autoRun);
          }}
        />
      </div>
    );
  }

  getTabsToShow() {
    const tabsToShow = [];
    const { hideCss, hideJs, hideHtml, hideResult, pane, autoRun, exercise } = this.props;
    let count = 0;
    let defaultTab = 0;

    if (!hideResult) {
      tabsToShow.push({
        title: 'Output',
        type: 'result',
      });

      if (pane === 'result') {
        defaultTab = count;
      }
      ++count;
    }

    if (!hideJs) {
      tabsToShow.push({
        title: 'JavaScript',
        type: 'js',
      });

      if (pane === 'js') {
        defaultTab = count;
      }
      ++count;
    }

    if (!hideHtml) {
      tabsToShow.push({
        title: 'HTML',
        type: 'html',
      });

      if (pane === 'html') {
        defaultTab = count;
      }
      ++count;
    }

    if (!hideCss) {
      tabsToShow.push({
        title: 'CSS',
        type: 'css',
      });

      if (pane === 'css') {
        defaultTab = count;
      }
      ++count;
    }

    if (this.state.selectedIndex !== null) {
      defaultTab = this.state.selectedIndex;
    }

    return (
      <Tabs selectedIndex={defaultTab} onSelect={this.handleSelect}>
        <TabList>
          {
            tabsToShow.map((tab, index) => {
              return (
                <Tab key={index}>{tab.title}</Tab>
              );
            })
          }
          {
            (!autoRun || exercise) &&
              <span
                style={{
                  float: 'right'
                }}
              >
                { !autoRun &&
                  <span style={{ marginLeft: 10 }}>
                    <RunButton onClick={this.handleRunClicked} executionInProgress={false}/>
                  </span>
                }
                {
                  exercise &&
                  <span style={{ marginLeft: 10 }}>
                    <JudgeButton onClick={this.props.onJudgeClicked} executionInProgress={false}/>
                  </span>
                }
              </span>
          }
        </TabList>
        {
          tabsToShow.map((tab, index) => {
            return (
              <TabPanel key={index}>{this.getTabContent(tab.type)}</TabPanel>
            );
          })
        }
      </Tabs>
    );
  }

  handleSelect(index) {
    this.setState({
      selectedIndex: index,
    });
  }

  handleRunClicked() {
    let selectedIndex = this.state.selectedIndex;
    if (!this.props.hideResult) {
      selectedIndex = 0;
    }

    this.setState({
      selectedIndex,
    }, this.props.onRunClicked());
  }

  render() {
    const { hideNav, hideResult } = this.props;
    let compDisplay = null;

    if (hideNav) {
      compDisplay = this.getTabContent('result');
    } else {
      compDisplay = this.getTabsToShow();
    }

    return (
      <div>
        {compDisplay}
        {
          hideResult &&
          <div style={{ display: 'none' }}>{this.getResultView()}</div>
        }
      </div>
    );
  }
}

CodePlaygroundTabsView.propTypes = {
  hideCss         : PropTypes.bool.isRequired,
  hideHtml        : PropTypes.bool.isRequired,
  hideJs          : PropTypes.bool.isRequired,
  hideResult      : PropTypes.bool.isRequired,
  hideNav         : PropTypes.bool.isRequired,
  showLineNumbers : PropTypes.bool.isRequired,
  autoRun         : PropTypes.bool.isRequired,
  onlyCodeChanged : PropTypes.bool.isRequired,
  onCodeChange    : PropTypes.func.isRequired,
  onRunClicked    : PropTypes.func.isRequired,
  onJudgeClicked  : PropTypes.func.isRequired,
  pane            : PropTypes.string.isRequired,
  theme           : PropTypes.string.isRequired,
  readOnly        : PropTypes.bool.isRequired,
  compiledHtml    : PropTypes.string,
  height          : PropTypes.string,
  files           : PropTypes.objectOf(PropTypes.string).isRequired,
};
