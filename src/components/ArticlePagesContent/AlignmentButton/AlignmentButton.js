import styles from './AlignmentButton.module.scss';

import React, {Component, PropTypes} from 'react';
import {Btn, SomethingWithIcon, Icons} from '../../index';

export default class AlignmentButton extends Component {

  static PropTypes = {
    alignVal          : PropTypes.string.isRequired,
    icon              : PropTypes.node.isRequired,
    active            : PropTypes.bool.isRequired,
    onAlignmentChange : PropTypes.func.isRequired,
  };

  onButtonClick() {
    this.props.onAlignmentChange(this.props.alignVal);
  }

  render() {

    const style = this.props.active ? 'b-btn_dark' : 'b-btn_default';
    return <Btn value={this.props.alignVal} active={this.props.active}
                className={styles.button}
                btnStyle={style}
                onClick={this.onButtonClick}>
                <SomethingWithIcon icon={this.props.icon}/>
           </Btn>;
  }
};