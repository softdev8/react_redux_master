import React, { Component } from 'react';
import { Glyphicon, Button } from 'react-bootstrap';
import styles from './codejudgeHintsViewer.module.scss';
import MarkdownViewer from './markdownViewer';
const CaptionComponent = require('../CaptionComponent/CaptionComponent');

export default class CodeJudgeHintsViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      count: props.judgeHints ? props.judgeHints.length : 0,
    }
  }

  prevButtonClicked = () => {
    const { index } = this.state;

    if (index > 0) {
      this.setState({
        index: index - 1,
      });
    }
  }

  nextButtonClicked = () => {
    const { index, count } = this.state;

    if (index < count-1) {
      this.setState({
        index: index + 1,
      });
    }
  }

  render() {
    const { judgeHints } = this.props;
    const { index, count } = this.state;
    let hintHtml = '';

    if (judgeHints &&
        count > 0 &&
        count > index) {
      hintHtml = judgeHints[index].html;
    }
    else {
      return null;
    }

    const prevIconDisabled = (index === 0);
    const prevIconStyle = {
      fontSize: 24,
      color: prevIconDisabled ? 'lightgray' : 'inherit',
    };

    const nextIconDisabled = (index === count-1);
    const nextIconStyle = {
      fontSize: 24,
      color: nextIconDisabled ? 'lightgray' : 'inherit',
    };

    return (
      <div className={styles.hintContainer}>
        <CaptionComponent
          caption={`Hint ${index+1} of ${count}`}
          readOnly={true}
        />
        <div className={styles.hintWrapper}>
          <div className={styles.prevButtonWrapper} onClick={this.prevButtonClicked}>
            <Button bsClass={styles.prevButton} disabled={prevIconDisabled}>
              <Glyphicon style={prevIconStyle} glyph="chevron-left" />
            </Button>
          </div>

          <div className={styles.markdownViewer}>
            <MarkdownViewer mdHtml={hintHtml} />
          </div>

          <div className={styles.nextButtonWrapper} onClick={this.nextButtonClicked}>
            <Button bsClass={styles.nextButton} disabled={nextIconDisabled}>
              <Glyphicon style={nextIconStyle} glyph="chevron-right" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
};
