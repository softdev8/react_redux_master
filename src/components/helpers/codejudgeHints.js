import React, { Component, PropTypes } from 'react';
import { Btn } from '../index';
import CodeJudgeHintsEditView from './codejudgeHintsEditView';


export default class CodeJudgeHints extends Component {
  constructor(props) {
    super(props);

    this.state = {
      judgeHints: this.props.judgeHints,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      judgeHints: nextProps.judgeHints,
    });
  }

  onAddHint = () => {
    const judgeHints = this.state.judgeHints || [];
    judgeHints.push({
      markdown: '',
      html: ''
    });

    this.setState({
      judgeHints
    }, this.props.onJudgeHintsUpdate(judgeHints));
  }

  render() {
    const { onJudgeHintsUpdate, onlyCodeChanged } = this.props;
    const { judgeHints } = this.state;

    return (
      <div>
        <Btn small default link onClick={this.onAddHint} style={{ textTransform:'none' }}>
          Add Hint
        </Btn>
        <CodeJudgeHintsEditView
          judgeHints={judgeHints}
          onJudgeHintsUpdate={onJudgeHintsUpdate}
          onlyCodeChanged={onlyCodeChanged}
        />
      </div>
    );
  }
};

CodeJudgeHints.propTypes = {
  onJudgeHintsUpdate: PropTypes.func.isRequired,
  onlyCodeChanged: PropTypes.bool.isRequired,
  judgeHints: PropTypes.array,
};
