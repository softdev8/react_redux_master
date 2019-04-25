import React from 'react'
import Container from '../components/common/Container';
import PanelContainer from '../components/common/PanelContainer.js';
import PanelBody from '../components/common/PanelBody.js';
import Panel from '../components/common/Panel.js';
import CodeMirrorComp from "../components/multitab_code";
import {Grid, Col, Row} from 'react-bootstrap';
import Header from '../components/common/header';
import Sidebar from '../components/common/sidebar';
import Footer from '../components/common/footer';

export default class extends React.Component {
  render() {
    const content = {
      codeContents: [{
        title: 'html',
        caption: 'HTML',
        language: 'html',
        theme: 'solarized light',
        content: '<html><body><p>Hello</p></body></html>',
      }, {
        title: 'javascript',
        caption: 'JavaScript',
        language: 'javascript',
        theme: 'ambiance',
        content: 'function hello(name) { return "Hello " + name; }',
      }, {
        title: 'php',
        caption: 'PHP',
        language: 'php',
        theme: 'eclipse',
        content: '$a = 1',
      }, {
        title: 'java',
        caption: 'Java',
        language: 'java',
        theme: 'solarized light',
        content: 'public class Hello { public void hello() {}}',
      }, {
        title: 'c',
        caption: 'C',
        language: 'c',
        theme: 'solarized dark',
        content: 'int main() { printf("hello"); }',
      }],
    };
    return (
      <div>
        <Sidebar />
        <Header />
        <Container id='body'>
          <Grid fluid>
            <Row>
              <Col sm={12}>
                <PanelContainer>
                  <Panel>
                    <PanelBody className='text-center'>
                      <p>BLANK PAGE</p>
                    </PanelBody>
                  </Panel>
                </PanelContainer>

                <PanelContainer>
                  <Panel>
                    <PanelBody>
                      <CodeMirrorComp content={content} mode='edit'/>
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
