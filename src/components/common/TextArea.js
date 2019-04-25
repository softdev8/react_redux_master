import React from 'react'
import {findDOMNode} from 'react-dom';

class TextArea extends React.Component {
  getInputDOMNode() {
    return findDOMNode(this.refs.textarea);
  }

  getValue() {
    return this.getInputDOMNode().value;
  }

  render() {
    const props = {
      ...this.props,
      ...{
        className: [this.props.className, 'form-control'].join(' '),
        defaultValue: this.props.children,
      },
    };

    return (
      <textarea ref='textarea' {...props}/>
    );
  }
}

module.exports = TextArea;
