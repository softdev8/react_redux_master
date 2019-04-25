import React, {Component, PropTypes} from 'react';

import {Header} from '../../components';

export default function() {

  return function(Form) {
    class AuthPageDecorator extends Component {

      componentDidMount() {
        this.focusOnFirstInput();
      }

      render() {
        
        return (
          <div className='b-page b-page_dashboard b-page_auth'>
            <Header logoLinksToLanding/>
            <div className='b-page__content'>
              <div className='container'>
                <Form {...this.props}/>
              </div>
            </div>

          </div>
        );

      }

      focusOnFirstInput() {
        let forms = document.forms;
        let inputs;

        if(forms && forms.length) inputs = forms[0].elements;
        if(inputs && inputs.length) inputs[0].focus();
      }

    }

    return AuthPageDecorator;
  }

}