require('./StatusControl.scss');

import React from 'react'
import {Icons} from '../../index';

const AjaxLoader = require('../AjaxLoader/AjaxLoader');
const Alert = require('../Alert/Alert');

class StatusControl extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._handleClose = this._handleClose.bind(this);

    this.state = {
      successcontent: props.successcontent,
      errorcontent: props.errorcontent,
      waitingcontent: props.waitingcontent,
      status: 'INIT',
      display: 'none',
    };
  }

  _handleClose(e) {
    this.reset();
  }

  reset(cb) {
    this.setState({status: 'INIT', display: 'none'}, cb);
  }

  seterror(cb) {
    this.setState({status: 'ERROR', display: 'block'}, cb);
  }

  seterrortext(text) {
    this.setState({status: 'ERROR', display: 'block', errorcontent: text});
  }

  setsuccess(cb, text) {
    this.setState({status: 'SUCCESS', display: 'block', successcontent: text || this.state.successcontent}, cb);
  }

  setwaiting(cb, text) {
    this.setState({status: 'WAITING', display: 'block', waitingcontent: text || this.state.waitingcontent}, cb);
  }

  stopwaiting(cb) {
    this.reset(cb);
  }

  render() {
    var obj;

    const className = this.props.className ? `b-status-control ${this.props.className}` : 'b-status-control';

    const closeIcon = this.props.closeIcon ? <i onClick={this._handleClose}>{Icons.timesIcon}</i> : null;

    if (this.state.status == "ERROR") {
      var obj =
        <Alert danger collapseBottom>
          <span dangerouslySetInnerHTML={{__html: this.state.errorcontent}}/>
        </Alert>
    }
    else if (this.state.status == "SUCCESS") {
      var obj =
        <Alert success collapseBottom>
          <span dangerouslySetInnerHTML={{__html: this.state.successcontent}}/>
        </Alert>
    }
    else if (this.state.status == "WAITING") {
      var obj = <AjaxLoader ref={'ajaxloader'} visible={true} content={this.state.waitingcontent}/>
    }
    return (
      <div className={className} style={{display: this.state.display}}>
        { obj }
        { closeIcon }
      </div>
    );
  }
}

module.exports = StatusControl;