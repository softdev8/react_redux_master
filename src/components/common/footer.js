import React from 'react'

import {Grid, Col, Row} from 'react-bootstrap';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      version: 1,
    };
  }

  componentDidMount() {
    this.setState({
      version: document.getElementsByTagName('body')[0].getAttribute('data-version'),
    });
  }

  render() {
    return (
      <div id='footer-container'>
        <Grid fluid id='footer' className='text-center'>
          <Row>
            <Col xs={12}>
              <div>© 2015 Educative - v{this.state.version}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

module.exports = Footer;
