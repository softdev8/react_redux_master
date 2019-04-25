require('./InlineStatusControl.scss');

import React, { PropTypes, Component } from 'react';

import AjaxLoader from '../AjaxLoader/AjaxLoader';
import Alert from '../Alert/Alert';

class InlineStatusControl extends Component {

  render() {
    let obj = null;

    const className = this.props.className ? `b-status-control ${this.props.className}` : 'b-status-control';

    if (this.props.statusData.status === 'ERROR') {
      obj = (
        <Alert danger collapseBottom>
          <span dangerouslySetInnerHTML={{ __html: this.props.statusData.text }}/>
        </Alert>
      );
    } else if (this.props.statusData.status === 'SUCCESS') {
      obj = (
        <Alert success collapseBottom>
          <span dangerouslySetInnerHTML={{ __html: this.props.statusData.text }}/>
        </Alert>
      );
    } else if (this.props.statusData.status === 'WAIT') {
      obj = <AjaxLoader ref="ajaxloader" visible content={this.props.statusData.text}/>;
    }
    return (
      <div className={className}>
        {obj}
      </div>
    );
  }
}

InlineStatusControl.propTypes = {
  statusData : PropTypes.object.isRequired,
  className  : PropTypes.string,
};

export default InlineStatusControl;
