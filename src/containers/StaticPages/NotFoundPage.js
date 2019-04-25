import React, {Component} from 'react';

import {Footer, Header} from '../../components';

export default class NotFoundPage extends Component{

  render() {

    return <div className='b-page b-page_dashboard'>
            <Header/>

            <div className='container'>
              <div className='b-page__content'>
                <h1 style={{textAlign: 'center'}}>404. Page Not Found</h1>
              </div>
            </div>

            <Footer theme='dashboard'/>

          </div>;
  }
}