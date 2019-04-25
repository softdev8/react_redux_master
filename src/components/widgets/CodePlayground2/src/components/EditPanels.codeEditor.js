import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import CodeMirrorEditor from '../../../../helpers/codeeditor';

export default class RunJSCodeEditor extends Component {
  getTabContent(type) {

    let language = type;
    if (type === 'js' || type === 'hiddenjs' || type === 'exercise') {
      language = 'javascript';
    }

    const activeContent = {
      content: this.props.panels[type],
      highlightedLines: this.props.panelsHighlightedLines[type],
      language,
      theme: this.props.theme,
      lineNumbers: this.props.showLineNumbers,
    };

    return (
      <CodeMirrorEditor
        codeContent={activeContent}
        readOnly={false}
        onlyCodeChanged={this.props.onlyCodeChanged}
        onEditorChange={(value) => {
          this.props.onCodeChange(type, value);
        }}
      />
    );
  }

  handleSelect = (index, last) => {
    let selectedPanel = 'html';

    switch(index) {
      case 0: selectedPanel = 'html'; break;
      case 1: selectedPanel = 'css'; break;
      case 2: selectedPanel = 'js'; break;
      case 3: selectedPanel = 'hiddenjs'; break;
    }

    this.props.onPanelSelect(selectedPanel);
  }

  render() {
    return (
      <div>
        <Tabs
          onSelect={this.handleSelect}
        >
          <TabList>
            <Tab>HTML</Tab>
            <Tab>CSS</Tab>
            <Tab>JavaScript</Tab>
            <Tab>JavaScript (hidden)</Tab>
            { this.props.exercise && <Tab>Exercise</Tab> }
          </TabList>

          <TabPanel>
            {this.getTabContent('html')}
          </TabPanel>
          <TabPanel>
            {this.getTabContent('css')}
          </TabPanel>
          <TabPanel>
            {this.getTabContent('js')}
          </TabPanel>
          <TabPanel>
            {this.getTabContent('hiddenjs')}
          </TabPanel>
          {
            this.props.exercise &&
            <TabPanel>
              {this.getTabContent('exercise')}
            </TabPanel>
          }
        </Tabs>
      </div>
    );
  }
}

RunJSCodeEditor.propTypes = {
  onCodeChange    : PropTypes.func.isRequired,
  onlyCodeChanged : PropTypes.bool.isRequired,
  theme           : PropTypes.string.isRequired,
  exercise        : PropTypes.bool.isRequired,
  showLineNumbers : PropTypes.bool.isRequired,
  panels          : PropTypes.shape({
    html     : PropTypes.string.isRequired,
    css      : PropTypes.string.isRequired,
    js       : PropTypes.string.isRequired,
    hiddenjs : PropTypes.string.isRequired,
  }).isRequired,
};
