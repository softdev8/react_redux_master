import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {ResetPasswordForm} from '../../components';

@AuthPageDecorator()
export default class ForgotPasswordPage extends Component {

  render() {

    return <ResetPasswordForm {...this.props}/>;

  }

}