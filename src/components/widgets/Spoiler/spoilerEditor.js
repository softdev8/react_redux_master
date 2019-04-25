import React, {PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import SpoilerViewer from './spoilerViewer'

const MarkdownViewer = require('../../helpers/markdownViewer');
const MarkdownEditorHelper = require('../../helpers/markdownEditor');

class SpoilerEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSpoilerUpdated = this.onSpoilerUpdated.bind(this);
        this.getMDHtml = this.getMDHtml.bind(this);

        this.state = {
            text: props.content.text,
            mdHtml: props.content.mdHtml,
            onlyCodeChanged: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.content.text,
            mdHtml: nextProps.content.mdHtml
        })
    }

    onSpoilerUpdated({mdText, mdHtml}) {
        if (this.props.mode !== 'edit') {
            return;
        }

        this.setState({
            mdHtml: mdHtml,
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
        const default_themes = {
            Markdown: 'html'
        }
        const editPage = window.location.href.indexOf('collection') > -1 ? true : false
        if (readOnly) {
            return (
                <SpoilerViewer
                   mdHtml={this.getMDHtml()}
                />
            )
        }

        return (
            <div>
                <Row>
                    <Col lg={6} md={6}>
                        <label style={{textAlign: compAlign}} className="textEditor-Markdown-label">Hint Markdown</label>
                        <div className="textEditor-Markdown">
                            <MarkdownEditorHelper
                                placeholder={this.props.placeholder}
                                mdText={this.state.text}
                                onlyCodeChanged={this.state.onlyCodeChanged}
                                onMarkdownUpdated={this.onSpoilerUpdated}
                            />
                        </div>
                    </Col>
                    <Col lg={6} md={6}>
                        <label style={{textAlign: compAlign}} className="textEditor-Markdown-label">Preview</label>
                        <SpoilerViewer
                            mdHtml={this.getMDHtml()}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

SpoilerEditor.propTypes = {
    mode: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired,
    pageProperties: PropTypes.object,
    config: PropTypes.object,
    updateContentState: PropTypes.func
};

SpoilerEditor.defaultProps = {
    placeholder: 'Write here ...'
};

SpoilerEditor.getComponentDefault = () => {
    return {
        version: '2.0',
        text: '',
        mdHtml: '',
    };
};

module.exports = SpoilerEditor;
