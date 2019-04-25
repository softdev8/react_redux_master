import React from 'react'

const Icon = require('./Icon');

import {Grid, Col, Row} from 'react-bootstrap';
import SidebarControlBtn from './SidebarControlBtn';

class ApplicationSidebar extends React.Component {
  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-header'>PAGES</div>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}}>
                  <SidebarNavItem glyph='icon-fontello-gauge' name='Blank' href='/'/>
                  <SidebarNavItem glyph='icon-feather-mail'
                                  name={<span>Menu <BLabel className='bg-darkgreen45 fg-white'>3</BLabel></span>}>
                    <SidebarNav>
                      <SidebarNavItem glyph='icon-feather-inbox' name='Inbox' href='#'/>
                      <SidebarNavItem glyph='icon-outlined-mail-open' name='Mail' href='#'/>
                      <SidebarNavItem glyph='icon-dripicons-message' name='Compose' href='#'/>
                    </SidebarNav>
                  </SidebarNavItem>
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

class DummySidebar extends React.Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <div className='sidebar-header'>DUMMY SIDEBAR</div>
            <LoremIpsum query='1p'/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default class extends React.Component {
  render() {
    return (
      <div id='sidebar' {...this.props}>
        <div id='avatar'>
          <Grid fluid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/avatars/avatar0.png' width='40' height='40'/>
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>Anna Sanchez</div>
                <div>
                  <Progress id='demo-progress' value={30} min={0} max={100} color='#ffffff'/>
                  <a href='#'><Icon id='demo-icon' bundle='fontello' glyph='lock-5'/></a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0}/>
          <SidebarControlBtn bundle='fontello' glyph='chat-1' sidebar={1}/>
          <SidebarControlBtn bundle='fontello' glyph='chart-pie-2' sidebar={2}/>
          <SidebarControlBtn bundle='fontello' glyph='th-list-2' sidebar={3}/>
          <SidebarControlBtn bundle='fontello' glyph='bell-5' sidebar={4}/>
        </SidebarControls>

        <div id='sidebar-container'>
          <Sidebar sidebar={0} active>
            <ApplicationSidebar />
          </Sidebar>
          <Sidebar sidebar={1}>
            <DummySidebar />
          </Sidebar>
          <Sidebar sidebar={2}>
            <DummySidebar />
          </Sidebar>
          <Sidebar sidebar={3}>
            <DummySidebar />
          </Sidebar>
          <Sidebar sidebar={4}>
            <DummySidebar />
          </Sidebar>
        </div>
      </div>
    );
  }
};
