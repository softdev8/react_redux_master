import styles from './AddWidgetButton.module.scss';

import React, { Component, PropTypes } from 'react';

import { Btn, SomethingWithIcon, Icons } from '../../index';
import WidgetsPanel from '../WidgetsPanel/WidgetsPanel';

export default class AddWidgetButton extends Component {
  constructor(props) {
    super(props);

    this.togglePanel = this.togglePanel.bind(this);
    this.showHidePanelButtonClicked = this.showHidePanelButtonClicked.bind(this);

    this.state = {
      showPanel : false,
    };
  }

  static PropTypes = {
    showButton    : PropTypes.bool.isRequired,
    addComponent  : PropTypes.func.isRequired,
    index         : PropTypes.number.isRequired,
    text          : PropTypes.string,
    // position of panel regarding to + button
    panelPosition : PropTypes.string,
  };

  showHidePanelButtonClicked(e) {
    e.stopPropagation();

    this.setState({
      showPanel: !this.state.showPanel
    });
  }

  togglePanel() {
    this.setState({
      showPanel : !this.state.showPanel,
    });
  }

  render() {
    const style = {
      display : this.props.showButton ? 'block' : 'none',
    };

    const { text = '', index, addComponent, panelPosition } = this.props;
    const { showPanel } = this.state;

    let buttonIcon = Icons.thinPlus1;
    if (showPanel) {
      buttonIcon = Icons.closeIcon1;
    }

    return (<div className={styles['add-widget']} style={style}>
            <Btn primary onClick={this.showHidePanelButtonClicked}
                 className='btn-add' id={`add-widget-button-${index}`}>
              <SomethingWithIcon icon={buttonIcon} text={text}/>
            </Btn>
            <WidgetsPanel showPanel={showPanel} index={index} position={panelPosition}
                          addComponent={addComponent} togglePanel={this.togglePanel} />
           </div>);
  }
}