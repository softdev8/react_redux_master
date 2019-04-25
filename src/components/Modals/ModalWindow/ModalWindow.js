require('./ModalWindow.scss');

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import ArticleSettingsModal from '../ArticleSettingsModal/ArticleSettingsModal';
import CheckoutModal from '../CheckoutModal/CheckoutModal';
import LoginModal from '../LoginModal/LoginModal';
import MarkdownPasteModal from '../MarkdownPasteModal/MarkdownPasteModal';
import ProgressModal from '../ProgressModal/ProgressModal';
import RecoverPasswordModal from '../RecoverModal/RecoverPasswordModal';
import SignupModal from '../SignupModal/SignupModal';
import ResetPasswordModal from '../ResetPasswordModal/ResetPasswordModal';
import SimpleModalWindow from '../SimpleModal/SimpleModalWindow';
import SubscribeModal from '../SubscribeModal/SubscribeModal';

import {Icons} from '../../index';

import { ModalTypes } from '../../../constants';
import { showModal, closeModal } from '../../../actions';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@connect( ({modals}) => {return {modals};} )
export default class ModalWindow extends Component {

	PropTypes : {
		showModal  : PropTypes.bool.isRequired,
		modalType  : PropTypes.string.isRequired
	}

	constructor(props) {
		super(props);

		this.closeModal       = this.closeModal.bind(this);
		this.forceCloseModal  = this.forceCloseModal.bind(this);
		this.openAnotherModal = this.openAnotherModal.bind(this);

		this.state = {
            currentModal  : null,

            // paramsToAnotherModal : null
            prevModalType : null,
        }
	}

	// this helps change modal window without background animation
	componentWillReceiveProps(nextProps, nextState) {
		if( nextProps.modalType !== this.state.currentModal ) {
			this.setState({
                prevModalType : this.state.currentModal,
                currentModal  : nextProps.modalType,
            });
		}
	}

	render() {
		if(this.props.showModal) {
			let modalClassName = 'b-modal-window';
			if(this.state.currentModal == ModalTypes.SUBSCRIBE){
				modalClassName = 'b-modal-window-small';
			}
			return 	<ReactCSSTransitionGroup transitionLeaveTimeout={300} transitionEnterTimeout={500} transitionName='dialog-anim'>
						<div key='modal' className='b-modal-overlay' onClick={this.closeModal}>
							<div className={modalClassName}>
								{ this.chooseModalContent() }
							</div>
						</div>
					</ReactCSSTransitionGroup>;
		} else {
			return <ReactCSSTransitionGroup transitionLeaveTimeout={300} transitionEnterTimeout={500} transitionName='dialog-anim'/>;
		}

	}

	chooseModalContent() {

		const closeIcon = <i className='b-modal-window__close' onClick={this.forceCloseModal}>{Icons.closeIcon}</i>;

		// const {paramsToAnotherModal} = this.state;

		const defProps = {
            closeIcon,

            // openAnotherModal : this.openAnotherModal
            closeModal : this.closeModal,
        }

		if( this.props.modals ){
			defProps.params = this.props.modals.get("params");
		}

		switch(this.state.currentModal) {

			case ModalTypes.LOGIN   : return <LoginModal {...defProps}/>; break;
			case ModalTypes.SIGNUP  : return <SignupModal {...defProps}/>; break;
			case ModalTypes.RECOVER : return <RecoverPasswordModal {...defProps}/>; break;
			case ModalTypes.TOS : return <SimpleModalWindow 	{...defProps} tos prevModalType={this.state.prevModalType}/>; break;
			case ModalTypes.PP  : return <SimpleModalWindow 	{...defProps} pp prevModalType={this.state.prevModalType}/>; break;
			case ModalTypes.RETURN  : return <SimpleModalWindow 	{...defProps} ret prevModalType={this.state.prevModalType}/>; break;
			case ModalTypes.RESETPASSWORD   : return <ResetPasswordModal {...defProps}/>; break;
			case ModalTypes.ARTICLESETTINGS : return <ArticleSettingsModal {...defProps}/>; break;
			case ModalTypes.CHECKOUT : return <CheckoutModal {...defProps}/>; break;
			case ModalTypes.PROGRESS : return <ProgressModal {...defProps}/>; break;
			case ModalTypes.SUBSCRIBE : return <SubscribeModal {...defProps}/>; break;
			case ModalTypes.MARKDOWNPASTE : return <MarkdownPasteModal {...defProps}/>; break;

			default: break;
		}
	}

	closeModal(e) {

		// don't close window if click inside it or not on the 'done' button with 'data-close-modal' attribute
		if(e && e.target.className != 'b-modal-overlay' && !e.target.dataset.closeModal) return;

		this.setState({
            prevModalType : null,
            currentModal  : null,
        }, () => {
			this.props.dispatch(closeModal());
		});
	}

	forceCloseModal(e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({
            prevModalType : null,
            currentModal  : null,
        }, () => {
			this.props.dispatch(closeModal());
		});

	}

	openAnotherModal(type, params) {
		this.setState({
            prevModalType : this.state.currentModal,

            // paramsToAnotherModal : params || null
            currentModal  : type,
        });

		this.props.dispatch(showModal(type, params));
	}

};