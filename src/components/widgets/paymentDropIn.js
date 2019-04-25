import React from 'react'
import {Link} from 'react-router';
import StatusControl from '../../components/common/statuscontrol';
import {Grid, Col, Row} from 'react-bootstrap';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import Icon from '../../components/common/Icon';
import Form from '../../components/common/Form';
import Input from '../../components/common/Input';
import FormGroup from '../../components/common/FormGroup';
import PanelContainer from '../../components/common/PanelContainer.js';
import PanelBody from '../../components/common/PanelBody.js';
import Panel from '../../components/common/Panel.js';
import InputGroup from '../../components/common/InputGroup.js';
import InputGroupAddon from '../../components/common/InputGroupAddon.js';
const braintree = require('braintree-web');

import {getBraintreeToken} from '../../actions'

class PaymentDropIn extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onNonceReceived = this.onNonceReceived.bind(this);
    this.onReady = this.onReady.bind(this);

    this.state = {
      transactionId: null,
    };
  }

  componentDidMount() {
    getBraintreeToken().then(JSON.parse).catch((err)=> {
        console.error('Failed to get braintree client token from server');
        return;
    }).then((object)=>{
      this.state.transactionId = object.transaction_id;
      braintree.setup(
        object.token,
        'dropin',
        {
          container: "braintree-payment-form",
          paymentMethodNonceReceived: this.onNonceReceived,
          onReady: this.onReady,
        },
      );
    }).catch((err)=>{
      console.error('Braintree setup failed.')
    });
  }

  onNonceReceived(event, nonce) {
    this.props.onNonceReceived(event.timeStamp, nonce);
  }

  onReady() {
    this.props.onReady(this.state.transactionId);
  }

  render() {
    return (
        <form action="/transactions" method="GET">
          <div id="braintree-payment-form"></div>
          <input type="submit" value="Buy" />
        </form>
    );
  }
}

PaymentDropIn.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default PaymentDropIn;
