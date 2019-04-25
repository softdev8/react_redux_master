import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {Footer,
        Header} from '../../components';

import {Agreements} from '../../constants';

export default class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const html = {__html : Agreements.PRIVACY_POLICY};
    return  <div className='b-page b-page_profile'>
              <Header/>
              <div className='container'>
                <div className='b-page__content'>
                  <p dangerouslySetInnerHTML={html}></p>
                </div>
              </div>
              <Footer theme='dashboard'/>
            </div>;

  }
}