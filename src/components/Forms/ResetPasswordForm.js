import commonFormStyles from './Form.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {BtnWithIcon, Btn, Icons,
        AjaxLoader, Alert,
        StatusControl,
        SimpleLabelledInput} from '../index';
import {ModalHeader, ModalFooter} from '../Modals';

import { parseError } from '../../utils/errorResponseUtils';
import { resetPassword } from '../../actions';

@connect( state => ({}) )
export default class ResetPasswordForm extends Component {

  constructor(props) {
    super(props);

    this.resetPassword = this.resetPassword.bind(this);

    this.state = {
      status : null,
    }
  }

  resetPassword(e) {
    e.preventDefault();
    e.stopPropagation();

    const password1 = this.refs.new_password.getValue().trim();
    const password2 = this.refs.confirm_password.getValue().trim();

    this.refs.statuscontrol.setwaiting();

    resetPassword({
      reset_token: this.props.routeParams.token,
      new_password: password1,
      new_password_confirm: password2,
    }).then( data => {

      this.refs.statuscontrol.setsuccess();

      this.setState({
        status : 'success',
      });

      this.props.dispatch(pushState(null, '/login/resetpassword'));
    }).catch( err => {
      const errText = parseError(err);

      if (errText != null) {
        this.refs.statuscontrol.seterrortext(errText);
      }
      else {
        this.refs.statuscontrol.seterror();
      }

      this.setState({
        status : 'error',
      });

    });
  }

  renderDefaultFooter() {

    return <ModalFooter helpers={this.getFooterHelpers()}/>;
  }


  render() {
    const { footer = this.renderDefaultFooter() } = this.props;

    const formBaseClass = commonFormStyles['form'];
    const formClassName = this.state.status ? `${formBaseClass} ${this.state.status}` : formBaseClass;

    const inputs = fields.map( (field, i) => {
      return <SimpleLabelledInput key={i} label={field.name}
                              ref={field.name.replace(' ', '_')}
                              type={field.type}/>;
    });

    return  <div className={formClassName}>

              <ModalHeader title='Reset Password'/>

              <StatusControl  ref={'statuscontrol'}
                              waitingcontent={'Updating your password'}
                              errorcontent={'Unable to reset your password. Please retry later.'}
                              successcontent={'Your password is now updated. <strong>Please proceed to <a href=\'/login\'>Login</a></strong>'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.resetPassword}>

                    { inputs }

                    <Btn secondary block large type='submit'>Reset</Btn>

                  </form>
                </div>
              </div>

              { footer }

            </div>;
  }


  getFooterHelpers() {
    return [{
      text     : '',
      method   : () => { this.props.dispatch(pushState(null, '/login')); },
      linkText : 'Login',
    }, {
      text     : '',
      method   : () => { this.props.dispatch(pushState(null, '/forgot-password')); },
      linkText : 'Resend Password Recovery Link',
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
