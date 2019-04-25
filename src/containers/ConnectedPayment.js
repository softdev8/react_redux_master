import React from 'react'
import {login} from '../actions';
import {errorResponseUtils} from '../utils'
import Payment from '../components/Payment';
import authentificationClassDecorator from '../decorators/authentificationClassDecorator';
import sidebarDecorator from '../decorators/sidebarDecorator';

class ConnectedPayment extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      title: "Coderust 2.0",
      price: "20",

      // collection/page ID
      titleId: 12345,

      authorId: 5629499534213120,
      workId: 4925812092436480,
    };
  }

  render() {
    return (
        <Payment  title={this.state.title}
                  price={this.state.price}
                  titleId={this.state.titleId}
                  authorId={this.state.authorId}
                  workId={this.state.workId}/>
    );
  }
}

ConnectedPayment.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default ConnectedPayment;