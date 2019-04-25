import styles from './LandingFeature.module.scss';

import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';

import {SearchComponent,
        PageCover, Btn,
        MulticolorLine} from '../../index';

const coverUrl = 'http://localhost:4444/static/dist/imgs/homepage-image.jpg';

export default class LandingFeature extends Component {

  render() {

    return  <div className={styles.feature}>

              <div className={styles['content-wrapper']}>

                <Grid>
                  <MulticolorLine rightColor='rgba(242, 97, 34, .8)'>
                    <Row>
                      <Col xs={12} md={10} className='pull-right'>
                        <div className={styles.content}>
                          <h2 className={styles.title}>
                            <span>Join The World's Fastest Growing</span>
                            <span>Computer Science</span>
                            <span>Community</span>
                          </h2>
                          <Btn primary small>Show me</Btn>
                        </div>
                      </Col>
                    </Row>
                  </MulticolorLine>

                  <Row>
                    <Col xs={12} md={10} className='pull-right'>
                      <SearchComponent  placeholder='Your search for great tutorials starts here....'
                                        buttonContent='Search'/>
                    </Col>
                  </Row>

                </Grid>

              </div>

              <PageCover className={styles.cover} image={coverUrl} mode='read'/>
              
              {/*<div className='b-landing-image-block'>
                                <ResponsiveImage className='b-landing-image' imageSrc='/dist/images/homepage-image.jpg'/>
                              </div>*/}

            </div>;

  }

}