import commonFormStyles from './Form.module.scss';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {BtnWithIcon, Btn, Icons,
        AjaxLoader,
        StatusControl,
        SimpleLabelledInput} from '../index';
import {ModalHeader, ModalFooter} from '../Modals';

import { parseError } from '../../utils/errorResponseUtils';
import { forgotPassword, showModal } from '../../actions';

import { ModalTypes } from '../../constants';

@connect( state => ({}))
export default class ForgotPasswordForm extends Component {

  static PropTypes = {
    // actionOnSignup : PropTypes.func,
    isModal : PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.forgotpassword = this.forgotpassword.bind(this);

    this.state = {
      status : null,
    }
  }

  forgotpassword(e) {
    e.preventDefault();
    e.stopPropagation();

    const email = this.refs.email.getValue().trim();

    forgotPassword(email).then((data)=>{

      if (this.props.isModal) {
        this.props.dispatch(showModal(ModalTypes.LOGIN, {token : 'forgotpassword'}));
      } else {
        this.refs.statuscontrol.setsuccess();

        this.setState({
          status : 'success',
        });

        this.props.dispatch(pushState(null, '/login/forgotpassword'));
      }

    })
    .catch((err)=>{
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

    const formBaseClass = commonFormStyles.form;
    const formClassName = this.state.status ? `${formBaseClass} ${this.state.status}` : formBaseClass;

    const inputs = fields.map( (field, i) => {
      return <SimpleLabelledInput  key={i}
                              label={field.name}
                              ref={field.name}
                              type={field.type} />;
    });

    return  <div className={formClassName}>

              <ModalHeader title='Forgot Password'/>

              <StatusControl  ref={'statuscontrol'}
                              waitingcontent={'Processing'}
                              errorcontent={'Unable to send reset password link. Please retry later.'}
                              successcontent={'Reset password link sent'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.forgotpassword}>
                    { inputs }
                    <Btn secondary large type='submit'>Recover</Btn>
                  </form>
                </div>
              </div>

              {footer}

            </div>;
  }

  getFooterHelpers() {
    return [{
      text     : '',
      method   : () => { this.props.dispatch(pushState(null, '/login')); },
      linkText : 'Login',
    }];
  }
}

const fields = [{
  name : 'email',
  type : 'email',
}];
