import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';

export default class LandingFooterTopPanel extends Component {

  render() {

    return  <div className='b-footer-top-panel'>
              <Grid>
                <Row>
                  <Col lg={7} md={8} xs={7}>
                    <article className='b-footer-top-panel__text'>
                      <header>Become an author</header>
                      <p>A 100,000 strong community is waiting to read your first tutorial. And its absolutely free.</p>
                    </article>
                  </Col>
                  <Col lg={3} md={3} xs={4} className='pull-right'>
                    <Button block className='b-btn b-btn_white-border'>Create an Account</Button>
                  </Col>
                </Row>
              </Grid>
            </div>;

  }
}