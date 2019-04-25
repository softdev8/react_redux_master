import React, {Component} from 'react';
import PureComponent from 'react-pure-render/component';
import ModalManager from '../common/ModalManager';
import {Modal, ModalHeader, ModalFooter, ModalBody} from '../common/Modal';
import Button from '../common/Button';

export default class svgEditModal extends Component{
  onEditDialogShow(svg_string) {
    const self = this;
    var svg_string = this.props.svg_string;
    self.dialogFrame = $('#svg-edit-window-in-dialog').get(0);
    const onloadFunc = () => {
      self.svgCanvas = new embedded_svg_edit(self.dialogFrame);
      self.svgCanvas.setSvgString(svg_string);
    };
    if (self.dialogFrame.attachEvent) {
      self.dialogFrame.attachEvent('onload', onloadFunc);
    } else {
      self.dialogFrame.onload = onloadFunc;
    }
  }

  onSaveClick(handleSvgData){
    this.svgCanvas.getSvgString()(handleSvgData);
  }

  openModal() {
    this.modalRef.open();
  }

  render() {
    return <Modal lg ref={node => this.modalRef = node} className='svg-modal' onShow={() => this.onEditDialogShow(this.props.svg_string)}>
      <ModalHeader>
        <Button bsStyle='darkgreen45' onClick={() => this.onSaveClick(this.props.handleSvgData)}>Update</Button>
        <button className='close' onClick={this.onCloseClick}>x</button>
      </ModalHeader>
      <ModalBody>
        <div className="svg-edit-dialog">
            <iframe src="/method-draw/index.html" width="100%" height="600px" id="svg-edit-window-in-dialog"/>
          </div>
      </ModalBody>
      <ModalFooter>
        <Button outlined bsStyle='danger' onClick={ModalManager.remove}
                onTouchEnd={ModalManager.remove}>Close</Button>
      </ModalFooter>
    </Modal>;
  }
}