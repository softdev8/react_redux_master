import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {ResendVerificationForm} from '../../components';

@AuthPageDecorator()
export default class ResendVerificationPage extends Component {

  render() {

    return <ResendVerificationForm/>;

  }

}