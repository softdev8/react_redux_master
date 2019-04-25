import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';

import {Icons} from '../';

export default class LandingFooterBottomPanel extends Component {

  render() {

    return  <div className='b-footer-bottom-panel'>
              <Grid>
                <Row>
                  <Col lg={6} md={6} xs={10} lgOffset={3} mdOffset={3} xsOffset={1}>
                    <p className='b-footer-bottom-panel__legal'>
                      Any photos, data and specifications provided on this Site are for reference only.<br/>Educative reserves the right to make changes at any time to the design<br/>and specifications of Educative tutorials. Educative also reserves the<br/>right from time to time to sell or not any specifictutorials and<br/>products and make changes to the content set forth<br/>here for any model and products.
                    </p>
                    <div className='b-footer-bottom-panel__social'>
                      <i className='b-icon'>{Icons.rssIcon}</i>
                      <i className='b-icon'>{Icons.fbIcon1}</i>
                      <i className='b-icon'>{Icons.twitterIcon1}</i>
                    </div>
                    <h4 className='b-footer-bottom-panel__brand'>Educative.io</h4>
                    <p className='b-copyright'>Copyright © 2014-2015 Educative.io. All rights reserved.<br/>Terms of use  &  Privacy Policy</p>
                  </Col>
                </Row>
              </Grid>
            </div>;

  }
}