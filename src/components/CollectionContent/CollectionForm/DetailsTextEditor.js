import React, { Component, PropTypes } from 'react';
import {findDOMNode} from 'react-dom';
import MediumEditor from 'medium-editor';

class DetailsTextEditor extends Component {

  static propTypes = {
    text : PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    let dt = new Date().getTime() + Math.floor((Math.random() * 10000) + 1);
    let medId = `Text${dt}`;
    let viewId = `Viewer${dt}`;

    this.state = {
      text: props.text || '',
      editor: null,
      mediumId: medId,
      viewerId: viewId,
    }
  }

  createEditor() {
    if (this.state.editor)
      return;

    const dom = findDOMNode(this.refs.editorarea);

    this.state.editor = new MediumEditor(
      dom,
      {
        toolbar: {
          buttons: this.props.options,
          buttonLabels: 'fontawesome',
        },

        placeholder: {
          text: '',
          hideOnClick: true,
        },
      },
    );

    // this.state.editor.setContent(this.props.initialValue, 0);

    this.state.editor.subscribe('editableInput', (e) => {
      this.change(dom.innerHTML);
    });

  }
  removeEditor() {
    if (!this.state.editor)
      return;

    // Destroy the editor.
    this.state.editor.destroy();
    this.state.editor = null;
  }
  change(text) {
    this.state.text = text;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== undefined) {
      this.state.text = nextProps.text;
    }
  }
  componentDidMount () {
    if (this.props.mode == "edit") {
      this.createEditor();
    }
  }
  componentWillUpdate() {
  }
  componentDidUpdate() {
    if (this.props.mode == "edit") {
      this.createEditor();
    }
    else {
      this.removeEditor();
    }
  }
  render() {
    let writeText = null;
    let readText = null;
    let edStyle;
    let viewStyle;

    if (this.props.mode == "edit") {
      writeText = this.state.text;
      edStyle   = {display : 'block'};
      viewStyle = {display : 'none'};
    }
    else {
      readText = this.state.text;
      edStyle   = {display : 'none'};
      viewStyle = {display : 'block'};
    }

    return (
        <div style={{width: '100%'}} className="form-control">
          <div  className='mediumTextEditor' ref='editorarea' id={this.state.mediumId}
                contentEditable={true}
                style={edStyle}
                onBlur={() => this.props.onTextChange(this.state.text)}
                dangerouslySetInnerHTML={{__html: writeText}}>
          </div>
          <span className='mediumTextViewer' id={this.state.viewerId} style={viewStyle}
                dangerouslySetInnerHTML={{__html: readText}}>
          </span>
        </div>
    );
  }
}

export default DetailsTextEditor;
