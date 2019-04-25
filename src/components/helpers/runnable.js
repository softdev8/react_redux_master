import styles from './runnable.module.scss';
import Lightbox from 'react-image-lightbox';
require('../widgets/widgets.scss');

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';

import { Btn, SomethingWithIcon, Icons, InlineStatusControl } from '../index';
import { codeExecute } from '../../actions';
import AnimationViewer from './animationViewer';
import RunCodeButton from './runCodeButton';
import RunnableCarousel from '../../helpers/RunnableCarousel';
import ExecResultDiv from '../../helpers/ExecResultDiv';
import CommonUtility from '../../helpers/CommonUtility';
const HiddenCodeEditor = require('./hiddenCode');

@connect(({ ajaxMode:{ enabled }, router:{ params : { user_id, collection_id, page_id } } }) => ({
  isDemo: !enabled,
  author_id: user_id || null,
  collection_id: collection_id || null,
  page_id: page_id || null
}))
export default class Runnable extends Component {
  constructor(props) {
    super(props);

    this.handleExpandCollapse = this.handleExpandCollapse.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleStdinChange = this.handleStdinChange.bind(this);
    this.handleStdinEnable = this.handleStdinEnable.bind(this);
    this.getAdditionalContent = this.getAdditionalContent.bind(this);
    this.handleImageExpand = this.handleImageExpand.bind(this);
    this.closeImage = this.closeImage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      executionInProgress: false,
      stdin: '',
      enableStdin: false,
      executionComplete: false,
      executionResult: null,
      outputExpanded: false,
      isOpen: false,
      fullImage: null,
      index: 0,
      direction: null
    };
  }

  static PropTypes = {
    content           : PropTypes.string.isRequired,
    language          : PropTypes.string.isRequired,
    author_id         : PropTypes.number.isRequired,
    collection_id     : PropTypes.number.isRequired,
    page_id           : PropTypes.number.isRequired,
    isDraft           : PropTypes.bool.isRequired,
    enableStdin       : PropTypes.bool.isRequired,
    comp_id           : PropTypes.string,
    additionalContent : PropTypes.array,
  };

  handleExpandCollapse() {
    this.setState({
      outputExpanded: !this.state.outputExpanded
    });
  }

  handleImageExpand(e, img){
    this.setState({
      fullImage: img,
      isOpen: true
    });
  }

  closeImage() {
    this.setState({ isOpen: false });
  }

  getAdditionalContent() {
    const files = {};

    if (this.props.additionalContent) {
      const additionalContent = this.props.additionalContent;

      additionalContent.forEach((file) => {
        files[file.fileName] = file.content;
      });
    }

    return JSON.stringify(files);
  }

  handleRun() {
    this.setState({
      executionInProgress: !this.state.executionInProgress,
      executionComplete: false,
      outputExpanded: true,
      index: 0
    });

    let source_code = this.props.content;
    if (this.props.enableHiddenCode) {
      let { prependCode, appendCode } = this.props.hiddenCodeContent;
      source_code =  `${prependCode}\n${source_code}\n${appendCode}\n`;
    }

    const { author_id, collection_id, page_id, isDraft } = this.props;

    codeExecute({
      language: this.props.language,
      source_code: source_code,
      additional_files: this.getAdditionalContent(),
      stdin: this.state.stdin,
      author_id,
      collection_id,
      page_id,
      is_draft_page: isDraft,
      comp_id: this.props.comp_id || null
    }).then((res) => {
        const result = JSON.parse(res);
        this.setState({
          executionInProgress: false,
          executionComplete: true,
          executionResult: result,
        });
      }).catch((error) => {
        console.log(error);
        this.setState({
          executionInProgress: false,
          executionComplete: true,

          executionResult: {
            reason : error.status !== 401 ? error.responseText : 'Please login to use code execution.',
          },
        });
      });
  }

  handleStdinEnable() {
    this.setState({
      enableStdin: !this.state.enableStdin,
      stdin: '',
      outputExpanded: true
    });
  }

  handleStdinChange(e) {
    this.setState({
      stdin: e.target.value,
    });
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {
    const { executionComplete, executionResult } = this.state;

    if (this.props.isDemo) {
      return (<div style={{ textAlign:'center' }}>Code Execution not available in demo mode</div>);
    }

    let executionResultDiv = null;
    let execResultDiv = null;
    let animationIncluded = false;
    let itemLength = null;

    let icon_change = <Btn small default link onClick={this.handleExpandCollapse} style={{ float:'right' }}><SomethingWithIcon icon={Icons.closeIcon}/></Btn>

    if (executionComplete && executionResult) {
      let rendered_output = null;
      if (executionResult.rendered_output && executionResult.rendered_output.type === 'ed_canvas_draw') {
        let animation = JSON.parse(executionResult.rendered_output.data);
        animationIncluded = true;
        rendered_output = <AnimationViewer animation={animation} />;
      }

      if (this.props.treatOutputAsHTML) {
        const reasonClass = executionResult.status === 0 ? styles.reason_success : styles.reason_error;
        if(executionResult.output_files){
          itemLength = executionResult.output_files.files.length;
          {executionResult.output_files.files.map((file, index) => {
            const ext = file.substr(file.indexOf('.')+1);
            let imgSrc = executionResult.output_files.rootPath + "/"+file;
            if(CommonUtility.checkImageExt(ext)){
              if(this.state.index != itemLength){
                if(this.state.index == index){
                  icon_change = <Btn id = {imgSrc} small default link onClick={(e) => this.handleImageExpand(e, imgSrc)} style={{ float:'right', color:'grey' }}><i className="fa fa-expand" aria-hidden="true"></i></Btn>
                }
              }
              else{
                if(index == 0){
                  icon_change = <Btn small default link key={index} onClick={this.handleExpandCollapse} style={{ float:'right' }}><SomethingWithIcon icon={Icons.closeIcon}/></Btn>
                }
              }
            }
          })}
          execResultDiv = <ExecResultDiv styles={styles}
                            rendered_output={rendered_output}
                            reasonClass={reasonClass}
                            className={styles.margn}
                            executionResult={executionResult}
                            treatOutputAsHTML={this.props.treatOutputAsHTML}/>

          executionResultDiv =  <RunnableCarousel activeIndex={this.state.index}
                                direction={this.state.direction} handleSelect={this.handleSelect}
                                executionResult={executionResult} execResultDiv={execResultDiv}>
                              </RunnableCarousel>
        }
        else{
          executionResultDiv = <ExecResultDiv styles={styles}
                                rendered_output={rendered_output}
                                reasonClass={reasonClass}
                                className={styles.executon_result}
                                executionResult={executionResult}
                                treatOutputAsHTML={this.props.treatOutputAsHTML}/>
        }

      } else {
        const reasonClass = executionResult.status === 0 ? styles.reason_success : styles.reason_error;
        if(executionResult.output_files){
          itemLength = executionResult.output_files.files.length;
          {executionResult.output_files.files.map((file, index) => {
            const ext = file.substr(file.indexOf('.')+1);
            let imgSrc = executionResult.output_files.rootPath + "/"+file;
            if(CommonUtility.checkImageExt(ext)){
              if(this.state.index != itemLength){
                if(this.state.index == index){
                  icon_change = <Btn id = {imgSrc} small default link onClick={(e) => this.handleImageExpand(e, imgSrc)} style={{ float:'right', color:'grey' }}><i className="fa fa-expand" aria-hidden="true"></i></Btn>
                }
              }
              else{
                if(index == 0){
                  icon_change = <Btn small default link key={index} onClick={this.handleExpandCollapse} style={{ float:'right' }}><SomethingWithIcon icon={Icons.closeIcon}/></Btn>
                }
              }
            }
          })}

          execResultDiv = <ExecResultDiv styles={styles}
                            rendered_output={rendered_output}
                            reasonClass={reasonClass}
                            className={styles.margn}
                            executionResult={executionResult}
                            treatOutputAsHTML={this.props.treatOutputAsHTML}/>

          executionResultDiv =  <RunnableCarousel activeIndex={this.state.index}
                                  direction={this.state.direction} handleSelect={this.handleSelect}
                                  executionResult={executionResult} execResultDiv={execResultDiv}>
                                </RunnableCarousel>
        }
        else{
          executionResultDiv = <ExecResultDiv styles={styles}
                                rendered_output={rendered_output}
                                reasonClass={reasonClass}
                                className={styles.executon_result}
                                executionResult={executionResult}
                                treatOutputAsHTML={this.props.treatOutputAsHTML}/>
        }
      }
    }

    let inputOutputClassName = styles.input_output;
    if (!animationIncluded && !this.props.treatOutputAsHTML) {
      inputOutputClassName = inputOutputClassName + ' ' + (this.state.executionInProgress ? styles.initial_height : styles.limit_height);
    }

    let hiddenCodeEditor = null;
    if (this.props.mode === 'edit' && this.props.enableHiddenCode) {
      hiddenCodeEditor = <HiddenCodeEditor
                            hiddenCodeContent={this.props.hiddenCodeContent}
                            onHiddenCodeContentChange={this.props.onHiddenCodeContentChange}
                            language={this.props.language}
                            theme={this.props.theme} />
    }

    var lightbox = '';
      if (this.state.isOpen) {
        lightbox = (
          <Lightbox
            imagePadding={0}
            mainSrc={this.state.fullImage}
            onCloseRequest={this.closeImage}/>
        );
      }

    return (
      <div>
        {hiddenCodeEditor}
        <div className={styles.run}>
          <RunCodeButton onClick={this.handleRun} executionInProgress={false} />
          {
            this.props.enableStdin &&
            <Btn action_secondary className={styles.stdin_button}  onClick={this.handleStdinEnable}>
              {this.state.enableStdin ? 'stdin' : 'stdin'}
            </Btn>
          }
          <ReactCSSTransitionGroup
            transitionName="runnable"
            transitionEnter={true}
            transitionEnterTimeout={500}
            transitionLeave={true}
            transitionLeaveTimeout={500}>
            {lightbox}
            {this.state.outputExpanded ?
              <div className={inputOutputClassName}>
                {icon_change}
                {this.props.enableStdin && this.state.enableStdin ? <FormControl type="textarea" value={this.state.stdin} placeholder="stdin" groupClassName={styles.stdin} onChange={this.handleStdinChange} /> : null}
                {this.state.executionInProgress ? <InlineStatusControl statusData={{ status: 'WAIT', text:'Code Execution in progress' }}/> : null}
                {executionResultDiv ? executionResultDiv : !this.state.executionInProgress && 'Press Run to execute'}
                </div> : null }
          </ReactCSSTransitionGroup>
        </div>
      </div>);
  }
}
