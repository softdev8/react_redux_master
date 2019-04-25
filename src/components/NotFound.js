import React from 'react'
import Icon from '../components/common/Icon';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import PanelContainer from '../components/common/PanelContainer';
import PanelBody from '../components/common/PanelBody';
import Panel from '../components/common/Panel';
import Container from '../components/common/Container';
import {Grid, Col, Row} from 'react-bootstrap';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Container id='body'>
          <Grid gutterBottom fluid>
            <Row>
              <Col sm={12} className='text-center'>
                <PanelContainer>
                  <Panel>
                    <PanelBody>
                      <Grid fluid>
                        <Row>
                          <Col xs={12}>
                            <div>
                              <Icon style={{fontSize: 288, lineHeight: 1}} glyph='icon-mfizz-ghost'/>
                            </div>
                            <h1 style={{marginBottom: 25, marginTop: 0}}>Page not found!</h1>
                          </Col>
                        </Row>
                      </Grid>
                    </PanelBody>
                  </Panel>
                </PanelContainer>
              </Col>
            </Row>
          </Grid>
        </Container>
        <Footer />
      </div>
    );
  }
};
