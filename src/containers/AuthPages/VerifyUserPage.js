import React, {Component, PropTypes} from 'react';

import AuthPageDecorator from './AuthPageDecorator';
import {VerifyUserForm} from '../../components';

@AuthPageDecorator()
export default class VerifyUserdPage extends Component {

  render() {

    return <VerifyUserForm {...this.props}/>;

  }

}