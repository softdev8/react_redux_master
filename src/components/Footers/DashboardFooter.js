import React, {Component, PropTypes} from 'react';

import FooterMenu from './FooterMenu';

export default class DashboardFooter extends Component {

  static PropTypes = {
    className : PropTypes.string,
    theme     : PropTypes.string,
  };

  render() {

    const {className} = this.props;

    return  <footer className={className}>
              <FooterMenu theme={this.props.theme}/>
            </footer>;

  }
}