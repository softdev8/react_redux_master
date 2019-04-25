import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
const NoneComponent = require('./noneComponent');

const CodeFileExtensions = {
  'c++': 'cpp',
  'c#': 'cs',
  'erlang': 'erl',
  'haskell': 'hs',
  'javascript': 'js',
  'markdown': 'md',
  'perl': 'pl',
  'python': 'py',
  'python3': 'py',
  'r': 'r',
  'ruby': 'rb',
  'rust': 'rs',
  'scala': 'scala',
  'scheme': 'ss',
  'shell': 'sh'
};

class CodeDownload extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <a ref="saveLink" style={{ cursor:'pointer', color: '#337ab7', textDecoration: 'underline' }}
            onClick={ (e) => {
              const code = this.props.content;
              const href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(code);
              findDOMNode(this.refs.saveLink).href = href;
              e.stopPropagation();
            }}
            download={CodeFileExtensions[this.props.language] ? 'file.' + CodeFileExtensions[this.props.language] : 'file.' + this.props.language }
          >
            {this.props.children || 'Download'}
          </a>
        </div>
      </div>
    );
  }
}

CodeDownload.propTypes = {
  content         : PropTypes.string,
  language        : PropTypes.string,
};

export default CodeDownload;
