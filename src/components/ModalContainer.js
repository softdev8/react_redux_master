import React, {Component} from 'react';
import ModalManager from './common/ModalManager';
import {Modal, ModalHeader, ModalFooter, ModalBody} from './common/Modal';
import Button from './common/Button';


export default (ChildComp, externalProps) => {
    return class ModalContainer extends Component{

        constructor(props){
            super(props);

            this.handleSave = this.handleSave.bind(this);
            this.handleUpdate = this.handleUpdate.bind(this);
        }

        handleSave(){
            const onUpdate = this.props.onUpdate || externalProps.onUpdate;
            if(onUpdate){
                onUpdate(this.buffer || props.content || external.content);
            }
            ModalManager.remove();
        }

        handleUpdate(data){
            this.buffer = data;
        }

        open() {
            this.modalRef.open();
        }

        render() {
            return <Modal lg ref={node => this.modalRef = node} className='svg-modal' fullscreen={true}>
            <ModalHeader>
                <Button bsStyle='darkgreen45' onClick={this.handleSave}>Update</Button>
                <button className='close' onClick={ModalManager.remove}>x</button>
            </ModalHeader>
            <ModalBody>
                <ChildComp onUpdate={this.handleUpdate} content={this.props.content || externalProps.content}/>
            </ModalBody>
            <ModalFooter>
                <Button outlined bsStyle='danger' onClick={ModalManager.remove}
                        onTouchEnd={ModalManager.remove}>Close</Button>
            </ModalFooter>
            </Modal>;
        }
    }

}