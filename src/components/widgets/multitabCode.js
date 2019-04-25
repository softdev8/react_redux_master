import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import $ from 'jquery'
import { SomethingWithIcon, Icons } from '../index';
import update from 'react-addons-update';
import copy from 'copy-to-clipboard';

// Bootstrap components
import EditText from '../common/editabletext';
import CodeMirrorCaption from '../CaptionComponent/CaptionComponent';
import { Input, NavItem, Nav } from 'react-bootstrap';
import { CodeMirrorOptions } from '../helpers/codeoptions';
import CodeMirrorEditor from '../helpers/codeeditor';
import Runnable from '../helpers/runnable';
import CodeJudge from '../helpers/codejudge';
import CodeDownload from '../helpers/codedownload';

import Button from '../common/Button';
import Icon from '../common/Icon';

// Default code content values
const DefaultCodeContent = {
  title: 'Title',
  caption: '',
  language: 'javascript',
  theme: 'default',
  content: '\n\n\n\n\n\n\n',
  runnable: false,
  judge: false,
  judgeContent: null,
  judgeHints: null,
  judgeContentPrepend: '',
  allowDownload: false,
  treatOutputAsHTML: false,
  enableHiddenCode: false,
  enableStdin: false,
  hiddenCodeContent: null,
  evaluateWithoutExecution: false,
  showSolution: false,
  solutionContent: '',
};

const defaultHiddenCode = { prependCode: '\n\n', appendCode: '\n\n', codeSelection: 'prependCode' };

//------------------------------------------------------------------------------
// TABS COMPONENT
//------------------------------------------------------------------------------

/*
 * Handle the tabs for the different code contents of our component.
 * The tabs are sortable in edit mode.
 * When the tabs width is larger than the container, scrolling buttons are displayed.
 * Scrolling may also occur while dragging a tab.
 *
 * Available props:
 * tabs - array of tab definitions in the form { title: 'title', key: xxx }
 * activeTab - current selected tab
 * readOnly - disables title editing, tabs reordering and adding or removing tabs
 * onTabSelect(key) - callback when a tab is selected
 * onNewTab() - callback when new tab is added
 * onTabRemove(key) - callback when a tab is removed
 * onTabReorder(orderArray) - callback when tabs are reordered
 * onTitleChange(key, newTitle) - callback when tab title is changed
 */
class CodeMirrorTabs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cancelScroll = this.cancelScroll.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleNewTab = this.handleNewTab.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const tabsContainer = $(findDOMNode(this.refs.tabsContainer));
    if (!this.props.readOnly) {
      this.sortable = tabsContainer.find('.nav').sortable({
        axis: 'x',
        items: '.cmcomp-tab',
        scroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 40,
        tolerance: 'pointer',
        delay: 50,
        placeholder: 'cmcomp-tabs-placeholder',
        start: this.handleDrag,
        stop: this.handleDrop,
      });
    }

    tabsContainer.mousedown(function(){
      //This is done for elements in the component that have onBlur event
      //Jquery sortable eats the event so we have to force invoke it
      if($(document.activeElement).attr('id') == 'caption-component'){
        document.activeElement.blur();
      }
    });

    const height = tabsContainer.find('.nav').outerHeight();
    tabsContainer.parent().height(height);
    this.updateScrolling();
  }

  cancelScroll() {
    clearInterval(this.scrollInterval);
  }

  handleDrag(event, ui) {
    $(ui.placeholder).width(ui.item.width());
    const key = parseInt(ui.item[0].getAttribute('data-tab-key'));
    this.handleSelect(key);
  }

  handleDrop(event, ui) {
    const orders = [];
    const tabs = $(findDOMNode(this.refs.tabsContainer)).find('.cmcomp-tab');
    tabs.each(function (index) {
      orders.push(parseInt(this.getAttribute('data-tab-key')));
    });
    this.sortable.sortable('cancel');
    this.props.onTabReorder(orders);
  }

  handleNewTab() {
    this.props.onNewTab();
  }

  handleRemove(key) {
    this.props.onTabRemove(key);
  }

  handleSelect(key) {
    // tab selection issue: when modifying the title of the tab, this method is called
    // with a non valid key, which is weird and causes the current tab to get unselected.
    // workaround: test if the key is valid
    if (typeof key == 'number') {
      this.props.onTabSelect(key);
    }
  }

  handleTitleChange(key, title) {
    this.props.onTitleChange(key, title);
  }

  scroll(delta) {
    const tabsContainer = $(findDOMNode(this.refs.tabsContainer));
    this.scrollInterval = setInterval(function () {
      const scrollValue = tabsContainer.scrollLeft() + delta;
      tabsContainer.scrollLeft(scrollValue);
    }, 50);
  }

  scrollLeft() {
    this.scroll(-20);
  }

  scrollRight() {
    this.scroll(20);
  }

  updateScrolling() {
    const tabsContainer = $(findDOMNode(this.refs.tabsContainer));
    const tabsScrollLeft = $(findDOMNode(this.refs.tabsScrollLeft));
    const tabsScrollRight = $(findDOMNode(this.refs.tabsScrollRight));

    if (tabsContainer[0].scrollWidth > tabsContainer.width()) {
      tabsScrollLeft.css('visibility', 'visible');
      tabsScrollRight.css('visibility', 'visible');
      tabsContainer.css('margin-left', `${tabsScrollLeft.outerWidth()}px`);
      tabsContainer.css('margin-right', `${tabsScrollRight.outerWidth()}px`);
    } else {
      tabsScrollLeft.css('visibility', 'hidden');
      tabsScrollRight.css('visibility', 'hidden');
      tabsContainer.css('margin-left', '0px');
      tabsContainer.css('margin-right', '0px');
    }
  }

  render() {
    const self = this;
    const children = this.props.tabs.map(function (tab, i) {
      if (self.props.readOnly) {
        return (
          <NavItem className='cmcomp-tab' eventKey={tab.key} data-tab-key={tab.key} key={tab.key}>
            <span>{tab.title}</span>
          </NavItem>
        );
      } else {
        const tabRemove = function (e) {
          e.stopPropagation();
          e.preventDefault();

          self.handleRemove(tab.key);
        };
        const titleChange = function (title) {
          self.handleTitleChange(tab.key, title);
        };
        return (
          <NavItem className='cmcomp-tab' eventKey={tab.key} data-tab-key={tab.key} key={tab.key}>
            <EditText id='cmcomp-tab-edit-text' content={tab.title} onValueChange={titleChange}/>
            <div className='cmcomp-glyphicon-remove' onClick={tabRemove}>
              <SomethingWithIcon icon={Icons.closeIcon1}/>
            </div>
          </NavItem>
        );
      }
    });
    if (!this.props.readOnly) {
      children.push(<Button outlined onlyOnHover bsStyle='darkgreen45'
                            className='educative-codecomponent-add-button-control' key='tab-add'
                            onClick={this.handleNewTab}>
        <SomethingWithIcon icon={Icons.thinPlus1}/>
      </Button>);
    }
    return (
      <div className='cmcomp-tabs-container'>

        <Nav bsStyle='tabs'
             activeKey={this.props.activeTab}
             ref='tabsContainer'
             onSelect={this.handleSelect}>
          {children}
        </Nav>
        <Button className='cmcomp-tabs-scroll-left educative-codecomponent-scroll-control' ref='tabsScrollLeft'
                onMouseDown={this.scrollLeft} onMouseUp={this.cancelScroll}>
          <Icon glyph='glyphicon glyphicon-chevron-left'/>
        </Button>
        <Button className='cmcomp-tabs-scroll-right educative-codecomponent-scroll-control' ref='tabsScrollRight'
                onMouseDown={this.scrollRight} onMouseUp={this.cancelScroll}>
          <Icon glyph='glyphicon glyphicon-chevron-right'/>
        </Button>
      </div>
    );
  }
}

//------------------------------------------------------------------------------
// CODE MIRROR COMPONENT
//------------------------------------------------------------------------------

/*
 * This is the main component.
 *
 * Available props:
 * content - contains all component data
 * mode - view or edit
 */
class TabbedCodeComponent extends React.Component {

  static propTypes = {
    isDraft             : PropTypes.bool.isRequired,
    mode                : PropTypes.string.isRequired,
    updateContentState  : PropTypes.func.isRequired,
    content             : PropTypes.object.isRequired,
  };

  static getComponentDefault = () => {
    const defaultContent = {
      version: '5.0',
      caption: '',

      codeContents: [{
        language: 'c++',
        title: 'C++',
        theme: 'default',
        content: '#include <iostream>\nusing namespace std;\n\nint main() {\n  // your code goes here\n  cout << \"Hello World\";\n  return 0;\n}',
        caption: '',
        key: 0,
        runnable: false,
        judge: false,
        allowDownload: false,
        treatOutputAsHTML: false,
        judgeContent: null,
        judgeHints: null,
        judgeContentPrepend: '',
        enableHiddenCode: false,
        enableStdin: false,
        hiddenCodeContent: defaultHiddenCode,
        evaluateWithoutExecution: false,
        showSolution: false,
        solutionContent: '\n\n\n',
      }],
    };
    return defaultContent;
  };

  constructor(props, context) {
    super(props, context);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleJudgeChange = this.handleJudgeChange.bind(this);
    this.handleJudgeContentChange = this.handleJudgeContentChange.bind(this);
    this.handleJudgeContentPrependChange = this.handleJudgeContentPrependChange.bind(this);
    this.handleHiddenCodeContentChange = this.handleHiddenCodeContentChange.bind(this);
    this.handleEnableHiddenCodeChange = this.handleEnableHiddenCodeChange.bind(this);
    this.handleEnableStdinChange = this.handleEnableStdinChange.bind(this);
    this.handleEvaluateWithoutExecutionChange = this.handleEvaluateWithoutExecutionChange.bind(this);
    this.handleShowSolutionChange = this.handleShowSolutionChange.bind(this);
    this.handleSolutionContentChange = this.handleSolutionContentChange.bind(this);
    this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleNewTab = this.handleNewTab.bind(this);
    this.handleRunnableChange = this.handleRunnableChange.bind(this);
    this.handleAllowDownloadChange = this.handleAllowDownloadChange.bind(this);
    this.handleTreatOutputAsHTMLChange = this.handleTreatOutputAsHTMLChange.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabReorder = this.handleTabReorder.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabTitleChange = this.handleTabTitleChange.bind(this);
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleHighlightedLinesChange = this.handleHighlightedLinesChange.bind(this);

    const self = this;
    self.keygen = 0;
    const codeContents = [];
    props.content.codeContents.forEach((codeContent) => {
      codeContents.push(update(codeContent, {
        key: { $set: self.keygen++ },
      }));
    });

    const orders = codeContents.map((codeContent) => {
      return codeContent.key;
    });

    this.state = {
      codeContents,
      activeKey: (codeContents.length > 0) ? codeContents[0].key : null,
      orders,
      onlyCodeChanged: false,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    self.keygen = 0;
    const codeContents = [];
    nextProps.content.codeContents.forEach((codeContent) => {
      codeContents.push(update(codeContent, {
        key: { $set: self.keygen++ },
      }));
    });
    const orders = codeContents.map((codeContent) => {
      return codeContent.key;
    });

    let newActiveKey =  null;
    if (this.getCodeContentIndexByKey(this.state.activeKey) === -1) {
      newActiveKey = this.state.activeKey;
    } else if (codeContents.length > 0) {
      newActiveKey = codeContents[0].key;
    }

    this.setState({
      codeContents,
      activeKey: newActiveKey,
      orders,
      onlyCodeChanged: false,
    });
  }

  componentDidUpdate() {

  }

  getCodeContentByKey(key) {
    const index = this.getCodeContentIndexByKey(key);
    return (index >= 0) ? this.state.codeContents[index] : null;
  }

  getCodeContentIndexByKey(key) {
    const codeContents = this.state.codeContents;
    for (let i = 0; i < codeContents.length; i++) {
      if (codeContents[i].key === key) {
        return i;
      }
    }
    return -1;
  }

  handleAllowDownloadChange(allowDownload) {
    this.updateCodeContent(this.state.activeKey, 'allowDownload', allowDownload);
  }

  handleTreatOutputAsHTMLChange(treatOutputAsHTML) {
    this.updateCodeContent(this.state.activeKey, 'treatOutputAsHTML', treatOutputAsHTML);
  }

  handleCaptionChange(caption) {
    this.updateCodeContent(this.state.activeKey, 'caption', caption);
  }

  handleEditorChange(value) {
    this.getCodeContentByKey(this.state.activeKey).content = value;
    this.setState({
      onlyCodeChanged: true,
    });
  }

  handleJudgeChange(judge) {
    this.updateCodeContent(this.state.activeKey, 'judge', judge);
  }

  handleJudgeContentChange(value, forceOverallChange) {
    let onlyCodeChanged = false;
    const prevJudgeContent = this.getCodeContentByKey(this.state.activeKey).judgeContent;
    if (prevJudgeContent) {
      if (value.edCode === prevJudgeContent.edCode && value.version === prevJudgeContent.version && !forceOverallChange) {
        onlyCodeChanged = true;
      }
    }

    this.updateCodeContent(this.state.activeKey, 'judgeContent', value, onlyCodeChanged);
  }

  handleJudgeHintsChange = (value, onlyCodeChanged=false) => {
    this.updateCodeContent(this.state.activeKey, 'judgeHints', value, onlyCodeChanged);
  }

  handleJudgeContentPrependChange = (value) => {
    this.updateCodeContent(this.state.activeKey, 'judgeContentPrepend', value, true);
  }

  handleEnableHiddenCodeChange(value) {
    this.updateCodeContent(this.state.activeKey, 'enableHiddenCode', value);
  }

  handleEnableStdinChange(value) {
    this.updateCodeContent(this.state.activeKey, 'enableStdin', value);
  }

  handleHiddenCodeContentChange(value, forceOverallChange) {
    this.updateCodeContent(this.state.activeKey, 'hiddenCodeContent', value, !forceOverallChange);
  }

  handleEvaluateWithoutExecutionChange(value) {
    this.updateCodeContent(this.state.activeKey, 'evaluateWithoutExecution', value);
  }

  handleHighlightedLinesChange(value) {
    this.updateCodeContent(this.state.activeKey, 'highlightedLines', value);
  }

  handleShowSolutionChange(value) {
    this.updateCodeContent(this.state.activeKey, 'showSolution', value);
  }

  handleSolutionContentChange(value) {
    this.updateCodeContent(this.state.activeKey, 'solutionContent', value, true);
  }

  handleLanguageSelect(language) {
    this.updateCodeContent(this.state.activeKey, 'language', language);
  }

  handleMultiChange(multiProps) {
    this.updateCodeContentMulti(this.state.activeKey, multiProps);
  }

  handleNewTab() {
    const newCodeContent = {
      key: this.keygen++,
      title: DefaultCodeContent.title,
      caption: DefaultCodeContent.caption,
      language: DefaultCodeContent.language,
      theme: DefaultCodeContent.theme,
      content: DefaultCodeContent.content,
    };
    const codeContents = update(this.state.codeContents, { $push: [newCodeContent] });
    const orders = update(this.state.orders, { $push: [newCodeContent.key] });
    this.setState({
      codeContents,
      activeKey: newCodeContent.key,
      orders,
      onlyCodeChanged: false,
    });
  }

  handleRunnableChange(runnable) {
    this.updateCodeContent(this.state.activeKey, 'runnable', runnable);
  }

  handleTabRemove(key) {
    const removeIndex = this.getCodeContentIndexByKey(key);
    const codeContents = update(this.state.codeContents, { $splice: [[removeIndex, 1]] });
    const orderIndex = this.state.orders.indexOf(key);
    const orders = update(this.state.orders, { $splice: [[orderIndex, 1]] });
    let activeKey;

    if (orderIndex < orders.length) {
      // next tab, same order position
      activeKey = orders[orderIndex];
    } else if (orderIndex > 0) {
      // previous tab
      activeKey = orders[orderIndex - 1];
    } else {
      activeKey = null;
    }

    this.setState({
      codeContents,
      orders,
      activeKey,
      onlyCodeChanged: false,
    });
  }

  handleTabReorder(orders) {
    const codeContents = [];
    const self = this;
    orders.map((key) => {
      codeContents.push(self.getCodeContentByKey(key));
    });

    this.setState({
      codeContents,
      orders,
      onlyCodeChanged: false,
    });
  }

  handleTabSelect(key) {
    this.setState({
      activeKey: key,
      onlyCodeChanged: false,
    });
  }

  handleTabTitleChange(key, title) {
    this.updateCodeContent(key, 'title', title);
  }

  handleThemeSelect(theme) {
    this.updateCodeContent(this.state.activeKey, 'theme', theme);
  }

  saveComponent() {
    this.props.updateContentState({ codeContents : this.state.codeContents });
  }

  updateCodeContent(key, property, value, onlyCodeChanged) {
    const updateIndex = this.getCodeContentIndexByKey(key);
    const codeContent = $.extend(true, {}, this.state.codeContents[updateIndex]);
    codeContent[property] = value;
    const codeContents = update(this.state.codeContents, { $splice: [[updateIndex, 1, codeContent]] });
    this.setState({
      codeContents,
      onlyCodeChanged: onlyCodeChanged || false,
    });
  }

  updateCodeContentMulti(key, multiProps) {
    const updateIndex = this.getCodeContentIndexByKey(key);
    const codeContent = $.extend(true, {}, this.state.codeContents[updateIndex]);

    for (const prop in multiProps) {
      if (multiProps.hasOwnProperty(prop)) {
        codeContent[prop] = multiProps[prop];
      }
    }

    const codeContents = update(this.state.codeContents, { $splice: [[updateIndex, 1, codeContent]] });
    this.setState({
      codeContents,
      onlyCodeChanged: false,
    });
  }

  getCodeTheme(activeTheme) {
    if (activeTheme === 'default' &&
        this.props.default_themes) {
      return this.props.default_themes.Code;
    }

    return activeTheme;
  }

  render() {
    const tabs = this.state.codeContents.map((codeContent) => {
      return {
        key: codeContent.key,
        title: codeContent.title,
      };
    });

    const orders = this.state.orders;
    tabs.sort((a, b) => {
      return (orders.indexOf(a.key) - orders.indexOf(b.key));
    });
    const activeCodeContent = this.getCodeContentByKey(this.state.activeKey);
    const editorActiveCodeContent = { ...activeCodeContent };

    const readOnly = (this.props.mode !== 'edit');

    const children = [];
    let codeContainerStyle = {};

    children.push(<CodeMirrorTabs
      key="tabs"
      tabs={tabs}
      activeTab={this.state.activeKey}
      readOnly={readOnly}
      onTabSelect={this.handleTabSelect}
      onNewTab={this.handleNewTab}
      onTabRemove={this.handleTabRemove}
      onTabReorder={this.handleTabReorder}
      onTitleChange={this.handleTabTitleChange}
    />);

    if (activeCodeContent) {
      if (!readOnly) {
        children.push(<CodeMirrorOptions
          key="options"
          language={activeCodeContent.language}
          theme={activeCodeContent.theme}
          runnable={activeCodeContent.runnable}
          judge={activeCodeContent.judge}
          allowDownload={activeCodeContent.allowDownload}
          treatOutputAsHTML={activeCodeContent.treatOutputAsHTML}
          evaluateWithoutExecution={activeCodeContent.evaluateWithoutExecution}
          showSolution={activeCodeContent.showSolution}
          enableHiddenCode={activeCodeContent.enableHiddenCode}
          enableStdin={activeCodeContent.enableStdin}
          highlightedLines={activeCodeContent.highlightedLines}
          onRunnableChange={this.handleRunnableChange}
          onJudgeChange={this.handleJudgeChange}
          onLanguageSelect={this.handleLanguageSelect}
          onThemeSelect={this.handleThemeSelect}
          onMultiChange={this.handleMultiChange}
          onAllowDownloadChange={this.handleAllowDownloadChange}
          onTreatOutputAsHTMLChange={this.handleTreatOutputAsHTMLChange}
          onEvaluateWithoutExecutionChange={this.handleEvaluateWithoutExecutionChange}
          onShowSolutionChange={this.handleShowSolutionChange}
          onEnableHiddenCodeChange={this.handleEnableHiddenCodeChange}
          onEnableStdinChange={this.handleEnableStdinChange}
          onHighlightedLinesChange={this.handleHighlightedLinesChange}
        />);
      }

      editorActiveCodeContent.theme = this.getCodeTheme(activeCodeContent.theme);

      children.push(
        <div className="code-container" key="code-container">
          <CodeMirrorEditor
            key="editor"
            codeContent={editorActiveCodeContent}
            readOnly={readOnly}
            tabsAsSpaces
            onEditorChange={this.handleEditorChange}
            onlyCodeChanged={this.state.onlyCodeChanged}
          />
          {
            readOnly &&
            <div className="code-buttons">
              <div>
                <i
                  className="fa fa-files-o"
                  title="Copy to clipboard"
                  aria-hidden="true"
                  onClick={() => copy(activeCodeContent.content)}
                />
              </div>
              {
                activeCodeContent.allowDownload ?
                  <CodeDownload
                    content={activeCodeContent.content}
                    language={activeCodeContent.language}
                  >
                    <i
                      className="fa fa-download"
                      title="Download"
                      aria-hidden="true"
                    />
                  </CodeDownload> : null
              }
            </div>
          }
        </div>
      );

      if (activeCodeContent.runnable) {
        children.push(<Runnable
          key="runnableCode"
          language={activeCodeContent.language}
          content={activeCodeContent.content}
          treatOutputAsHTML={activeCodeContent.treatOutputAsHTML}
          enableHiddenCode={activeCodeContent.enableHiddenCode}
          enableStdin={activeCodeContent.enableStdin}
          hiddenCodeContent={activeCodeContent.hiddenCodeContent || defaultHiddenCode}
          onHiddenCodeContentChange={this.handleHiddenCodeContentChange}
          onlyCodeChanged={this.state.onlyCodeChanged}
          mode={this.props.mode}
          comp_id={this.props.content.comp_id}
          language={activeCodeContent.language}
          theme={this.getCodeTheme(activeCodeContent.theme)}
          isDraft={this.props.isDraft}
        />);
      }

      if (activeCodeContent.judge) {
        children.push(<CodeJudge key={`codeJudge`} content={activeCodeContent.content}
          judgeContent={activeCodeContent.judgeContent}
          judgeHints={activeCodeContent.judgeHints}
          judgeContentPrepend={activeCodeContent.judgeContentPrepend || ''}
          language={activeCodeContent.language}
          theme={this.getCodeTheme(activeCodeContent.theme)}
          isDraft={this.props.isDraft}
          evaluateWithoutExecution={activeCodeContent.evaluateWithoutExecution}
          showSolution={activeCodeContent.showSolution}
          solutionContent={activeCodeContent.solutionContent}
          readOnly={readOnly}
          comp_id={this.props.content.comp_id}
          onlyCodeChanged={this.state.onlyCodeChanged}
          onJudgeContentChange={this.handleJudgeContentChange}
          onJudgeHintsUpdate={this.handleJudgeHintsChange}
          onJudgeContentPrependChange={this.handleJudgeContentPrependChange}
          onSolutionContentChange={this.handleSolutionContentChange}
        />);
      }

      children.push(<CodeMirrorCaption
        key="caption"
        caption={activeCodeContent.caption}
        readOnly={readOnly}
        onCaptionChange={this.handleCaptionChange}
      />);
    }

    return (<div className="cmcomp-main" style={codeContainerStyle}>{children}</div>);
  }
}

module.exports = TabbedCodeComponent;
