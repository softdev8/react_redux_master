import commonFormStyles from './Form.module.scss';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { Link } from 'react-router';

import {BtnWithIcon,
        Btn, Icons,
        StatusControl,
        SimpleLabelledInput} from '../index';
import {ModalHeader, ModalFooter} from '../Modals';

import { parseError } from '../../utils/errorResponseUtils';
import { login, closeModal } from '../../actions';
import { eventCategory, eventAction, sendEvent } from '../../utils/edGA';

const successfulSignup  = 'Activation Link has been sent to your email address. Please click the link and then proceed to login.';
const successfulForgotPassword  = 'Recovery Link has been sent to your email address. Please click the link and then proceed to login.';
const successfulResetPassword  = 'Your password has been reset. Please login.';
const successfulVerification  = 'Your account is now verified. Please login.';
const successfulVerificationResend  = 'Verification Link has been sent to your email address. Please click the link and then proceed to login.';

@connect(( {router, modals} ) => {
  return {router, modals}
})
export default class LoginForm extends Component {

  static PropTypes = {
    params : PropTypes.object,
    footer : PropTypes.node,
    isModal : PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    this.state = {
      status : null,
    };
  }

  login(e) {
    e.preventDefault();
    e.stopPropagation();

    const email = this.emailRef.getValue().trim();
    const password = this.passwordRef.getValue().trim();

    login({email, password}).then( () => {

      this.statusControlRef.setsuccess();
      sendEvent(eventCategory.LOGIN, eventAction.LOGIN_SUCCEEDED);

      this.setState({
        status : 'success',
      });

      let redirectLocation = '/learn';

      if(this.props.isModal){
        let modalObj = this.props.modals.toJS();

        this.props.dispatch(closeModal());

        if(modalObj.params && modalObj.params.ru) {
          window.location = modalObj.params.ru;
          return;
        }
      } else {
        if(this.props.router.location.query && this.props.router.location.query.ru){
          redirectLocation = this.props.router.location.query.ru;
        }
      }

      this.props.dispatch(replaceState(null, redirectLocation));

    }).catch( err => {
      const errText = parseError(err);

      sendEvent(eventCategory.LOGIN, eventAction.LOGIN_FAILED, errText || '');

      if (errText != null) {
        this.statusControlRef.seterrortext(errText);
        console.log(errText);
      }
      else {
        this.statusControlRef.seterror();
      }

      this.setState({
        status : 'error',
      });
    });
  }

  componentDidMount() {
    if(this.props.isModal){
      if(this.props.modals.get('params')) {
        let modalObj = this.props.modals.toJS();
        const successText = modalObj.params.successText;

        if(successText){
        this.statusControlRef.setsuccess(null, successText);
        } else if (modalObj.params.token == 'forgotpassword'){
          this.statusControlRef.setsuccess(null, successfulForgotPassword);
        } else if (modalObj.params.token == 'resetpassword'){
          this.statusControlRef.setsuccess(null, successfulResetPassword);
        } else if (modalObj.params.token == 'verifyuser'){
          this.statusControlRef.setsuccess(null, successfulVerification);
        } else if (modalObj.params.token == 'resendverification'){
          this.statusControlRef.setsuccess(null, successfulVerificationResend);
        }
      }
    } else {
      if(this.props.router.params.token == 'signup') {
        const successText = successfulSignup;

        this.statusControlRef.setsuccess(null, successText);
      } else if (this.props.router.params.token == 'forgotpassword'){
        this.statusControlRef.setsuccess(null, successfulForgotPassword);
      } else if (this.props.router.params.token == 'resetpassword'){
        this.statusControlRef.setsuccess(null, successfulResetPassword);
      } else if (this.props.router.params.token == 'verifyuser'){
        this.statusControlRef.setsuccess(null, successfulVerification);
      } else if (this.props.router.params.token == 'resendverification'){
        this.statusControlRef.setsuccess(null, successfulVerificationResend);
      }
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
      return <SimpleLabelledInput key={i}
                              label={field.name}
                              ref={(node) => { this.setFieldRef(node, field.name) } }
                              type={field.type} />;
    });

    return  <div className={formClassName}>

              <ModalHeader title='Login'/>

              <StatusControl  ref={(statusControl) => {this.statusControlRef = statusControl} }
                              waitingcontent={'Logging in'}
                              errorcontent={'Unable to sign in. Please retry later.'}
                              successcontent={'Signed in'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.login}>

                    { inputs }

                    <Btn secondary large type='submit'>Login</Btn>

                  </form>
                </div>
              </div>

              { footer }

            </div>;
  }

  setFieldRef(node, fieldName) {
    switch (fieldName) {
      case 'email': this.emailRef = node; break;
      case 'password': this.passwordRef = node; break;
      default: break;
    }
  }

  getFooterHelpers() {
    return [{
      text     : 'Don\'t have an account?',
      linkText : 'Signup',
      method   : () => { this.props.dispatch(pushState(null, '/signup')); },
    }, {
      text     : '',
      linkText : 'Forgot Password',
      method   : () => { this.props.dispatch(pushState(null, '/forgot-password')); },
    }];
  }
}

const fields = [{
  name : 'email',
  type : 'email',
}, {
  name : 'password',
  type : 'password',
}];
