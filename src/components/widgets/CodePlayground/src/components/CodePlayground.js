import React from 'react';
import {findDOMNode} from 'react-dom';
import JottedReactWrapper from './JottedReactWrapper';
import R from 'ramda';

const BABEL_CDN = '<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.js"></script>';

const insertInString = (target, index, content) =>
    `${target.slice(0, index)}\n${content}\n${target.slice(index)}`;

const wrapStyleTag = (style) => `<style>${style}</style>`;

const wrapScriptTag = (jsCode, type) =>
  `<script language="javascript" type=${type}>${jsCode}</script>`;

const filterByType = (_type) => R.filter(({ type }) => type === _type);

const jottedParamsToContent = ({ files, plugins }, hiddenjs) => {

  const htmlParams = filterByType('html')(files);
  const jsParams = filterByType('js')(files);
  const cssParams = filterByType('css')(files);

  let htmlContent = htmlParams[0].content;

  if (htmlParams.length === 0) {
    return '';
  }

  if (jsParams.length === 0 && cssParams.length === 0) {
    return htmlContent;
  }

  const bundleJs = (htmlContent, jsContent, plugins) => {
    const isBabelEnabled = plugins.filter((plugin) =>
      plugin == 'babel' || plugin.name == 'babel'
    ).length !== 0;

    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    if (isBabelEnabled) {
      htmlContent = insertInString(htmlContent, endOfHeadIndex, BABEL_CDN);
    }

    const endOfBodyTagIndex = htmlContent.indexOf('</body>');

    if (endOfBodyTagIndex == -1) {
      return 'wrong html: should contain body tag';
    }

    const jsScriptType = isBabelEnabled ? 'text/babel' : 'text/javascript';

    return insertInString(htmlContent, endOfBodyTagIndex, wrapScriptTag(jsContent, jsScriptType));
  };

  if (htmlParams.length === 1 && jsParams.length === 1) {
    let jsContent = jsParams[0].content;

    if (hiddenjs) {
      jsContent = `${hiddenjs};\n${jsContent}`;
    }

    htmlContent = bundleJs(htmlContent, jsContent, plugins);
  }

  const bundleCss = (htmlContent, cssContent) => {
    const endOfHeadIndex = htmlContent.indexOf('</head>');

    if (endOfHeadIndex === -1) {
      return 'wrong html: should contain head tag';
    }

    return insertInString(htmlContent, endOfHeadIndex, wrapStyleTag(cssContent));
  };

  if (htmlParams.length === 1 && cssParams.length === 1) {
    htmlContent = bundleCss(htmlContent, cssParams[0].content);
  }

  return htmlContent;
};

export default class CodePlayground extends React.Component {
  saveComponent(){
    return this.refs.playground.getState();
  }

  render() {
    const files = [];
    let hiddenJsFileContent = null;
    this.props.jotted.files.forEach((file) => {
      if (file.type === 'hiddenjs') {
        hiddenJsFileContent = file.content;
      } else if (file.content) {
        files.push({ type:file.type, content:file.content });
      }
    });

    let plugins = [];
    // In case jotted is open in editor for viewing we will disable editing to avoid
    // confusing author by providing an editing area that doesnt persist changes
    if (this.props.editorMarkerForViewMode) {
      this.props.jotted.plugins.forEach((plugin) => {
        if (plugin.name === 'codemirror') {
          plugin.options.readOnly = true;
        }

        plugins.push(plugin);
      });
    } else {
      plugins = this.props.jotted.plugins;
    }

    // delete the hiddenjs file content as it's an extra file that jotted doesn't recognize. We use a plugin to feed this js to jotted.
    delete files.hiddenjs;

    return (<div style={{ minHeight:'150px' }}>
      {this.props.editorMarkerForViewMode ? <p style={{ cursor:'pointer', fontStyle: 'italic', color: '#58bd91', 'textDecoration': 'underline' }} >Click here to edit RunJS</p> : null }
      <div onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      >
      <JottedReactWrapper ref="playground"
        files={files}
        pane={this.props.jotted.pane}
        plugins={plugins}
        showBlank={this.props.jotted.showBlank}
        hideResult={!!this.props.jotted.hideResult}
        hideHtml={!!this.props.jotted.hideHtml}
        hideCss={!!this.props.jotted.hideCss}
        hideJs={!!this.props.jotted.hideJs}
        hideNav={!!this.props.jotted.hideNav}
        height={this.props.jotted.height ? this.props.jotted.height : null }
        showBabelTransformPane={!!this.props.jotted.showBabelTransformPane}
        codePlaygroundTemplate={this.props.jotted.codePlaygroundTemplate}
        hiddenJsFileContent={hiddenJsFileContent}
      />
      {this.props.filename != '' ? <a ref="saveLink" style={{ cursor:'pointer', color: '#337ab7', textDecoration: 'underline', float: 'right'}}
        onClick={(e)=>{
          let hiddenjs = null;
          const result = $.grep(this.props.jotted.files, (e)=> e.type === 'hiddenjs');

          if (result.length === 1) {
            hiddenjs = result[0].content;
          }

          const playgroundState = this.refs.playground.getState();
          const href = `data:text/csv;charset=utf-8,${encodeURIComponent(jottedParamsToContent(playgroundState, hiddenjs))}`
          findDOMNode(this.refs.saveLink).href = href;
          e.stopPropagation();
        }}
        download={this.props.filename}
      >
        download
      </a> : null}
      </div>
    </div>);
  }
}
