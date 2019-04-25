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
class CaptionText extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.gotoView = this.gotoView.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

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
      const value = findDOMNode(this.refs.editor).value.trim();
      this.gotoView();
      this.props.onValueChange(value);
    } else if (event.key == 'Escape') {
      this.gotoView();
    }
  }

  render() {
    if (this.state.mode == 'edit') {
      // edit mode, display a text input
      return (
        <div className={`${this.props.className} cmcomp-edit-text`}>
          <input ref='editor' type='text' defaultValue={this.props.content} onKeyUp={this.handleKeyUp}
                 onBlur={this.gotoView}/>
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

module.exports = CaptionText;
