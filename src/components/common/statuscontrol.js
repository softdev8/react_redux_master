import React from 'react'

const AjaxLoader = require('./ajaxloader');
const Alert = require('../common/Alert');

class StatusControl extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      successcontent: props.successcontent,
      errorcontent: props.errorcontent,
      waitingcontent: props.waitingcontent,
      status: 'INIT',
      display: 'none',
    };
  }

  seterror(cb) {
    this.setState({status: 'ERROR', display: 'block'}, cb);
  }

  seterrortext(text) {
    this.setState({status: 'ERROR', display: 'block', errorcontent: text});
  }

  setsuccess(cb) {
    this.setState({status: 'SUCCESS', display: 'block'}, cb);
  }

  setwaiting(cb) {
    this.setState({status: 'WAITING', display: 'block'}, cb);
  }

  stopwaiting(cb) {
    this.setState({status: 'INIT', display: 'none'}, cb);
  }

  render() {
    var obj;

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
      <div className='status-control' style={{display: this.state.display}}>
        {obj}
      </div>
    );
  }
}

module.exports = StatusControl;