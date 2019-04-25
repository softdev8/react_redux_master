import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {ForgotPasswordForm} from '../../components';

@AuthPageDecorator()
export default class ForgotPasswordPage extends Component {

  render() {

    return <ForgotPasswordForm/>;

  }

}