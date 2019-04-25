import React from 'react'

const TextEditor = require('../helpers/TextEditor');


class HeadingComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onHeadingChange = this.onHeadingChange.bind(this);
    let dt = new Date().getTime() + Math.floor((Math.random() * 10000) + 1);

    this.state = {
      headingText : props.content.heading,
      id: `heading_${dt}`,
    };
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        headingText : nextProps.content.heading,
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.content !== nextProps.content || this.props.mode !== nextProps.mode;
  }

  onHeadingChange(text) {
    this.state.headingText = text;
  }

  saveComponent() {
       //upgrading the version
    if (!this.props.content.version || this.props.content.version == '1.0') {
      this.props.updateContentState({version: '2.0', heading: this.state.headingText});
    } else {
      this.props.updateContentState({heading: this.state.headingText});
    }
  }

  render() {

    let heading = null;
    if (!this.props.content.version || this.props.content.version == '1.0') {
      switch (parseInt(this.props.content.size)) {
        case 1:
          heading = `<h1 style={{margin:0}}>${this.state.headingText}</h1>`;
          break;

        case 2:
          heading = `<h2 style={{margin:0}}>${this.state.headingText}</h2>`;
          break;

        case 3:
          heading = `<h3 style={{margin:0}}>${this.state.headingText}</h3>`;
          break;

        case 4:
          heading = `<h4 style={{margin:0}}>${this.state.headingText}</h4>`;
          break;

        case 5:
          heading = `<h5 style={{margin:0}}>${this.state.headingText}</h5>`;
          break;

        case 6:
          heading = `<h6 style={{margin:0}}>${this.state.headingText}</h6>`;
          break;

        default:
          heading = `<h3 style={{margin:0}}>${this.state.headingText}</h3>`;
      }

      if (this.state.headingText == '') {
        heading = '<h1><br/></h1>';
      }
      this.state.headingText = heading;
    }
    else {
      heading = this.state.headingText;
    }

    let hasDefaultContent = false;
    if(this.props.config && this.props.config.inEditor){
      //If you remove all text from medium text editor this is what it keeps
      hasDefaultContent = heading == '<h2><br></h2>' || heading == '<h2><br/></h2>' || heading === '';
    }

    const options = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'colorPicker', 'highlight'];

    const placeholder = 'Type your heading';
    return <TextEditor mode={this.props.mode} text={heading}
            onTextChange={this.onHeadingChange}
            options={options} placeholder={placeholder}
            inEditor={this.props.config? this.props.config.inEditor : false}
            hasDefaultContent = {hasDefaultContent}
            id={this.state.id}/>;
  }
}

HeadingComponent.getComponentDefault = function () {
  const defaultContent = {
    version: '2.0',
    heading: '<h2><br/></h2>',
  };
  return defaultContent;
};

module.exports = HeadingComponent;
