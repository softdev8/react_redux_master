import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {SettingsContent,
        StatusControl,
        Header, Footer} from '../../components';

import {getUser, changePassword} from '../../actions';
import { parseError } from '../../utils/errorResponseUtils';

@connect( state => ({}))
export default class SettingsPage extends Component {

  constructor(props) {
    super(props);

    this.onUpdatePassword = this.onUpdatePassword.bind(this);
    this.onUpdateUsername = this.onUpdateUsername.bind(this);
    this.onUpdatePayment  = this.onUpdatePayment.bind(this);
    this.onDeleteAccount  = this.onDeleteAccount.bind(this);

    this.state = {
      user    : getUser(),
      payment : getFakePayment(),
      status  : null,
    }
  }

  render() {

    return <div className='b-page b-page_dashboard'>
            <Header/>

            <div className='container'>
              <div className='b-page__content'>

                <SettingsContent {...this.state}
                                 updatePassword={this.onUpdatePassword}
                                 updateUsername={this.onUpdateUsername}
                                 updatePayment={this.onUpdatePayment}
                                 deleteAccount={this.onDeleteAccount}>

                  <StatusControl  ref={'statuscontrol'}
                                  waitingcontent={'Processing'}
                                  errorcontent={'Something went wrong.'}
                                  successcontent={'Success'}
                                  closeIcon={true}/>
                                  
                </SettingsContent>                                 
              </div>
            </div>

            <Footer theme='dashboard'/>
           </div>;
  }

  onUpdateUsername(username) {
    console.log(username);
  }

  onUpdatePassword(password) {

    changePassword(password).then( result => {
      this.refs.statuscontrol.setsuccess();
    }).catch( error => {
      const errText = parseError(error);

      if (errText != null) {
        this.refs.statuscontrol.seterrortext(errText);
      }
      else {
        this.refs.statuscontrol.seterror();
      }
    });
  }

  onUpdatePayment(deleted) {
    console.log(deleted);
  }

  onDeleteAccount() {
    console.log('deleted');
    this.props.dispatch(pushState(null, '/welcome'));
  }
}

function getFakePayment() {

  return [{
    code : 'XXXX-XXXX-XXXX-1234',
    id   : 123456,
  }, {
    code : 'XXXX-XXXX-XXXX-9876',
    id   : 123452,
  }];
}