import commonFormStyles from './Form.module.scss';
import styles from './SignupForm.module.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Link } from 'react-router';

import { BtnWithIcon, Btn, Icons,
        AjaxLoader, Alert,
        StatusControl,
        SimpleLabelledInput, ModalWindow } from '../index';

import { ModalHeader, ModalFooter } from '../Modals';

import { ModalTypes } from '../../constants';

import { parseError } from '../../utils/errorResponseUtils';
import { signup, showModal } from '../../actions';
import { eventCategory, eventAction, sendEvent } from '../../utils/edGA';

const successfulSignup  = 'Activation link has been sent to your email address. Please click the link and then proceed to login.';
const headerText        = 'Learning by doing is the best way to learn';
const headerTitle       = 'Sign up';


@connect(({ router, modals }) => {
  return { router, modals };
})
export default class SignupForm extends Component {

  static PropTypes = {
    // actionOnSignup : PropTypes.func,
    isModal : PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.signup = this.signup.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
 // this.handleWarningClick = this.handleWarningClick.bind(this);

    this.state = {
      isValids : [-1, -1, -1, -1],
      warning : '',
      status : null,
    };
  }

  getFormAgreementText() {
    return (<span>
      By signing up you indicate that you have read and agree to the <a onClick={() => this.props.dispatch(showModal(ModalTypes.TOS))} style={{cursor:"hand", cursor:"pointer"}}>Terms of Service</a> and <a onClick={() => this.props.dispatch(showModal(ModalTypes.PP))} style={{cursor:"hand", cursor:"pointer"}}>Privacy policy</a>
     </span>);
  }

  signup(e) {
    e.preventDefault();
    e.stopPropagation();
    const isValids = this.state.isValids;
    for (let i = 0; i < isValids.length; i++) {
      if (isValids[i] !== 1) {
        const err_input = document.querySelector(`[name=${fields[i].name}]`);

        err_input.focus();
        return;
      }
    }

    /*  const user_name = this.refs.username.getValue().trim(),
              full_name = this.refs.full_name.getValue().trim(),
              email     = this.refs.email.getValue().trim(),
              password  = this.refs.password.getValue().trim();
    */

    const user_name = document.querySelector('[name=username]').value;
    const email     = document.querySelector('[name=email]').value;
    const password  = document.querySelector('[name=password]').value;
    const full_name = document.querySelector('[name=fullname]').value;

    signup({user_name, full_name, email, password}).then( data => {

      sendEvent(eventCategory.SIGNUP, eventAction.SIGNUP_SUCCEEDED);

      if (this.props.isModal) {
        let modalObj = this.props.modals.toJS();
        this.props.dispatch(showModal(ModalTypes.LOGIN, { successText : successfulSignup, ru: modalObj.params.ru }));
      } else {
        this.refs.statuscontrol.setsuccess();

        this.setState({
          status : 'success',
        });

        this.props.dispatch(pushState(null, '/login/signup'));
      }
    }).catch( err => {
      const errText = parseError(err);

      sendEvent(eventCategory.SIGNUP, eventAction.SIGNUP_FAILED, errText || '');

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

  handleFocus(e) {

    const name = e.target.name;
    for(let i = 0; i < fields.length; i++) {
      if (name == fields[i].name) {
        const isValids = this.state.isValids;
        isValids[i] = -1;
        this.setState({ isValids });
        break;
      }
    }
  }

  validateForm(name, value) {

    if (name == 'username') {
      if(!value) return false;
      if((value.length < 6) || value.length > 20) return false;

      return true;
    }
    else if (name == 'password') {
      if(!value) return false;
      if((value.length < 6) || value.length > 50) return false;

      return true;
    }
    else if (name == 'email') {
      if(!value) return false;
      const email_validate = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,9})$/;
      if (email_validate.test(value) == false) return false;

      return true;
    }
    else if (name == 'fullname') {
      if(!value) return false;
      if((value.length < 2) || value.length > 50) return false;

      return true;
    }
    return true;
  }

  handleBlur(e) {
    const name = e.target.name;
    const value = e.target.value;

    const isValid = this.validateForm(name, value)? 1 : 0;

    for(let i = 0; i < fields.length; i++) {
      if (name == fields[i].name) {
        const isValids = this.state.isValids;
        isValids[i] = isValid;
        this.setState({ isValids });
        break;
      }
    }
  }

  handleWarningClick(i, e) {

    const isValids = this.state.isValids;

    if (isValids[i] == 0) {

      this.setState({
        warning : fields[i].warning,
      });
    }
  }

  renderDefaultFooter() {
    return <ModalFooter helpers={this.getFooterHelpers()}/>;
  }

  render() {
    const { footer = this.renderDefaultFooter() } = this.props;

    const formBaseClass = commonFormStyles.form;
    const formClassName = this.state.status ? `${formBaseClass} ${this.state.status}` : formBaseClass;

    const inputs = fields.map( (field, i) => {

      const checked_icon = (
        <i className={`b-some-with-icon-icon ${styles['signup-checked-icon']}`}>{Icons.greenTick}</i>
      );

      const tooltip = <Tooltip id={this.state.warning} className={styles['warning-tooltip']}>{this.state.warning}</Tooltip>;
      const warning_icon = (
        <OverlayTrigger trigger='click' placement='bottom' overlay={tooltip} rootClose>
          <i className={`b-some-with-icon-icon ${styles['signup-warning-icon']}`} onClick={this.handleWarningClick.bind(this, i)}>{Icons.redWarning}</i>
        </OverlayTrigger>
      );

      let signup_icon;
      if (this.state.isValids[i] == 0)
        signup_icon = warning_icon;
      else if (this.state.isValids[i] == 1)
        signup_icon = checked_icon;
      else
        signup_icon = null;

      return  <div key={i} className={styles['anchor-for-signup-icon']}>
                <SimpleLabelledInput key={i}
                                label={field.name}
                                type={field.type}
                                validate
                                name={field.name}
                                styleValidate={{border: (this.state.isValids[i]) ? '': '1px solid #FFE1E1'}}
                                handleBlur={this.handleBlur}
                                handleFocus={this.handleFocus}/>
                { signup_icon }
              </div>;
    });

    const logo = '/landing/imgs/header-bg4.jpg';

    /*    <Btn primary onClick={this.openModalWindow.bind(this, ModalTypes.TOS)}>Terms of service</Btn>
                    <Btn primary onClick={this.openModalWindow.bind(this, ModalTypes.PP)}>Privacy policy</Btn>*/

    return  <div className={`${formClassName} ${styles.register}`}>

              <ModalHeader>
                <div className={styles['header-image']} />
                <h3 className='b-modal-header__title'>{ headerTitle }</h3>
                <p className={styles['header-text']}>{ headerText }</p>
              </ModalHeader>

              <StatusControl  ref={'statuscontrol'}
                              waitingcontent={'Creating a new account'}
                              errorcontent={'Unable to create a new account. Please retry later.'}
                              successcontent={'Activation Link has been sent to your email address. Please click the link to activate your account and the login here'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.signup}>

                    { inputs }

                    <Btn secondary large type='submit'>Register</Btn>

                    <p className={commonFormStyles['form-hint']}>{this.getFormAgreementText()}</p>

                  </form>
                </div>
              </div>

              { footer }

            </div>;
  }

  getFooterHelpers() {
    return [{
      text     : 'Have an account?',
      method   : () => { this.props.dispatch(pushState(null, '/login')); },
      linkText : 'Login',
    }, {
      text     : '',
      method   : () => { this.props.dispatch(pushState(null, '/forgot-password')); },
      linkText : 'Forgot Password',
    }];
  }
}

const fields = [{
  name : 'username',
  type : 'text',
  warning : 'User_name: field must be between 6 and 20 characters long.',
}, {
  name : 'password',
  type : 'password',
  warning : 'Password: field must be between 6 and 50 characters long.',
}, {
  name : 'email',
  type : 'email',
  warning : 'Email: invalid email address.',
}, {
  name : 'fullname',
  type : 'text',
  warning : 'Full_name: field must be between 2 and 50 characters long.',
}];
