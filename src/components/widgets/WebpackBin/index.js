import React, { Component, PropTypes } from 'react';
import WebpackBinEditor from './editor';
import WebpackBinViewer from './viewer';
import DefaultLoaders from './loaders';

const COMP_VERSION = 2;

class WebpackBinComponent extends Component {
  upgradePropsVersion1toVersion2 = (props) => {
    const { selectedIndex, codeContents } = props.content;

    let maxId = 0;

    const newCodeContents = {
      "module": "/",
      "children": [],
      id: maxId,
    };

    for (let i = 0; i < codeContents.length; ++i) {
      const file = codeContents[i];
      const fileName = file.fileName;

      const data = file;
      delete data.fileName;

      maxId++;

      newCodeContents.children.push({
        module: fileName,
        leaf: true,
        data,
        id: maxId,
      });

      if (i === selectedIndex) {
        newCodeContents.selectedId = maxId;
      }
    }

    newCodeContents.maxId = maxId;

    props.content.codeContents = newCodeContents;
    props.content.version = COMP_VERSION;
    delete props.content.selectedIndex;

    return props;
  }

  getUpdatedProps = (props, toVersion) => {
    if (parseInt(props.content.version) === 1 && toVersion === 2) {
      return this.upgradePropsVersion1toVersion2(props);
    }

    return null;
  }

  upgradeProps = () => {
    if (parseInt(this.props.content.version) !== COMP_VERSION) {
      const newProps = this.getUpdatedProps(this.props, COMP_VERSION);
      this.props.updateContentState({ ...newProps.content });
    }
  }

  componentWillMount() {
    this.upgradeProps();
  }

  render() {
    const props = this.props;

    let comp = null;

    if (props.mode === 'edit' &&
        parseInt(props.content.version) === parseInt(COMP_VERSION)) {

      comp = (<WebpackBinEditor
        {...props}
        updateContentState={props.updateContentState}
      />);
    }
    else {
      comp = <WebpackBinViewer {...props} />;
    }

    return comp;
  }
}

WebpackBinComponent.propTypes = {
  updateContentState: PropTypes.func.isRequired,
};

WebpackBinComponent.getComponentDefault = () => {
  return {
    version: COMP_VERSION,
    theme: 'default',
    showLineNumbers: true,
    hideCodeView: false,
    loaders: DefaultLoaders,
    outputHeight: 300,
    codePanelHeight: 300,
    codeContents: {
      module: "/",
      id: 0,
      maxId: 4,
      selectedId: 3,
      "children": [{
          id: 1,
          module: 'index.html',
          leaf: true,
          data: {
            content: '<html>\r\n    <head>\r\n        <meta charset=\"utf-8\">\r\n      \t<link rel=\'stylesheet\' type=\'text\/css\' href=\'bundle.css\'\/>\r\n      \t<script src=\"https:\/\/fb.me\/react-0.14.6.js\"><\/script>\r\n        <script src=\"https:\/\/fb.me\/react-dom-0.14.6.js\"><\/script>\r\n    <\/head>\r\n    <body>\r\n      <div id=\"content\"><\/div>\r\n      <script type=\"text\/javascript\" src=\"bundle.js\" charset=\"utf-8\"><\/script>\r\n    <\/body>\r\n<\/html>\r\n',
            language: 'html',
            staticFile: true,
            hidden: false,
            highlightedLines: null,
          }
        }, {
          id: 2,
          module: 'index.js',
          leaf: true,
          data: {
            content: 'import ReactDOM from \'react-dom\';\r\nimport App from \'.\/app.js\';\r\n\r\nReactDOM.render(\r\n  <App \/>,\r\n  document.getElementById(\'content\')\r\n);\r\n',
            language: 'jsx',
            staticFile: true,
            hidden: false,
            highlightedLines: null,
          }
        }, {
          id: 3,
          module: 'app.js',
          leaf: true,
          data: {
            content: 'import React from \'react\';\r\nrequire(\'.\/style.css\');\r\n\r\nexport default class App extends React.Component {\r\n  render() {\r\n    return (\r\n      <p>Hello, Hello!<\/p>\r\n    );\r\n  }\r\n}\r\n',
            language: 'jsx',
            staticFile: false,
            hidden: false,
            highlightedLines: null,
          }
        }, {
          module: 'style.css',
          id: 4,
          leaf: true,
          data: {
            content: 'p {\r\n color: blue; \r\n}',
            language: 'css',
            staticFile: false,
            hidden: false,
            highlightedLines: null,
          }
        }
      ],
    }
  };
};

WebpackBinComponent.propTypes = {
  mode: PropTypes.string.isRequired,
};

module.exports = WebpackBinComponent;

/*
  Code Contents V1
  ˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚˚
  codeContents: [{
      fileName: 'index.html',
      content: '<html>\r\n    <head>\r\n        <meta charset=\"utf-8\">\r\n      \t<link rel=\'stylesheet\' type=\'text\/css\' href=\'bundle.css\'\/>\r\n      \t<script src=\"https:\/\/fb.me\/react-0.14.6.js\"><\/script>\r\n        <script src=\"https:\/\/fb.me\/react-dom-0.14.6.js\"><\/script>\r\n    <\/head>\r\n    <body>\r\n      <div id=\"content\"><\/div>\r\n      <script type=\"text\/javascript\" src=\"bundle.js\" charset=\"utf-8\"><\/script>\r\n    <\/body>\r\n<\/html>\r\n',
      language: 'html',
      staticFile: true,
      hidden: false,
      highlightedLines: null,
    }, {
      fileName: 'index.js',
      content: 'import ReactDOM from \'react-dom\';\r\nimport App from \'.\/app.js\';\r\n\r\nReactDOM.render(\r\n  <App \/>,\r\n  document.getElementById(\'content\')\r\n);\r\n',
      language: 'jsx',
      staticFile: true,
      hidden: false,
      highlightedLines: null,
    }, {
      fileName: 'app.js',
      content: 'import React from \'react\';\r\nrequire(\'.\/style.css\');\r\n\r\nexport default class App extends React.Component {\r\n  render() {\r\n    return (\r\n      <p>Hello, Hello!<\/p>\r\n    );\r\n  }\r\n}\r\n',
      language: 'jsx',
      staticFile: false,
      hidden: false,
    }, {
      fileName: 'style.css',
      content: 'p {\r\n color: blue; \r\n}',
      language: 'css',
      staticFile: false,
      hidden: false,
      highlightedLines: null,
    }],
*/