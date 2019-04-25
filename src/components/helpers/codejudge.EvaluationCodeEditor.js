import styles from './codejudge.module.scss';
import React, { Component, PropTypes } from 'react';
import { FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Btn } from '../index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CodeJudgeHints from './codejudgeHints';
const CodeMirrorEditor = require('./codeeditor');
require('../common/ed_util');

export default class CodeJudgeEvaluationCodeEditor extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.currIndex = 0;
  }

  createTooltipObject(tooltip_string) {
    return (
      <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>
    );
  }

  handleSelect(index) {
    this.currIndex = index;
  }

  render() {
    return (
      <div>
        <Tabs
          selectedIndex={this.currIndex}
          onSelect={this.handleSelect}
        >
          <TabList>
            <Tab>Evaluation</Tab>
            <Tab>Prepend</Tab>
            <Tab>Hints</Tab>
            <Tab>Solution</Tab>
          </TabList>
          <TabPanel>
            <div>
              <span>
                <i>Author evaluation code goes here. Judge is based on
                  <OverlayTrigger placement="top"
                    overlay={this.createTooltipObject('Available Judge Types. Console judge is used to judge methods that don\'t return results and instead output on console.')}
                  >
                    <FormControl componentClass="select"
                      value={this.props.test_output_on_console ? 'console' : 'testresults'} onChange={(e) => {
                        this.props.changeJudgeType(e.target.value);
                      }}
                    >
                        <option value="testresults">Test Results</option>
                        <option value="console">Console</option>
                    </FormControl>
                  </OverlayTrigger>
                  <Btn small default link onClick={this.props.generateStubEvaluationCode} style={{ textTransform:'none' }}>
                    Generate appropriate Stub for {this.props.language}
                  </Btn>
                </i>
              </span>
              <div className="cmcomp-single-editor-container">
                <CodeMirrorEditor
                  codeContent={this.props.codeContent}
                  readOnly={false}
                  onlyCodeChanged={this.props.onlyCodeChanged}
                  onEditorChange={this.props.onEditorChange}
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <i>This code will be prepended before learner code. Use it for declarations.</i>
            <div className="cmcomp-single-editor-container">
              <CodeMirrorEditor
                codeContent={this.props.judgeContentPrepend}
                readOnly={false}
                onlyCodeChanged={this.props.onlyCodeChanged}
                onEditorChange={this.props.onJudgeContentPrependChange}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <CodeJudgeHints
              judgeHints={this.props.judgeHints}
              onJudgeHintsUpdate={this.props.onJudgeHintsUpdate}
              onlyCodeChanged={this.props.onlyCodeChanged}
            />
          </TabPanel>
          <TabPanel>
            <i>Write solution for the exercise here. It will be shown to learners if 'Solution' box above is selected.</i>
            <div className="cmcomp-single-editor-container">
              <CodeMirrorEditor
                codeContent={this.props.solutionContent}
                readOnly={false}
                onlyCodeChanged={this.props.onlyCodeChanged}
                onEditorChange={this.props.onSolutionContentChange}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

CodeJudgeEvaluationCodeEditor.propTypes = {
  test_output_on_console     : PropTypes.bool.isRequired,
  onlyCodeChanged            : PropTypes.bool.isRequired,
  language                   : PropTypes.string.isRequired,
  codeContent                : PropTypes.object.isRequired,
  changeJudgeType            : PropTypes.func.isRequired,
  generateStubEvaluationCode : PropTypes.func.isRequired,
  onEditorChange             : PropTypes.func.isRequired,
  solutionContent            : PropTypes.object.isRequired,
  onSolutionContentChange    : PropTypes.func.isRequired,
  judgeContentPrepend        : PropTypes.object.isRequired,
  onJudgeContentPrependChange: PropTypes.func.isRequired,
  judgeHints                 : PropTypes.array,
  onJudgeHintsUpdate         : PropTypes.func.isRequired,
};
