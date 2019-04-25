import React from 'react'
import {findDOMNode} from 'react-dom';

//------------------------------------------------------------------------------
// EDIT TEXT COMPONENT
//------------------------------------------------------------------------------

/*
 * Display a text that can be edited by clicking on the edit icon.
 * While editing the text, pressing enter will validate the new content,
 * pressing escape or losing focus (on blur) will cancel the modification.
 *
 * Available props:
 * content - the text content
 * onValueChange(newValue) - callback when text value has changed
 */
class EditText extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateValue = this.updateValue.bind(this);

    this.state = {
      mode: 'view',
    };
  }

  componentDidUpdate() {
    // select the text content when entering edit mode
    if (this.state.mode == 'edit') {
      findDOMNode(this.refs.editor).select();
    }
  }

  gotoEdit() {
    this.setState({
      mode: 'edit',
    });
  }

  gotoView() {
    this.setState({
      mode: 'view',
    });
  }

  handleKeyUp(event) {
    if (event.key == 'Enter') {
      this.updateValue();
    } else if (event.key == 'Escape') {
      this.gotoView();
    }
  }

  updateValue() {
    const value = findDOMNode(this.refs.editor).value.trim();
    this.gotoView();
    this.props.onValueChange(value);
  }

  render() {
    if (this.state.mode == 'edit') {
      // edit mode, display a text input
      return (
        <div className={`${this.props.className} cmcomp-edit-text`}>
          <input ref='editor' type='text' defaultValue={this.props.content} onKeyUp={this.handleKeyUp}
                 onBlur={this.updateValue} maxLength={this.props.maxLength}/>
        </div>
      );
    } else {
      // view mode, display a simple text and an edit icon
      return (
        <div className={`${this.props.className} cmcomp-edit-text`}>
          <span>{this.props.content}</span>
          <span className='glyphicon glyphicon-pencil cmcomp-glyphicon-edit' onClick={this.gotoEdit}/>
        </div>
      );
    }
  }
}

EditText.defaultProps = {
  maxLength: 50,
};

module.exports = EditText;
