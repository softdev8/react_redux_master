'use strict';

import React, {Component, PropTypes} from 'react'
import '../../../css/web/css/font-awesome.css'
import '../../../css/web/css/style.css'
import {radPure} from '../router/utils'
import {annotationPathsMap} from '../../constants/annotation-options';

const ModeToggleItem = radPure(({handleClick, mode, name, title, iconClass})=> {
  return <div onClick={handleClick(name)} title={title}>
    <button className={mode === name ? 'selected' : ''}>
      <i className={iconClass}></i>
    </button>
    <span>{annotationPathsMap[name]}</span>
  </div>
});

export default class ModeToggle extends Component {
  constructor() {
    super();
    this.blockEvent = this.blockEvent.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  static propTypes = {
    mode: PropTypes.string.isRequired,
    switchMode: PropTypes.func.isRequired,
  };

  handleClick(mode) {
    return (e) => {
      e.stopPropagation();
      this.props.switchMode(mode);
    };
  }

  // This is neccessary to prevent mouseup/down from triggering actions on parents
  blockEvent(e) {
    e.stopPropagation();
  }

  render() {
    return <div className='cd-mode-toggle' onMouseUp={this.blockEvent} onMouseDown={this.blockEvent}
                onClick={this.blockEvent}>

      <ModeToggleItem
        handleClick={this.handleClick.bind(this)}
        name='MARKER'
        title='Switch to marker'
        iconClass='fa fa-map-marker'
        mode={this.props.mode}
        />
      <ModeToggleItem
        handleClick={this.handleClick.bind(this)}
        name='SQUARE'
        title='Switch to square'
        iconClass='fa fa-square-o'
        mode={this.props.mode}
        />
      <ModeToggleItem
        handleClick={this.handleClick.bind(this)}
        name='HIGHLIGHT'
        title='Switch to highlight'
        iconClass='fa fa-font'
        mode={this.props.mode}
        />

      <ModeToggleItem
        handleClick={this.handleClick.bind(this)}
        name='DEEPER_IMAGE'
        title='Switch to deeper image'
        iconClass='fa fa-picture-o'
        mode={this.props.mode}
        />
    </div>
  }
}

//<ModeToggleItem
//  handleClick={this.handleClick.bind(this)}
//  name='HOTSPOT'
//  title='Switch to hotspot'
//  iconClass='fa fa-external-link'
//  mode={this.props.mode}
//  />
// TODO circle is bad for scale need ellipse
//<div>
//  <button className={this.props.mode === CIRCLE ? 'selected' : ''} onClick={this.handleClick(CIRCLE)}
//          title='Switch to circle'>
//    <i className='fa fa-circle-o'></i>
//    <span>circle</span>
//  </button>
//</div>
