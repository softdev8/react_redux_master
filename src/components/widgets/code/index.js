import React, { Component, PropTypes } from 'react';
import copy from 'copy-to-clipboard';
import { CodeMirrorOptions } from '../../helpers/codeoptions';

const CodeMirrorCaption = require('../../CaptionComponent/CaptionComponent');
const Runnable = require('../../helpers/runnable');
const CodeJudge = require('../../helpers/codejudge');
const CodeFiles = require('./codeFiles');

const defaultHiddenCode = { prependCode: '\n\n', appendCode: '\n\n', codeSelection: 'prependCode' };
const defaultSolutionContent = '\n\n\n';
const defaultJudgeContentPrepend = '\n\n\n';

class CodeMirrorComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSelectedIndexChange = this.handleSelectedIndexChange.bind(this);
    this.handleAdditionalContentChange = this.handleAdditionalContentChange.bind(this);
    this.handleJudgeChange = this.handleJudgeChange.bind(this);
    this.handleJudgeContentChange = this.handleJudgeContentChange.bind(this);
    this.handleJudgeContentPrependChange = this.handleJudgeContentPrependChange.bind(this);
    this.handleHiddenCodeContentChange = this.handleHiddenCodeContentChange.bind(this);
    this.handleEvaluateWithoutExecutionChange =
      this.handleEvaluateWithoutExecutionChange.bind(this);
    this.handleShowSolutionChange = this.handleShowSolutionChange.bind(this);
    this.handleSolutionContentChange = this.handleSolutionContentChange.bind(this);
    this.handleEnableHiddenCodeChange = this.handleEnableHiddenCodeChange.bind(this);
    this.handleEnableStdinChange = this.handleEnableStdinChange.bind(this);
    this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleRunnableChange = this.handleRunnableChange.bind(this);
    this.handleTreatOutputAsHTMLChange = this.handleTreatOutputAsHTMLChange.bind(this);
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleAllowDownloadChange = this.handleAllowDownloadChange.bind(this);
    this.handleHighlightedLinesChange = this.handleHighlightedLinesChange.bind(this);
    this.getHighlightedLines = this.getHighlightedLines.bind(this);

    this.state = {
      title                     : props.content.title,
      content                   : props.content.content,
      additionalContent         : props.content.additionalContent || [],
      selectedIndex             : props.content.selectedIndex || 0,
      caption                   : props.content.caption,
      language                  : props.content.language,
      theme                     : props.content.theme,
      runnable                  : props.content.runnable || false,
      judge                     : props.content.judge || false,
      judgeContent              : props.content.judgeContent,
      judgeHints                : props.content.judgeHints || null,
      judgeContentPrepend       : props.content.judgeContentPrepend || defaultJudgeContentPrepend,
      allowDownload             : props.content.allowDownload || false,
      treatOutputAsHTML         : props.content.treatOutputAsHTML || false,
      enableHiddenCode          : props.content.enableHiddenCode || false,
      enableStdin               : props.content.enableStdin || false,
      evaluateWithoutExecution  : props.content.evaluateWithoutExecution || false,
      showSolution              : props.content.showSolution || false,
      solutionContent           : props.content.solutionContent || defaultSolutionContent,
      hiddenCodeContent         : props.content.hiddenCodeContent || defaultHiddenCode,
      onlyCodeChanged           : false,
      highlightedLines          : props.content.highlightedLines
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title                     : nextProps.content.title,
      content                   : nextProps.content.content,
      additionalContent         : nextProps.content.additionalContent || [],
      selectedIndex             : nextProps.content.selectedIndex || 0,
      caption                   : nextProps.content.caption,
      language                  : nextProps.content.language,
      theme                     : nextProps.content.theme,
      runnable                  : nextProps.content.runnable || false,
      judge                     : nextProps.content.judge || false,
      allowDownload             : nextProps.content.allowDownload || false,
      treatOutputAsHTML         : nextProps.content.treatOutputAsHTML || false,
      enableHiddenCode          : nextProps.content.enableHiddenCode || false,
      enableStdin               : nextProps.content.enableStdin || false,
      evaluateWithoutExecution  : nextProps.content.evaluateWithoutExecution || false,
      showSolution              : nextProps.content.showSolution || false,
      solutionContent           : nextProps.content.solutionContent || defaultSolutionContent,
      hiddenCodeContent         : nextProps.content.hiddenCodeContent || defaultHiddenCode,
      judgeContent              : nextProps.content.judgeContent,
      judgeHints                : nextProps.content.judgeHints || null,
      judgeContentPrepend       : nextProps.content.judgeContentPrepend || defaultJudgeContentPrepend,
      onlyCodeChanged           : false,
      highlightedLines          : nextProps.content.highlightedLines
    });
  }

  handleAllowDownloadChange(value) {
    this.setState({ allowDownload:value, onlyCodeChanged:false });
  }

  handleCaptionChange(caption) {
    this.setState({ caption, onlyCodeChanged:false });
  }

  handleEditorChange(content) {
    const { selectedIndex, additionalContent } = this.state;

    if (selectedIndex === 0 || selectedIndex === undefined) {
      this.setState({ content, onlyCodeChanged:true });
    }
    else if (additionalContent.length > 0) {
      additionalContent[selectedIndex-1].content = content;

      this.setState({ additionalContent, onlyCodeChanged: true });
    }
  }

  handleSelectedIndexChange(selectedIndex) {
    this.setState({ selectedIndex, onlyCodeChanged: false });
  }

  handleAdditionalContentChange(additionalContent) {
    this.setState({ additionalContent, onlyCodeChanged: false });
  }

  handleJudgeChange(value) {
    this.setState({ judge:value, onlyCodeChanged:false });
  }

  handleJudgeContentChange(value, forceOverallChange) {
    let onlyCodeChanged = false;
    if (this.state.judgeContent) {
      if (value.edCode === this.state.judgeContent.edCode
        && value.version === this.state.judgeContent.version && !forceOverallChange) {
        onlyCodeChanged = true;
      }
    }
    this.setState({ judgeContent:value, onlyCodeChanged });
  }

  handleJudgeHintsChange = (judgeHints, onlyCodeChanged=false) => {
    this.setState({
      judgeHints,
      onlyCodeChanged
    });
  }

  handleJudgeContentPrependChange(value) {
    this.setState({
      judgeContentPrepend: value,
      onlyCodeChanged: true,
    });
  }

  handleHiddenCodeContentChange(value, forceOverallChange) {
    this.setState({
      hiddenCodeContent: value,
      onlyCodeChanged: !forceOverallChange
    });
  }

  handleShowSolutionChange(value) {
    this.setState({
      showSolution: value
    });
  }

  handleSolutionContentChange(value) {
    this.setState({
      solutionContent: value
    });
  }

  handleLanguageSelect(language) {
    this.setState({ language, onlyCodeChanged:false });
  }

  handleMultiChange(multiProps) {
    const obj = {};
    for (let key in multiProps) {
      if (multiProps.hasOwnProperty(key)) {
        obj[key] = multiProps[key];
      }
    }

    this.setState({
      ...obj,
    });
  }

  handleRunnableChange(value) {
    this.setState({ runnable:value, onlyCodeChanged:false });
  }

  handleThemeSelect(theme) {
     this.setState({ theme, onlyCodeChanged:false });
  }

  handleTreatOutputAsHTMLChange(value) {
    this.setState({ treatOutputAsHTML:value, onlyCodeChanged:false });
  }

  handleEnableHiddenCodeChange(value) {
    this.setState({ enableHiddenCode:value, onlyCodeChanged:false });
  }

  handleEnableStdinChange(value) {
    this.setState({ enableStdin:value, onlyCodeChanged:false });
  }

  handleEvaluateWithoutExecutionChange(value) {
    this.setState({ evaluateWithoutExecution: value });
  }

  handleHighlightedLinesChange(value) {
    const { selectedIndex, additionalContent } = this.state;

    if (selectedIndex === 0 || selectedIndex === undefined) {
      this.setState({ highlightedLines: value, onlyCodeChanged:false });
    }
    else if (additionalContent.length > 0) {
      additionalContent[selectedIndex-1].highlightedLines = value;

      this.setState({ additionalContent, onlyCodeChanged: false });
    }
  }

  getHighlightedLines() {
    const { selectedIndex, additionalContent } = this.state;

    if (selectedIndex === 0 || selectedIndex === undefined) {
      return this.state.highlightedLines;
    }
    else if (additionalContent.length > 0) {
      return additionalContent[selectedIndex-1].highlightedLines;
    }
  }

  saveComponent() {
    this.props.updateContentState({
      theme:this.state.theme,
      language:this.state.language,
      content:this.state.content,
      additionalContent: this.state.additionalContent,
      selectedIndex: this.state.selectedIndex,
      caption:this.state.caption,
      title:this.state.title,
      runnable: this.state.runnable,
      judge: this.state.judge,
      judgeContent: this.state.judgeContent,
      judgeHints: this.state.judgeHints,
      judgeContentPrepend: this.state.judgeContentPrepend,
      allowDownload: this.state.allowDownload,
      treatOutputAsHTML: this.state.treatOutputAsHTML,
      enableHiddenCode: this.state.enableHiddenCode,
      enableStdin: this.state.enableStdin,
      evaluateWithoutExecution: this.state.evaluateWithoutExecution,
      showSolution: this.state.showSolution,
      solutionContent: this.state.solutionContent,
      hiddenCodeContent: this.state.hiddenCodeContent,
      highlightedLines: this.state.highlightedLines,
    });
  }

  getCodeTheme() {
    if (this.state.theme === 'default' &&
        this.props.default_themes) {
      return this.props.default_themes.Code;
    }

    return this.state.theme;
  }

  render() {
    const readOnly = (this.props.mode !== 'edit');
    let codeOptions;

    if (!readOnly) {
      codeOptions = (<CodeMirrorOptions
        key="options"
        highlightedLines={this.getHighlightedLines()}
        language={this.state.language}
        theme={this.state.theme}
        runnable={this.state.runnable}
        judge={this.state.judge}
        allowDownload={this.state.allowDownload}
        treatOutputAsHTML={this.state.treatOutputAsHTML}
        enableHiddenCode={this.state.enableHiddenCode}
        enableStdin={this.state.enableStdin}
        evaluateWithoutExecution={this.state.evaluateWithoutExecution}
        showSolution={this.state.showSolution}
        onLanguageSelect={this.handleLanguageSelect}
        onThemeSelect={this.handleThemeSelect}
        onRunnableChange={this.handleRunnableChange}
        onJudgeChange={this.handleJudgeChange}
        onMultiChange={this.handleMultiChange}
        onAllowDownloadChange={this.handleAllowDownloadChange}
        onTreatOutputAsHTMLChange={this.handleTreatOutputAsHTMLChange}
        onEnableHiddenCodeChange={this.handleEnableHiddenCodeChange}
        onEnableStdinChange={this.handleEnableStdinChange}
        onEvaluateWithoutExecutionChange={this.handleEvaluateWithoutExecutionChange}
        onShowSolutionChange={this.handleShowSolutionChange}
        onHighlightedLinesChange={this.handleHighlightedLinesChange}
      />);
    }

    const codeFilesCodeContent = { ...this.state };
    codeFilesCodeContent.theme = this.getCodeTheme();

    return (
      <div className="code-container">
        {codeOptions}
        <CodeFiles
          readOnly={readOnly}
          codeContent={codeFilesCodeContent}
          onlyCodeChanged={this.state.onlyCodeChanged}
          onEditorChange={this.handleEditorChange}
          onSelectedIndexChange={this.handleSelectedIndexChange}
          onAdditionalContentChange={this.handleAdditionalContentChange}
          handleMultiChange={this.handleMultiChange}
        />

        {
          this.state.runnable ?
          <Runnable
            language={this.state.language}
            content={this.state.content}
            additionalContent={this.state.additionalContent}
            comp_id={this.props.content.comp_id}
            treatOutputAsHTML={this.state.treatOutputAsHTML}
            enableHiddenCode={this.state.enableHiddenCode}
            enableStdin={this.state.enableStdin}
            hiddenCodeContent={this.state.hiddenCodeContent}
            onHiddenCodeContentChange={this.handleHiddenCodeContentChange}
            onlyCodeChanged={this.state.onlyCodeChanged}
            mode={this.props.mode}
            language={this.state.language}
            theme={this.getCodeTheme()}
            isDraft={this.props.isDraft}
          /> : null
        }

        {
          this.state.judge ?
          <CodeJudge
            content={this.state.content}
            additionalContent={this.state.additionalContent}
            judgeContent={this.state.judgeContent}
            judgeHints={this.state.judgeHints}
            judgeContentPrepend={this.state.judgeContentPrepend}
            language={this.state.language}
            theme={this.getCodeTheme()}
            evaluateWithoutExecution={this.state.evaluateWithoutExecution}
            showSolution={this.state.showSolution}
            solutionContent={this.state.solutionContent}
            readOnly={readOnly}
            onlyCodeChanged={this.state.onlyCodeChanged}
            onJudgeContentChange={this.handleJudgeContentChange}
            onJudgeHintsUpdate={this.handleJudgeHintsChange}
            onJudgeContentPrependChange={this.handleJudgeContentPrependChange}
            onSolutionContentChange={this.handleSolutionContentChange}
            isDraft={this.props.isDraft}
            comp_id={this.props.content.comp_id}
          /> : null
        }

        <CodeMirrorCaption
          key="caption"
          caption={this.state.caption}
          readOnly={readOnly}
          onCaptionChange={this.handleCaptionChange}
        />

      </div>
    );
  }
}

CodeMirrorComponent.propTypes = {
  // TODO: check for existing props
  isDraft: PropTypes.bool.isRequired
};

CodeMirrorComponent.getComponentDefault = function () {
  const defaultContent = {
    version   : '5.0',
    caption   : '',
    language  : 'c++',
    title     : '',
    theme     : 'default',
    content   : '#include <iostream>\nusing namespace std;\n\nint main() {\n  // your code goes here\n  cout << \"Hello World\";\n  return 0;\n}',
    additionalContent: [],
    selectedIndex: 0,
    runnable  : false,
    judge     : false,
    judgeContent: null,
    judgeHints: null,
    allowDownload: false,
    treatOutputAsHTML: false,
    enableHiddenCode: false,
    enableStdin: false,
    hiddenCodeContent: null,
    evaluateWithoutExecution: false,
    showSolution: false,
    solutionContent: '\n\n\n',
  };
  return defaultContent;
};

module.exports = CodeMirrorComponent;
