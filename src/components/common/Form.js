import React from 'react'

import classnames from 'classnames';

class Form extends React.Component {
  render() {
    let fakeInputs = '';
    if(!this.props.allowAutoComplete) {
      fakeInputs = (
        <div style={{display: 'none'}}>
          <div className='form-group'>
            <input className='' type='text' />
          </div>
          <div className='form-group'>
            <input className='' type='email' />
          </div>
          <div className='form-group'>
            <input className='' type='password' />
          </div>
        </div>
      );
    }
    const classes = classnames({
      'form-inline': this.props.inline,
      'form-horizontal': this.props.horizontal,
    });

    var props = Object.assign(
      this.props,
      {
        role: 'form',
        className: [this.props.className, classes].join(' '),
        autoComplete: (!this.props.allowAutoComplete ? 'off' : 'on'),
      },
    );

    return (
      <form {...props}>
        {fakeInputs}
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = {
  inline: React.PropTypes.bool,
  horizontal: React.PropTypes.bool,
  allowAutoComplete: React.PropTypes.bool,
};

module.exports = Form;
