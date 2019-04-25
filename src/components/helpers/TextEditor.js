import React, {Component} from 'react';
import MediumEditor from 'medium-editor';
import {findDOMNode} from 'react-dom';

export default class TextEditor extends Component {

  constructor(props, context) {
    super(props, context);

    let dt = new Date().getTime() + Math.floor((Math.random() * 10000) + 1);
    let medId = `Text${dt}`;
    let viewId = `Viewer${dt}`;

    this.state = {
      text: this.props.text,
      editor: null,
      mediumId: medId,
      viewerId: viewId,
    }
  }

  createEditor() {
    if (this.state.editor)
      return;

    //
    // Custom `color picker` extension
    //
    const ColorPickerExtension = MediumEditor.extensions.button.extend({
      name: "colorPicker",
      action: "applyForeColor",
      aria: "color picker",
      contentDefault: "<span class='editor-color-picker'>Color<span>",

      handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.selectionState = this.base.exportSelection();

        // If no text selected, stop here.
        if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
          return;
        }

        // colors for picker
        const pickerColors = [
          "#1abc9c",
          "#2ecc71",
          "#3498db",
          "#9b59b6",
          "#34495e",
          "#16a085",
          "#27ae60",
          "#2980b9",
          "#8e44ad",
          "#2c3e50",
          "#f1c40f",
          "#e67e22",
          "#e74c3c",
          "#bdc3c7",
          "#95a5a6",
          "#f39c12",
        ];

        const picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-color-picker"));
        picker.set("customColors", pickerColors);
        picker.set("positionOnTop");
        picker.openPicker();
        picker.on("colorChosen", color => {
          this.base.importSelection(this.selectionState);
          this.document.execCommand("styleWithCSS", false, true);
          this.document.execCommand("foreColor", false, color);
        });
      },
    });

    //
    // Custom `highlight color picker` extension
    //
    const HighlightExtension = MediumEditor.extensions.button.extend({
      name: "highlight",
      action: "applyForeColor",
      aria: "high light",
      contentDefault: "<span class='editor-highlight-picker'>Highlight<span>",

      handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.selectionState = this.base.exportSelection();

        // If no text selected, stop here.
        if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
          return;
        }

        // colors for picker
        const pickerColors = [
          "#ffec8b",
          "#f1c40f",
          "#f39c12",
          "#ee6363",
          "#FFAB91",
          "#eed2ee",
          "#2c3e50",
          "#34495e",
          "#8e44ad",
          "#3498db",
          "#bfefff",
          "#16a085",
          "#3cb371",
          "#caff70",
          "#95a5a6",
          "#bdc3c7",
        ];

        const picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-highlight-picker"));
        picker.set("customColors", pickerColors);
        picker.set("positionOnTop");
        picker.openPicker();
        picker.on("colorChosen", color => {
          this.base.importSelection(this.selectionState);
          this.document.execCommand("styleWithCSS", false, true);
          this.document.execCommand("backColor", false, color);
        });
      },
    });

    const dom = findDOMNode(this.refs.editorarea);
    const colorPickerObj = new ColorPickerExtension();
    const highlightObj = new HighlightExtension();

    const placeholder = this.props.placeholder ? this.props.placeholder : 'Type your text';

    this.state.editor = new MediumEditor(
      dom,
      {
        toolbar: {
          buttons: this.props.options,
          buttonLabels: 'fontawesome',
        },

        placeholder: {
          text: placeholder,
          hideOnClick: false,
        },

        extensions: {
          colorPicker: colorPickerObj,
          highlight: highlightObj,
        },
      },
    );

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
    this.props.onTextChange(text);
  }
  componentWillReceiveProps(nextProps){
    this.state.text = nextProps.text;
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

      if(this.props.inEditor){
        if(readText == null || readText == '' || this.props.hasDefaultContent){
            readText = `<p style="font-size:16px;color:#ddd"><i>${this.props.placeholder}</i></p>`;
        }
      }

      edStyle   = {display : 'none'};
      viewStyle = {display : 'block'};
    }

    return (
        <div>
          <div  className='mediumTextEditor' ref='editorarea' id={this.state.mediumId}
                contentEditable={true}
                style={edStyle}
                dangerouslySetInnerHTML={{__html: writeText}}>
          </div>
          <span className='mediumTextViewer' id={this.state.viewerId} style={viewStyle}
                dangerouslySetInnerHTML={{__html: readText}}>
          </span>
        </div>
    );
  }
};
