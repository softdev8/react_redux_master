import styles from './EditPanels.module.scss';

import React, { Component, PropTypes } from 'react';
import { Checkbox, Tooltip, OverlayTrigger } from 'react-bootstrap';

export default class EditPanelOptions extends Component {

  static propTypes = {
    toggleState: PropTypes.shape({
      result: PropTypes.bool,
      html: PropTypes.bool,
      css: PropTypes.bool,
      js: PropTypes.bool,
    }).isRequired,
    updateToggleState: PropTypes.func.isRequired,
    playgroundTemplate: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.updateToggleState = this.updateToggleState.bind(this);
  }

  updateToggleState(type, e) {
    this.props.updateToggleState(type, !!e.target.checked);
  }

  createTooltipObject(tooltip_string) {
    return <Tooltip id={tooltip_string}>{ tooltip_string }</Tooltip>;
  }

  render() {
    const { playgroundTemplate, toggleState } = this.props;
    if (playgroundTemplate !== 'onelinePanels' &&
        playgroundTemplate !== 'resultBelow') {
      return null;
    }

    return (
      <div>
        <span style={{ marginRight:'10px' }}>Panels State: </span>
        {
          (playgroundTemplate === 'onelinePanels') &&
          <OverlayTrigger placement="top" overlay={this.createTooltipObject('Output pane will be enabled (or disabled) when RunJs is viewed')}>
            <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
              <span>Output</span>
              <Checkbox checked={toggleState.result} onChange={(e) => this.updateToggleState('result', e)} />
            </label>
          </OverlayTrigger>
        }
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('HTML pane will be enabled (or disabled) when RunJs is viewed')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>HTML</span>
            <Checkbox checked={toggleState.html} onChange={(e) => this.updateToggleState('html', e)} />
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('CSS pane will be enabled (or disabled) when RunJs is viewed')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>CSS</span>
            <Checkbox checked={toggleState.css} onChange={(e) => this.updateToggleState('css', e)} />
          </label>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={this.createTooltipObject('JS pane will be enabled (or disabled) when RunJs is viewed')}>
          <label className={`${styles.label} form-label ${styles.downloadLabel}`}>
            <span>JS</span>
            <Checkbox checked={toggleState.js} onChange={(e) => this.updateToggleState('js', e)} />
          </label>
        </OverlayTrigger>
      </div>
    );
  }
}
