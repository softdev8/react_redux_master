require('./PageStatusControl.scss');

import { PropTypes, Component } from 'react';

import NProgress from 'nprogress';

class PageStatusControl extends Component {

  componentWillUnmount() {
    if (this.props.loading) {
      NProgress.done();
    }
  }

  render() {
    if (this.props.loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }

    return null;
  }
}

PageStatusControl.propTypes = {
  loading : PropTypes.bool,
};

export default PageStatusControl;
