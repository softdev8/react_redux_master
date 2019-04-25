'use strict';

import React, {Component, PropTypes} from 'react'
import Container from '../Container'

export default class ContainerDemo extends Component {
  render() {
    return <div>
      <Container {...this.props} containerStyle={{width:500, height:500}}/>
    </div>
  }
};

