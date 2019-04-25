import React, {Component} from 'react'
import PureComponent from 'react-pure-render/component';
import ModalManager from '../common/ModalManager';
import {Modal, ModalHeader, ModalFooter, ModalBody} from '../common/Modal';
import Button from '../common/Button';

export default class dumbModal extends Component{
  constructor(props,context){
    super(props, context);

    this.onShown = this.onShown.bind(this);

    this.state = {
      showChildren : false,
    }
  }

  onShown(e){
    this.setState({
      showChildren: true,
    });
  }

  render() {
    return <Modal lg ref="modal" className='dumb-modal' onShown={this.onShown}>
      <ModalBody>
        {this.state.showChildren ? this.props.children : null}
      </ModalBody>
    </Modal>;
  }
}