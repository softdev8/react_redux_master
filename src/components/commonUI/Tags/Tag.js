import styles from './Tag.module.scss';

import React, {Component, PropTypes} from 'react';
import {SomethingWithIcon, Icons} from '../../index';

export default class Tag extends Component {

  static PropTypes = {
    data      : PropTypes.string.isRequired,
    removeTag : PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  render() {

    return  <span className={styles.tag}>
              {this.props.data}
              <SomethingWithIcon icon={Icons.timesIcon} onClick={this.handleRemove}/>
            </span>
  }

  handleRemove(e) {
    console.log('handleRemove', e);
    this.props.removeTag(this.props.data);
  }
}
