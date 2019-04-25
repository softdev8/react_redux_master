import styles from './ProgressModal.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {InlineStatusControl} from '../../index';


@connect(( {modals} ) => {
  return {modals} 
})
export default class ProgressModal extends Component {

  static PropTypes = {
    closeIcon : PropTypes.node,
  };

  componentDidUpdate(){
    if(this.props.modals.get('params').status == 'SUCCESS'){
      setTimeout(this.props.closeModal, 1000);
    }
  }

  render() {
  	let statusData = {
      status: this.props.modals.get('params').status,
      text:   this.props.modals.get('params').text,
    };

    return  <div className={styles.progress}>

              { statusData.status == 'SUCCESS' ? this.props.closeIcon : null }
              <InlineStatusControl statusData={statusData}/>

            </div>;
  }
}