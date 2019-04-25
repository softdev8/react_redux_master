import React from 'react'

const TextEditor = require('../helpers/TextEditor');

class MediumTextEditor extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onTextChange = this.onTextChange.bind(this);

    this.state = {
      text: props.content.text,
    };
  }

  componentWillReceiveProps(nextProps) {
    //TBD : Investigate - There isnt much point of doing this. 
    this.state.text = nextProps.content.text;
  }

  isEmpty() {
    return this.state.text == '';
  }

  onTextChange(text) {
    //We cannot do forceUpdate or setState here as medium editor doesnt retain its cursor position on re-render
    this.state.text = text;
  }

  saveComponent() {
    this.props.updateContentState({text:this.state.text});
  }

  render() {
    let options = ['bold', 'italic', 'underline', 'h2', 'h3', 'anchor', 'colorPicker', 'highlight', 'quote', 'strikethrough', 'orderedlist', 'unorderedlist', 'superscript', 'subscript', 'outdent', 'indent', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'fontsize', 'pre', 'removeFormat'];
    let placeHolderText = this.props.placeholder ? this.props.placeholder :'Type your text...';
    if(this.props.index === 0){
      placeHolderText = 'Start writing...';
    }

    let hasDefaultContent = false;
    if(this.props.config && this.props.config.inEditor){
      //If you remove all text from medium editor this is what it keeps
      hasDefaultContent = this.props.content.text == '<p><br></p>' || this.props.content.text === '';
    }

    return <TextEditor mode={this.props.mode}
                       text={this.props.content.text}
                       onTextChange={this.onTextChange}
                       name={this.props.name}
                       options={options}
                       inEditor={this.props.config? this.props.config.inEditor : false}
                       hasDefaultContent = {hasDefaultContent}
                       placeholder={placeHolderText}/>;
  }
}

MediumTextEditor.getComponentDefault = function () {
  const defaultContent = {
    version: '2.0',
    text: '',
  };
  return defaultContent;
};

module.exports = MediumTextEditor;
