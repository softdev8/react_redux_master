import styles from './ButtonsPanel.module.scss';

import React, {Component, PropTypes} from 'react';
import {Grid} from 'react-bootstrap';

import {Btn, Icons, SomethingWithIcon} from '../../index';


// --------------------
// Buttons Panel Schema
// --------------------
/*
 * buttons = [ arrayOf.button ]
 *
 * button = {
 *  method : PropTypes.string.isRequired
 *  icon : PropTypes.node // icon name or icon object
 *  text : PropTypes.string.isRequired
 *  type : PropTypes.string.isRequired // one of 'primary', 'secondary', 'default'
 *  className : PropTypes.string
 * }
 *
 */
export default class ButtonsPanel extends Component {

  static PropTypes = {
    buttons : PropTypes.array.isRequired,
    disabled: PropTypes.bool,
  };

  render() {
    const buttons = this.props.buttons.map( (btn, i) => {

      let icon = typeof btn.icon === 'string' ? Icons[btn.icon] : btn.icon;

      return  <Btn disabled={this.props.disabled} btnStyle={btn.type} className={btn.className} onClick={btn.method} key={i}>
                { btn.icon ? <SomethingWithIcon icon={icon} text={btn.text}/> : btn.text }
              </Btn>
    });

    const baseClassName  = styles['buttons-panel'];
    const panelClassName = this.props.className ? `${baseClassName} ${this.props.className}` : baseClassName;

    return  <div className={panelClassName}>
              { buttons }
            </div>;
  }
}