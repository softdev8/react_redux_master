require('../styles/commonSyles.scss');

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { ModalWindow } from '../components';
import { PageStatusControl } from './index';
import { DEFAULT_TITLE } from '../constants/pageTitles';

@connect(({ user : { info }, modals })=>({
  modals,
  userInfo : info,
}))
class App extends Component {

  render() {

    const { modals, children, userInfo } = this.props;
    const showModal  = modals.get('showModal');
    const typeToShow = modals.get('typeToShow');

    // make userInfo available for child
    const child = React.cloneElement(children, { userInfo: userInfo.data || {} });

    return (
      <div id="app">
        <Helmet
          title={DEFAULT_TITLE}
          meta={[{property: 'og:title', content: DEFAULT_TITLE}]}
        />

        { child }

        <PageStatusControl />

        <ModalWindow  key="modal"
                      showModal = {showModal}
                      modalType = {typeToShow}/>
      </div>
    );

  }

}

App.propTypes = {
  children : PropTypes.node.isRequired,
  modals   : PropTypes.object,
  userInfo : PropTypes.object,
};

export default App;
