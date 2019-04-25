import commonFormStyles from './Form.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {BtnWithIcon, Btn, Icons,
        AjaxLoader, Alert,
        StatusControl} from '../index';
import {ModalHeader, ModalFooter} from '../Modals';

import { parseError } from '../../utils/errorResponseUtils';
import {verify} from '../../actions';

@connect( state => ({}) )
export default class VerifyUserForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status : null,
    }
  }

  componentDidMount () {
    this.refs.statuscontrol.setwaiting();

    verify(this.props.routeParams.token)
    .then((data)=>{
      this.refs.statuscontrol.setsuccess();

      this.props.dispatch(pushState(null, '/login/verifyuser'));
    })
    .catch((err)=>{
      this.refs.statuscontrol.seterror();
    })
  }

  renderDefaultFooter() {

    return <ModalFooter helpers={this.getFooterHelpers()}/>;
  }


  render() {
    const { footer = this.renderDefaultFooter() } = this.props;

    const formBaseClass = commonFormStyles['form'];
    const formClassName = this.state.status ? `${formBaseClass} ${this.state.status}` : formBaseClass;

    return  <div className={formClassName}>

              <ModalHeader title='Verify User'/>

              <StatusControl  ref={'statuscontrol'}
                              waitingcontent={'Verifying your account'}
                              errorcontent={'Something went wrong! <strong><a href=\'/resend-verification\'>Resend Verification Link</a> or <a href=\'/signup\'> Signup</a></strong>'}
                              successcontent={'Verification is successful'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                </div>
              </div>

              { footer }

            </div>;
  }


  getFooterHelpers() {
    return [{
      text     : 'Don\'t have an account?',
      method   : () => { this.props.dispatch(pushState(null, '/signup')); },
      linkText : 'Signup',
    }, {
      text     : '',
      method   : () => { this.props.dispatch(pushState(null, '/resend-verification')); },
      linkText : 'Resend Link',
    }];
  }
}

const fields = [{
  name : 'new password',
  type : 'password',
}, {
  name : 'confirm password',
  type : 'password',
}];
