import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {SignupForm} from '../../components';

@AuthPageDecorator()
export default class ForgotPasswordPage extends Component {

  render() {
    return <SignupForm {...this.props}/>;

  }

}