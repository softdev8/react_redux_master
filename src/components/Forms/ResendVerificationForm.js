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
import { resendVerificationLink } from '../../actions';

@connect( state => ({}))
export default class ResendVerificationForm extends Component {

  constructor(props) {
    super(props);

    this.sendVerificationLink = this.sendVerificationLink.bind(this);

    this.state = {
      status : null,
    }
  }

  sendVerificationLink(e) {
    e.preventDefault();
    e.stopPropagation();

    const email = this.refs.email.getValue().trim();

    resendVerificationLink(email).then((data)=>{

      this.refs.statuscontrol.setsuccess();

      this.setState({
        status : 'success',
      });

      this.props.dispatch(pushState(null, '/login/resendverification'));

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
      return <SimpleLabelledInput key={i}
                              label={field.name}
                              ref={field.name}
                              type={field.type}/>;
    });

    return  <div className={formClassName}>

              <ModalHeader title='Resend Verification'/>

              <StatusControl  ref={'statuscontrol'}
                              waitingcontent={'Processing'}
                              errorcontent={'Unable to send verification link. Please retry later.'}
                              successcontent={'Verification Link sent'}/>

              <div className={commonFormStyles.body}>
                <div className={`${commonFormStyles.column} ${commonFormStyles.single}`}>
                  <form className={commonFormStyles.form} onSubmit={this.sendVerificationLink}>
                    { inputs }
                    <Btn secondary large type='submit'>Resend</Btn>
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
