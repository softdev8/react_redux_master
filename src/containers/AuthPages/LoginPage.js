import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {LoginForm} from '../../components';

@AuthPageDecorator()
export default class LoginPage extends Component {

  render() {

    return <LoginForm/>;

  }

}