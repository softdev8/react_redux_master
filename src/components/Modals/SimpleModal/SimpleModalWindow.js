import styles from './SimpleModalWindow.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';

import { showModal } from '../../../actions';

import {Agreements} from '../../../constants';

@connect( state => ({}) )
export default class SimpleModal extends Component {

  static PropTypes = {
    // icon node
    closeIcon        : PropTypes.object,

    prevModalType    : PropTypes.string.isRequired,

    // tos is for Terms of Service
    tos : PropTypes.bool,

    // pp is for Privacy Policy
    pp  : PropTypes.bool,

    // ret is for Return Policy
    ret :  PropTypes.bool,
  };

  render() {

    const {tos, pp, ret, prevModalType} = this.props;

    let data = defData;

    if(tos) {
      data = tosData;
    }

    if(pp) {
      data = ppData;
    }

    if(ret) {
      data = returnData;
    }

    const html = {__html:data.text } ;

    return  <div className={styles.simple}>

              { this.props.closeIcon }

              <ModalHeader title={ data.title }/>

              <div className='b-modal__body'>
                <div className={styles.text}> <p dangerouslySetInnerHTML={html}></p></div>
              </div>

              <ModalFooter helpers={this.getFooterHelpers()}/>

            </div>;
  }

  getFooterHelpers() {
    const {prevModalType} = this.props;

    if(!prevModalType) return [];

    return [{
      method   : () => { this.props.dispatch(showModal(this.props.prevModalType)); },
      linkText : 'Go Back',
    }];
  }
}

const tosData = {
  title : 'Terms of Service',
  text  : Agreements.TERMS_OF_SERVICE,
};

const ppData = {
  title : 'Privacy Policy',
  text  : Agreements.PRIVACY_POLICY,
};

const returnData = {
  title : 'Return Policy',
  text  : Agreements.RETURN_POLICY,
};

const defData = {
  title : 'Modal Window',
  text  : 'This is an empty window',
}