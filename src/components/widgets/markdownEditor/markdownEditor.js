import React, { PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';

const MarkdownViewer = require('../../helpers/markdownViewer');
const MarkdownEditorHelper = require('../../helpers/markdownEditor');

class MarkdownEditor extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onMarkdownUpdated = this.onMarkdownUpdated.bind(this);
    this.getMDHtml = this.getMDHtml.bind(this);

    this.state = {
      text: props.content.text,
      mdHtml: props.content.mdHtml,
      onlyCodeChanged: false
    };
  }


  componentWillReceiveProps(nextProps) {
    this.state.text = nextProps.content.text;
    this.state.mdHtml = nextProps.content.mdHtml;
  }

  onMarkdownUpdated({ mdText, mdHtml }) {
    if (this.props.mode !== 'edit') {
      return;
    }

    this.setState({
      mdHtml,
      text: mdText,
      onlyCodeChanged: true
    });
  }

  getMDHtml() {
    let mdHtml = this.state.mdHtml;

    const inEditor = this.props.config ? this.props.config.inEditor : false;
    if (inEditor) {
      if (mdHtml === null || mdHtml === '') {
        mdHtml = `<p style="font-size:16px;color:#ddd"><i>${this.props.placeholder}</i></p>`;
      }
    }

    return mdHtml;
  }

  saveComponent() {
    this.props.updateContentState({
      text: this.state.text,
      mdHtml: this.state.mdHtml,
    });
  }

  render() {
    let compAlign = 'center';
    if (this.props.pageProperties && this.props.pageProperties.pageAlign) {
      compAlign = this.props.pageProperties.pageAlign;
    }

    const readOnly = (this.props.mode !== 'edit');

    if (readOnly) {
      return (
        <MarkdownViewer
            default_themes = {this.props.default_themes}
            mdHtml={this.getMDHtml()} />
      );
    }

    return (
      <div>
        <Row>
          <Col lg={6} md={6}>
            <label style={{ textAlign:compAlign }} className="textEditor-Markdown-label">Markdown</label>
            <div className="textEditor-Markdown">
              <MarkdownEditorHelper
                default_themes={this.props.default_themes}
                placeholder={this.props.placeholder}
                mdText={this.state.text}
                onlyCodeChanged={this.state.onlyCodeChanged}
                onMarkdownUpdated={this.onMarkdownUpdated}
              />
            </div>
          </Col>
          <Col lg={6} md={6}>
            <label style={{ textAlign:compAlign }} className="textEditor-Markdown-label">Preview</label>
            <MarkdownViewer
                default_themes={this.props.default_themes}
                mdHtml={this.getMDHtml()} />
          </Col>
        </Row>
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  mode: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  pageProperties: PropTypes.object,
  config: PropTypes.object,
  updateContentState: PropTypes.func
};

MarkdownEditor.defaultProps = {
  placeholder: 'Write here ...'
};

MarkdownEditor.getComponentDefault = () => {
  return {
    version: '2.0',
    text: '',
    mdHtml: '',
  };
};

module.exports = MarkdownEditor;
