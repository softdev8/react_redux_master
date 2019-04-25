import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import {Footer,
        Header} from '../../components';


export default class FaqPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return  <div className='b-page b-page_profile'>
              <Header/>
              <div className='container'>
                <div className='b-page__content'>
                  <h1 style={{textAlign: 'center'}}>FAQ</h1>
                  <p></p>
                </div>
              </div>
              <Footer theme='dashboard'/>
            </div>;

  }
}