import React from 'react'

import styles from './quiz.module.scss';
import {FormControl, NavItem, Nav, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {SomethingWithIcon, Icons} from '../index';
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';

const MarkdownEditor = require('../helpers/markdownEditor');
const MarkdownViewer = require('../helpers/markdownViewer');

const Icon = require('../common/Icon');
const Button = require('../common/Button');
const Table = require('../common/Table.js');

//------------------------------------------------------------------------------
// QuizComponent
//------------------------------------------------------------------------------
/*
 * Сomponent for creating, editing and take quizes
 *
 * Available props:
 * mode - (string) ('view' or 'edit'), allow creating/editing quiz or take quizes
 * saveHandler - (fn) handler is triggered when press save button in edit mode
 * cancelHandler - (fn) handler is triggered when  press 'cancel' button in edit mode or 'done' button in view mode
 * content - (object) contains a quiz. Content is the current state of the quiz component.
 * Example of quiz schema (content):
 *    {
 *    title: 'The main quiz',
 *
 *    renderMode: 'continuous',
 *    questions: [
 *    {
 *        questionText: 'Which city is the capital of US?',
 *        questionOptions: [
 *        { correct:false, text: 'New Yark' },
 *        { correct:true, text: 'Washington' },
 *        ],
 *    },
 *    {
 *        questionText: 'Which city is the capital of Republic of Belarus?',
 *        questionOptions: [
 *        { correct:true, text: 'Minsk' },
 *        { correct:false, text: 'Brest' },
 *        { correct:false, text: 'Vitebsk' }
 *        ],
 *    },
 *   ],
 *   }
 */

class QuizComponent extends React.Component {
  saveComponent() {
    if(this.refs.QuizEditComponent){
      this.refs.QuizEditComponent.saveComponent();
    }
  }

  render() {

    let component = null;
    if (this.props.mode == 'view') {
      component = (<QuizViewModeComponent
        content={this.props.content}
        quizCancelHandler={this.props.cancelHandler}/>)
    }

    if (this.props.mode == 'edit') {
      component = (<QuizEditModeComponent
        ref='QuizEditComponent'
        content={this.props.content}
        quizSaveHandler={this.props.saveHandler}
        quizCancelHandler={this.props.cancelHandler}
        updateContentState={this.props.updateContentState}/>)
    }

    return (
      <div>
        {component}
      </div>
    );
  }
}

QuizComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '1.0',
    title: '',
    renderMode: 'continuous',
    questions: [{
      questionText: '',
      questionOptions: [],
    }],
  };
  return defaultContent;
};

QuizComponent.propTypes = {
  mode: React.PropTypes.oneOf(['view', 'edit']).isRequired,

  content: React.PropTypes.shape({
    title: React.PropTypes.string,
    renderMode: React.PropTypes.string,
    questions: React.PropTypes.array.isRequired,
  }).isRequired,

  saveHandler: React.PropTypes.func,
  cancelHandler: React.PropTypes.func,
};

//------------------------------------------------------------------------------
// QuizEditModeComponent
//------------------------------------------------------------------------------

class QuizEditModeComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.changeQuestionOrderHandler = this.changeQuestionOrderHandler.bind(this);
    this.createQuestionHandelr = this.createQuestionHandelr.bind(this);
    this.deleteQuestionHandler = this.deleteQuestionHandler.bind(this);
    this.questionCancelHandler = this.questionCancelHandler.bind(this);
    this.questionSaveHandler = this.questionSaveHandler.bind(this);
    this.selectQuestionHandler = this.selectQuestionHandler.bind(this);
    this.setRenderModeHandler = this.setRenderModeHandler.bind(this);
    this.titleChangeHandler = this.titleChangeHandler.bind(this);

    this.state = {
      currentQuestion: 0,
      quizData: this.emptyQuizGuard(props.content),
      onlyCodeChanged: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({quizData: nextProps.content});
  }

  changeQuestionOrderHandler(newOrder) {

    const newQuestionsCollection = [];

    for (let i = 0; i < newOrder.length; i++) {
      newQuestionsCollection.push(this.state.quizData.questions[newOrder[i]]);
    }
    this.state.quizData.questions = newQuestionsCollection;
    this.updateState();
  }

  createQuestionHandelr() {
    const newQuestion = {
      questionText: '',
      questionOptions: [],
    };

    this.state.quizData.questions.push(newQuestion);

    this.setState ({currentQuestion: (this.state.quizData.questions.length - 1)});

    this.updateState();
  }

  deleteQuestionHandler(id) {
    if (this.state.quizData.questions.length == 1) {
      return;
    }

    if (this.state.currentQuestion >= id) {
      let newIndex = this.state.currentQuestion - 1;
      if (newIndex < 0) {
        newIndex = 0;
      }

      this.setState({currentQuestion: newIndex});
    }

    this.state.quizData.questions.splice(id, 1);

    this.updateState();
  }

  emptyQuizGuard(content) {
    if (content.questions == null) {
      content.questions = [];
    }
    if (content.questions.length == 0) {
      content.questions.push({
        questionText: '',
        questionOptions: [],
      });
    }

    return content;
  }

  questionCancelHandler() {
    if (this.props.quizCancelHandler != null) {
      this.props.quizCancelHandler();
    }
  }

  questionSaveHandler() {
    if (this.props.quizSaveHandler != null) {
      this.props.quizSaveHandler();
    }
  }

  saveComponent() {
    this.props.updateContentState({
      version: this.state.quizData.version,
      title: this.state.quizData.title,
      titleMdHtml: this.state.quizData.titleMdHtml,
      renderMode: this.state.quizData.renderMode,
      questions: this.state.quizData.questions,
    });
  }

  selectQuestionHandler(id) {
    this.setState({currentQuestion: id});
  }

  setRenderModeHandler(newRenderMode) {
    this.state.quizData.renderMode = newRenderMode;
    this.updateState();
  }

  titleChangeHandler({ mdText, mdHtml }) {
    this.state.quizData.title = mdText;
    this.state.quizData.titleMdHtml = mdHtml;
    this.state.onlyCodeChanged = true;
    this.updateState();
  }

  updateState() {
    this.setState({quizData: this.state.quizData});
  }

  render() {
    return (
      <div>
        <div className='edcomp-toolbar'>
          <div style={{padding:1}}>
            <QuizModeChanger mode={this.state.quizData.renderMode} setRenderModeHandler={this.setRenderModeHandler}/>
          </div>
        </div>
        <form>
          <div className="form-group" style={{marginBottom:20, marginTop:20}}>
            <MarkdownEditor
              mdText={this.state.quizData.title}
              placeholder={'Quiz Title ...'}
              onlyCodeChanged={this.state.onlyCodeChanged}
              onMarkdownUpdated={this.titleChangeHandler}
            />
          </div>
          <div>
            <QuestionsTabsComponent currentQuestion={this.state.currentQuestion}
                                    deleteQuestionHandler={this.deleteQuestionHandler}
                                    changeQuestionOrderHandler={this.changeQuestionOrderHandler}
                                    createQuestionHandelr={this.createQuestionHandelr}
                                    selectQuestionHandler={this.selectQuestionHandler}
                                    data={this.state.quizData.questions}/>
          </div>
          <br />

          <QuestionEditComponent ref="questionEditor"
                                 index={this.state.currentQuestion}
                                 key={this.state.currentQuestion}
                                 questionSaveHandler={this.questionSaveHandler}
                                 questionCancelHandler={this.questionCancelHandler}
                                 data={this.state.quizData.questions[this.state.currentQuestion]}/>

        </form>
      </div>
    );
  }
}

class QuizModeChanger extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.setContinuousHandler = this.setContinuousHandler.bind(this);
    this.setSlideHandler = this.setSlideHandler.bind(this);
  }

  setContinuousHandler() {
    this.props.setRenderModeHandler('continuous');
  }

  setSlideHandler() {
    this.props.setRenderModeHandler('slide');
  }

  render() {

    const cx = classnames;
    const slideClass = cx({
      btn: true,
      'btn-default': true,
      'mode-button': true,
      active: this.props.mode == 'slide',
    });

    const continuousClass = cx({
      btn: true,
      'btn-default': true,
      'mode-button': true,
      active: this.props.mode == 'continuous',
    });

    return (
      <div className="btn-group mode-changer-container" role="group">
        <button type="button" onClick={this.setSlideHandler} className={slideClass}>Slide</button>
        <button type="button" onClick={this.setContinuousHandler} className={continuousClass}>Continuous</button>
      </div>);
  }
}

class QuestionsTabsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cancelScroll = this.cancelScroll.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.selectQuestionHandler = this.selectQuestionHandler.bind(this);
  }

  componentDidMount() {
    const tabsContainer = $(findDOMNode(this));
    this.sortable = tabsContainer.sortable({
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

    const height = tabsContainer.find('.nav').outerHeight();
    this.updateScrolling();
  }

  componentDidUpdate() {
    this.updateScrolling();
  }

  cancelScroll() {
    clearInterval(this.scrollInterval);
  }

  /**/
  deleteQuestionHandler(index) {
    this.props.deleteQuestionHandler(index);
  }

  handleDrag(event, ui) {
    $(ui.placeholder).width(ui.item.width());
    const key = parseInt(ui.item[0].getAttribute('data-tab-key'));
    this.selectQuestionHandler(key);
  }

  handleDrop(event, ui) {
    const orders = [];
    const tabs = $(findDOMNode(this.refs.tabsContainer)).find('.cmcomp-tab');
    tabs.each(function (index) {
      orders.push(parseInt(this.getAttribute('data-tab-key')));
    });
    this.sortable.sortable('cancel');
    this.props.changeQuestionOrderHandler(orders);
  }

  renderTabs() {
    const navTabs = [];
    const self = this;

    const makeSelectHandler = function (i) {
      return function (e) {
        e.stopPropagation();
        e.preventDefault();
        self.deleteQuestionHandler(i);
      };
    };

    for (let i = 0; i < this.props.data.length; i++) {
      const tabRemove = makeSelectHandler(i);

      navTabs.push(<NavItem className='cmcomp-tab' eventKey={i} data-tab-key={i} key={i}>
        <div className="question-tab-label">Q{i + 1}</div>
        <div className='question-tab-remove' onClick={tabRemove}>
          <SomethingWithIcon icon={Icons.closeIcon1}/>
        </div>
      </NavItem>);

    }
    ;

    navTabs.push(<Button outlined onlyOnHover bsStyle='darkgreen45'
                         className='educative-codecomponent-add-button-control'
                         key='tab-add' onClick={this.props.createQuestionHandelr}>
      <SomethingWithIcon icon={Icons.thinPlus1}/>
    </Button>);

    return navTabs;

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

  selectQuestionHandler(index) {
    this.props.selectQuestionHandler(index);
  }

  /* scroll */
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
    return (
      <div className='cmcomp-tabs-container questions-tabs'>
        <Nav bsStyle='tabs'
             activeKey={this.props.currentQuestion}
             ref='tabsContainer'
             onSelect={this.selectQuestionHandler}>
          {this.renderTabs()}
        </Nav>
        <Button className='cmcomp-tabs-scroll-left educative-codecomponent-scroll-control' ref='tabsScrollLeft'
                onMouseDown={this.scrollLeft} onMouseUp={this.cancelScroll}>
          <Icon glyph='glyphicon glyphicon-chevron-left'/>
        </Button>
        <Button className='cmcomp-tabs-scroll-right educative-codecomponent-scroll-control' ref='tabsScrollRight'
                onMouseDown={this.scrollRight} onMouseUp={this.cancelScroll}>
          <Icon glyph='glyphicon glyphicon-chevron-right'/>
        </Button>
      </div>);
  }
}

var QuestionEditComponent = React.createClass({
  getInitialState() {
    return {
      data: this.props.data,
      onlyCodeChanged: false
    };
  },

  componentDidMount() {
    const optionContainer = $(findDOMNode(this)).find('.options-containter');
    this.optionsSortable = optionContainer.sortable({
      axis: 'y',
      items: '.option-item',
      scroll: true,
      scrollSensitivity: 50,
      scrollSpeed: 40,
      tolerance: 'pointer',
      delay: 50,
      handle: '.handle',
      stop: this.handleDrop,
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data});
  },

  cancelHandler() {
    this.props.questionCancelHandler();
  },

  changeOptionOrderHandler(newOrder) {
    const newquestionOptions = [];

    for (let i = 0; i < newOrder.length; i++) {
      newquestionOptions[i] = this.state.data.questionOptions[newOrder[i]];
    }

    this.state.data.questionOptions = newquestionOptions;
    this.updateState();
  },

  createOptionHandler(optionIndex, optionText, correct) {
    const newOption = {
      text: optionText,
      correct,
    };
    this.state.data.questionOptions[optionIndex] = newOption;
    this.state.onlyCodeChanged = false;
    this.updateState();
  },

  deleteOptionHandler(optionIndex) {
    this.state.data.questionOptions.splice(optionIndex, 1);
    this.updateState();
  },

  handleDrop(event, ui) {
    const orders = [];
    const options = $(findDOMNode(this.refs.optionContainer)).find('.option-item');
    options.each(function (index) {
      orders.push(parseInt(this.getAttribute('data-option-id')));
    });
    this.optionsSortable.sortable('cancel');
    this.changeOptionOrderHandler(orders);
  },

  labels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

  questionTextHandler(questionData) {
    this.state.data.questionText = questionData.mdText;
    this.state.data.questionTextHtml = questionData.mdHtml;
    this.state.onlyCodeChanged = true;

    this.updateState();
  },

  renderOptions() {

    const options = [];

    if (this.state.data.questionOptions == null) {
      return options;
    }

    let i = 0;
    for (; i < this.state.data.questionOptions.length; i++) {
      options.push(<QuestionOptionEditComponent index={i}
                                                key={i}
                                                label={this.labels[i]}
                                                data={this.state.data.questionOptions[i]}
                                                isDummy={false}
                                                dragBag={this.dragBag}
                                                onlyCodeChanged={this.state.onlyCodeChanged}
                                                updateOptionHandler={this.updateOptionHandler}
                                                deleteOptionHandler={this.deleteOptionHandler}/>);
    }

    options.push(<QuestionOptionEditComponent index={i}
                                              key={i}
                                              label={this.labels[i]}
                                              data={{}}
                                              isDummy={true}
                                              onlyCodeChanged={this.state.onlyCodeChanged}
                                              createOptionHandler={this.createOptionHandler}/>);

    return options;
  },

  saveHandler() {
    this.props.questionSaveHandler();
  },

  updateOptionHandler(optionIndex, optionText, optionTextHtml, correct, onlyCodeChanged) {
    this.state.data.questionOptions[optionIndex].text = optionText;
    this.state.data.questionOptions[optionIndex].mdHtml = optionTextHtml;
    this.state.data.questionOptions[optionIndex].correct = correct;
    this.state.onlyCodeChanged = onlyCodeChanged;
    this.updateState();
  },

  updateState() {
    this.setState({
      data: this.state.data,
      onlyCodeChanged: this.state.onlyCodeChanged
    });
  },

  render() {
    return (
      <div>
        <div className="form-group">
          <MarkdownEditor
            mdText={this.state.data.questionText}
            placeholder={'Type your question here...'}
            onlyCodeChanged={this.state.onlyCodeChanged}
            onMarkdownUpdated={this.questionTextHandler}
          />
        </div>

        <div ref="optionContainer" className="options-containter">
          {this.renderOptions()}
        </div>
        <p style={{marginBottom: 20}}>
          <small><span className="glyphicon glyphicon-info-sign"></span> <em>Move answers around by dragging the letters.
            Remove an answer by deleting the text and exiting the field. Select the correct answer(s) by toggling the
            checkboxes.</em></small>
        </p>
      </div>
    );
  },
});

class QuestionOptionEditComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.answerChangeHandler = this.answerChangeHandler.bind(this);
    this.createNewOption = this.createNewOption.bind(this);
    this.onBlurTextHandler = this.onBlurTextHandler.bind(this);
    this.textChangeHandler = this.textChangeHandler.bind(this);
  }

  answerChangeHandler(event) {
    const checked = event.target.checked;
    this.props.updateOptionHandler(this.props.index, this.props.data.text, this.props.data.mdHtml, checked, false);
  }

  createNewOption(event) {
    const newText = event.target.value;
    this.props.createOptionHandler(this.props.index, newText, this.props.data.correct);
  }

  onBlurTextHandler(event) {
    if (this.props.data.text === '') {
      this.props.deleteOptionHandler(this.props.index);
    }
  }

  renderBody() {
    if (this.props.isDummy) {
      return (
        <div className="input-group option-item-wrapper">
          <FormControl className={styles.quizInputForm}
            style={{ paddingLeft:20 }}
            componentClass="textarea"
            onClick={this.createNewOption}
            placeholder="Add answer"
          />
          <span className="input-group-addon">
            <input className="disabled" type="checkbox" checked={false}/>
          </span>
        </div>
      );
    }

    return (
      <div className="input-group option-item option-item-wrapper" data-option-id={this.props.index}>
        <span className="input-group-addon handle option-label">
          {this.props.label}
        </span>
        <div onBlur={this.onBlurTextHandler}>
          <MarkdownEditor
            mdText={this.props.data.text}
            placeholder={'Type option here ...'}
            onlyCodeChanged={this.props.onlyCodeChanged}
            onMarkdownUpdated={this.textChangeHandler}
          />
        </div>
        <span className="input-group-addon">
        <OverlayTrigger placement='bottom' overlay={<Tooltip id={"Check answers"}>Check to indicate correct answer</Tooltip>}>
          <input type="checkbox" onChange={this.answerChangeHandler} checked={this.props.data.correct}/>
        </OverlayTrigger>
        </span>
      </div>
    );
  }

  textChangeHandler(optionText) {
    let { mdText, mdHtml } = optionText;

    if (!mdText || mdText === '') {
      this.props.deleteOptionHandler(this.props.index);
    }
    else {
      this.props.updateOptionHandler(this.props.index, mdText, mdHtml, this.props.data.correct, true);
    }
  }

  render() {
    return (
      <div className="form-group">
        {this.renderBody()}
      </div>
    );
  }
}

//------------------------------------------------------------------------------
// QuizViewModeComponent
//------------------------------------------------------------------------------

class QuizViewModeComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.exitHandler = this.exitHandler.bind(this);
    this.retakeHandlert = this.retakeHandlert.bind(this);
    this.submitQuizHandler = this.submitQuizHandler.bind(this);
    this.userSelectionHandler = this.userSelectionHandler.bind(this);
    this.state = {quizData: this.initializeQuiz(props.content)};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      quizData : this.initializeQuiz(nextProps.content),
    });
  }

  exitHandler() {
    if (this.props.quizCancelHandler != null) {
      this.props.quizCancelHandler();
    }
  }

  initializeQuiz(content) {
    const quizData = content;
    quizData.mode = 'active';
    for (let i = 0; i < quizData.questions.length; i++) {
      for (let j = 0; j < quizData.questions[i].questionOptions.length; j++) {
        quizData.questions[i].questionOptions[j].selected = false;
        quizData.questions[i].status = 'none';
        quizData.questions[i].questionOptions[j].status = 'none';

        if (i != 0) {
          quizData.questions[i].current = false;
        }
        else {
          quizData.questions[i].current = true;
        }

      }
    }

    return quizData;
  }

  renderQuestionRenderer() {
    if (this.state.quizData.renderMode == 'continuous') {
      return (
        <QuestionContinuousRenderer questions={this.state.quizData.questions}
                                    userSelectionHandler={this.userSelectionHandler}
                                    submitQuizHandler={this.submitQuizHandler}
                                    retakeHandlert={this.retakeHandlert}
                                    exitHandler={this.exitHandler}
                                    mode={this.state.quizData.mode}/> );
    }

    if (this.state.quizData.renderMode == 'slide') {
      return (
        <QuestionSlideRenderer questions={this.state.quizData.questions}
                               userSelectionHandler={this.userSelectionHandler}
                               submitQuizHandler={this.submitQuizHandler}
                               retakeHandlert={this.retakeHandlert}
                               exitHandler={this.exitHandler}
                               mode={this.state.quizData.mode}/> );
    }

    return null;

  }

  retakeHandlert(event) {
    if(event){
      event.stopPropagation();
      event.preventDefault();
    }

    this.setState({quizData: this.initializeQuiz(this.props.content)});
  }

  submitQuizHandler(event) {
    if(event){
      event.stopPropagation();
      event.preventDefault();
    }

    this.viewResult();
  }

  userSelectionHandler(questionIndex, optionIndex, value) {
    const quizData = this.state.quizData;
    quizData.questions[questionIndex].questionOptions[optionIndex].selected = value;
    this.setState({quizData});
  }

  viewResult() {
    const quizData = this.state.quizData;
    quizData.mode = 'results';

    for (let i = 0; i < quizData.questions.length; i++) {

      let isCorrect = true;
      let noOneSelected = true;
      for (let j = 0; j < quizData.questions[i].questionOptions.length; j++) {

        if (quizData.questions[i].questionOptions[j].selected) {
          noOneSelected = false;
          if (quizData.questions[i].questionOptions[j].correct) {
            quizData.questions[i].questionOptions[j].status = 'correct'
          }
          else {
            quizData.questions[i].questionOptions[j].status = 'incorrect'
            isCorrect = false;
          }
        }
        else {
          if (quizData.questions[i].questionOptions[j].correct) {
            isCorrect = false;
            quizData.questions[i].questionOptions[j].status = 'correct'
          }
        }
      }

      if (noOneSelected) {
        quizData.questions[i].status = 'warn';
        continue;
      }

      if (isCorrect) {
        quizData.questions[i].status = 'pass';
      }
      else {
        quizData.questions[i].status = 'fail';
      }
    }


    this.setState({quizData});
  }

  render() {
    let quizTitle = null;

    if (this.state.quizData.title) {
      let title = this.state.quizData.title;

      if (this.state.quizData.titleMdHtml) {
        title = this.state.quizData.titleMdHtml;
      }

      quizTitle = (
        <div style={{ borderBottom:"1px solid #40b5ff" }}>
          <MarkdownViewer
            mdHtml={title}
            viewerClass={'markdownTextViewerQuizOption'}
          />
        </div>
      );
    }

    return (
      <div style={{ padding:10, paddingBottom:25,
          border:"1px solid #40b5ff", borderRadius:5 }}>
        {quizTitle}
        {this.renderQuestionRenderer()}
      </div>
    );
  }
}

class QuestionSlideRenderer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.nextHandler = this.nextHandler.bind(this);
    this.state = {currentIndex: 0};
  }

  nextHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.currentIndex < this.props.questions.length - 1) {
      this.setState({currentIndex: this.state.currentIndex + 1});
    }
    else {
      this.setState({currentIndex: 0});
      this.props.submitQuizHandler();
    }
  }

  renderBody() {
    const body = [];
    if (this.props.mode == 'active') {
      // body.push(<SlideRendererProgressBar key={'slide_progress_bar'} current={this.state.currentIndex} total={this.props.questions.length}/>)

      body.push(<QuestionViewComponent key={this.state.currentIndex}
                                       index={this.state.currentIndex}
                                       number={this.state.currentIndex+1}
                                       total={this.props.questions.length}
                                       questionData={this.props.questions[this.state.currentIndex]}
                                       readOnly={false}
                                       userSelectionHandler={this.props.userSelectionHandler}/>);

      body.push(
        <div key={'slide_progress_bar_next'} style={{ display:'flex', justifyContent:'flex-end'}}>
          <Button style={{borderColor:'#40b5ff'}} onClick={this.nextHandler}>Next ></Button>
        </div>
      );
    }

    if (this.props.mode == 'results') {
      body.push(<QuestionSlideResults questions={this.props.questions}
                                      key={'questions_slide_results'}
                                      userSelectionHandler={this.props.userSelectionHandler}
                                      submitQuizHandler={this.props.submitQuizHandler}
                                      retakeHandlert={this.props.retakeHandlert}
                                      exitHandler={this.props.exitHandler}/>);
    }


    return body;
  }

  render() {
    return (
      <div>
        <div>
          {this.renderBody()}
        </div>
      </div>
    );
  }
}

class SlideRendererProgressBar extends React.Component {
  render() {

    const percent = this.props.current / this.props.total * 100;

    return (<div className="progress" style={{marginBottom:15}}>
      <div className="progress-bar quiz-progress-bar progress-bar-striped active" role="progressbar"
           aria-valuenow="0"
           aria-valuemin="0" aria-valuemax="100"
           style={{width: `${percent}%`, backgroundColor:'#40b5ff'}}>
      </div>
    </div>);
  }
}

class QuestionSlideResults extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.viewDetailsHandler = this.viewDetailsHandler.bind(this);
    this.state = {mode: 'short'};
  }

  renderBody() {
    const body = [];

    if (this.state.mode == 'short') {
      body.push(
        <div style={{ margin:"20px 0" }}>
          <QuestionSlideShortResults key="QuestionSlideShortResults" questions={this.props.questions}/>
        </div>
      );
      body.push(<div style={{ display:'flex', justifyContent:'center' }} key="buttons">
        <Button style={{borderColor:'#40b5ff'}} onClick={this.viewDetailsHandler}>
          View Details
        </Button>&nbsp;&nbsp;
        <Button style={{borderColor:'#f4894d'}} onClick={this.props.retakeHandlert}>
          Retake >
        </Button>
      </div>);
    }
    if (this.state.mode == 'full') {
      body.push(<QuestionContinuousRenderer key="QuestionContinuousRenderer"
                                            questions={this.props.questions}
                                            userSelectionHandler={this.props.userSelectionHandler}
                                            submitQuizHandler={this.props.submitQuizHandler}
                                            retakeHandlert={this.props.retakeHandlert}
                                            exitHandler={this.props.exitHandler}
                                            mode='results'/>);
    }

    return body;
  }

  viewDetailsHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({mode: 'full'});
  }

  render() {
    return (<div>
      {this.renderBody()}
    </div>);
  }
}

class QuestionSlideShortResults extends React.Component {
  getResults() {
    const results = {
      correct: 0,
      incorrect: 0,
      unanswered: 0,
    };

    for (let i = 0; i < this.props.questions.length; i++) {
      if (this.props.questions[i].status == 'warn') {
        results.unanswered += 1;
      }
      if (this.props.questions[i].status == 'fail') {
        results.incorrect += 1;
      }
      if (this.props.questions[i].status == 'pass') {
        results.correct += 1;
      }
    }

    return results;
  }

  render() {
    const results = this.getResults();

    return (<div className="short-result-container">
      <div className={styles.resultsSummaryContainer}>
        <div className={styles.resultsSummary}>
          <div style={{ paddingBottom:10, fontWeight:'bold', textAlign:'center', textDecoration:'underline' }}>Summary</div>
          <Table striped className="fg-black75 resultsSummaryContainer">
            <thead>
            </thead>
            <tbody>
            <tr className='success'>
              <td>Correct</td>
              <td><strong>{results.correct}</strong></td>
            </tr>
            <tr className='danger'>
              <td>Incorrect</td>
              <td><strong>{results.incorrect}</strong></td>
            </tr>
            <tr className='warning'>
              <td>Unanswered</td>
              <td><strong>{results.unanswered}</strong></td>
            </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>);
  }
}

class QuestionContinuousRenderer extends React.Component {
  renderButtons() {
    const buttons = [];
    if (this.props.mode == 'active') {
      buttons.push(<div className="text-center" key='active'><Button style={{border:'1px solid #40b5ff'}} onClick={this.props.submitQuizHandler}>
        Check Answers
      </Button>
      </div>);
    }
    if (this.props.mode == 'results') {
      buttons.push(<div className="text-center" key='results'>
        <Button style={{border:'1px solid #f4894d'}} onClick={this.props.retakeHandlert}>
          Retake >
        </Button>
      </div>);
    }

    return buttons;
  }

  renderQuestions() {
    const questionsView = [];

    for (let i = 0; i < this.props.questions.length; i++) {
      let style = {};
      if (i < this.props.questions.length-1) {
        style = {
          borderBottom: "1px dashed #bbb"
        };
      }
      questionsView.push(
        <div key={i} style={style}>
          <QuestionViewComponent
            key={i}
            index={i}
            number={i+1}
            total={this.props.questions.length}
            questionData={this.props.questions[i]}
            readOnly={this.props.mode=='results' ? true : false}
            userSelectionHandler={this.props.userSelectionHandler}
          />
        </div>
      );
    }

    return questionsView;
  }

  render() {
    return (
      <div>
        {this.renderQuestions()}
        {
          this.props.mode == 'results' ?
            <div style={{ margin:"20px 0" }}>
              <QuestionSlideShortResults questions={this.props.questions}/>
            </div> : null
        }
        <div>
          <div>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }
}


var QuestionViewComponent = React.createClass({
  createQuestionResultIndicator() {
    if (this.props.questionData.status == 'warn') {
      return <OverlayTrigger placement='bottom' overlay={<Tooltip id={"Unanswered"}><strong>Unanswered</strong></Tooltip>}>
        <SomethingWithIcon icon={Icons.questionIcon}/>
      </OverlayTrigger>;
    }
    if (this.props.questionData.status == 'fail') {
      return <OverlayTrigger placement='bottom' overlay={<Tooltip id={"Incorrect"}><strong>Incorrect Answer</strong></Tooltip>}>
        <SomethingWithIcon icon={Icons.timesIcon}/>
      </OverlayTrigger>;
    }
    if (this.props.questionData.status == 'pass') {
      return <OverlayTrigger placement='bottom' overlay={<Tooltip id={"Correct"}><strong>Correct Answer</strong></Tooltip>}>
        <SomethingWithIcon icon={Icons.checkIcon}/>
      </OverlayTrigger>;
    }
    return;
  },

  labels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

  renderOptions() {
    const optionsView = [];
    const options = this.props.questionData.questionOptions;
    for (let i = 0; i < options.length; i++) {
      optionsView.push(<QuestionOptionView key={i}
                                           index={i}
                                           isChecked={options[i].selected}
                                           label={this.labels[i]}
                                           text={options[i].text}
                                           mdHtml={options[i].mdHtml || null}
                                           status={options[i].status}
                                           readOnly={this.props.readOnly}
                                           userSelectionHandler={this.userSelectionHandler}/>);
    }

    return optionsView;
  },

  userSelectionHandler(optionIndex, value) {
    this.props.userSelectionHandler(this.props.index, optionIndex, value);
  },

  render() {
    let questionText = this.props.questionData.questionText;
    if (this.props.questionData.questionTextHtml) {
      questionText = this.props.questionData.questionTextHtml;
    }

    return (
      <div className="question-view-component">
        <div className="question-text-container">
          <div className={styles.questionTextNumber}>
            Question {this.props.number} of {this.props.total}
          </div>
          <div style={{ display:'flex', width:'100%', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <MarkdownViewer
              mdHtml={questionText}
              viewerClass={'markdownTextViewerQuizOption'}
            />
            <div>
              {this.createQuestionResultIndicator()}
            </div>
          </div>
        </div>
        <Table className="table table-striped">
          <tbody>
          {this.renderOptions()}
          </tbody>
        </Table>
      </div>
    );
  },
});


class QuestionOptionView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userSelectionHandler = this.userSelectionHandler.bind(this);
  }

  getQuestionClassName() {
    if (this.props.status == 'none') {
      return '';
    }
    if (this.props.status == 'incorrect') {
      return 'danger text-danger'
    }
    if (this.props.status == 'correct') {
      return 'success text-success'
    }

    return null;
  }

  renderCheckBox() {
    if (this.props.readOnly) {
      return null;
    }

    return (<div className="checkbox-round-button"><input type="checkbox" onChange={this.userSelectionHandler}
                                                          checked={this.props.isChecked}/>
      <label htmlFor="checkbox-round-button"></label>
    </div> );
  }

  renderStatus() {
    if (this.props.status == 'none') {
      return null;
    }
    if (this.props.status == 'incorrect') {
      return 'Incorrect'
    }
    if (this.props.status == 'correct') {
      return 'Correct'
    }

    return null;
  }

  userSelectionHandler(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.props.readOnly) {
      return null;
    }

    this.props.userSelectionHandler(this.props.index, !this.props.isChecked);
  }

  render() {
    let optionText = this.props.text;
    if (this.props.mdHtml) {
      optionText = this.props.mdHtml;
    }

    return (<tr className={`option-view ${this.getQuestionClassName()}`} onClick={this.userSelectionHandler}
                key={this.props.index}>
      <td className="col-xs-1 text-center" style={{ verticalAlign:'middle' }}>
        {this.renderCheckBox()}
      </td>
      <td className="col-xs-8 option-text">
        <MarkdownViewer
          mdHtml={optionText}
          viewerClass={'markdownTextViewerQuizOption'}
        />
      </td>
      <td className="col-xs-2" style={{ verticalAlign:'middle' }}>
        <strong>{this.renderStatus()}</strong>
      </td>
    </tr>);
  }
}


module.exports = QuizComponent;
