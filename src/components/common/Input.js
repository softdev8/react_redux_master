import React from 'react'
import {findDOMNode} from 'react-dom';
import classnames from 'classnames';

class Input extends React.Component {
  getChecked() {
    if(this.props.type === 'checkbox' || this.props.type === 'radio')
      return this.getInputDOMNode().checked;
    else throw Error('Input type not checkbox or radio');
  }

  getInputDOMNode() {
    return findDOMNode(this.refs.input);
  }

  getValue() {
    return this.getInputDOMNode().value;
  }

  setChecked(value) {
    if(this.props.type === 'checkbox' || this.props.type === 'radio')
      this.getInputDOMNode().checked = value;
    else throw Error('Input type not checkbox or radio');
  }

  render() {
    const classesObj = {
      'input-lg': this.props.lg,
      'input-sm': this.props.sm,
    };
    switch(this.props.type) {
      case 'tel':
      case 'url':
      case 'date':
      case 'time':
      case 'week':
      case 'text':
      case 'color':
      case 'month':
      case 'email':
      case 'number':
      case 'search':
      case 'password':
      case 'datetime':
      case 'datetime-local':
        classesObj['form-control'] = true;
        break;
      default:
        break;
    }
    const classes = classnames(classesObj);

    var props = {
      ...this.props,
      ...{
        ref: 'input',
        className: [this.props.className, classes].join(' '),
      },
    };

    return (
      <input {...props} />
    );
  }
}

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = {
  type: React.PropTypes.string.isRequired,
  lg: React.PropTypes.bool,
  sm: React.PropTypes.bool,
};

module.exports = Input;
