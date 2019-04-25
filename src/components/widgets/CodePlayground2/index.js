import React from 'react';
import EditPanels from './src/components/EditPanels';
import CodePlayground from './src/components/CodePlayground2';

export default class Playground extends React.Component {
  static getComponentDefault () {
    const defaultContent = {
      version: '10',
      filename: '',
      active: 'html',

      jotted: {
        pane: 'result',
        height: null,
        heightCodepanel: null,
        showBlank: false,
        hideResult: false,
        hideHtml: false,
        hideCss: false,
        hideJs: false,
        hideNav: false,
        showBabelTransformPane: false,
        codePlaygroundTemplate: 'jottedTabs',
        showLineNumbers: true,
        autoRun: true,
        theme: 'default',
        exercise: false,
        toggleState: {
          result: true,
          html: true,
          css: true,
          js: true,
        },

        plugins: [{
          name: 'codemirror',

          options: {
            lineNumbers: true,
          },
        }],

        files: [{
          type: 'html',

          content: '<html>\n <head>\n   <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.0.js"></script>\n </head>\n <body>\n   <div id="content"/>\n </body>\n</html>\n',
        }, {
          type: 'js',

          content: '$(document).ready(function () {\n$(\'#content\').html(\'<span>Hello World!</span>\');\n});\n',
        }, {
          type: 'hiddenjs',
          content: '\n\n',
        }, {
          type: 'exercise',
          content: 'var TestResult = function() {\r\n    this.succeeded = false;\r\n    this.reason = \"\";\r\n    this.input = \"\";\r\n    this.expected_output = \"\";\r\n    this.actual_output = \"\";\r\n}\r\n\r\nvar executeTests = function(userJsCode, userCssCode, userHtmlCode, userHtmlPage){\r\n  var results = [];\r\n \r\n\tconst jsdom = require(\"jsdom\");\r\n  const { JSDOM } = jsdom;\r\n  const dom = new JSDOM(userHtmlPage);\r\n  \r\n  const result = new TestResult();\r\n  result.expected_output = \'Hello World\';\r\n  result.input = \'Html page\';\r\n  \r\n  const pTag = dom.window.document.querySelector(\"p\");\r\n  if (!pTag) {\r\n    result.actual_output = \'null\';\r\n    result.succeeded = false;\r\n    result.reason = \'No p tag found\'\r\n  }\r\n  else {\r\n\t  const pTagText = pTag ? pTag.textContent : \'\';\r\n  \tresult.actual_output = pTagText;\r\n    if (pTagText.trim() != \'Hello World\') {\r\n      result.reason = \'Did not match expected output (Hello World in a p tag).\'\r\n      result.succeeded = false;\r\n    }  \r\n  }\r\n\r\n  results.push(result);\r\n\r\n  return results;\r\n}\r\n',
        }],
      },
    };
    return defaultContent;
  }

  constructor(){
  	super();
  	this.saveComponent = this.saveComponent.bind(this);
    this.state = {
      scriptsLoaded : false,
    };
  }

  saveComponent() {
  	return this.refs.component.saveComponent();
  }

  render() {
    const readOnly = this.props.mode != 'edit';
  	const Component = readOnly ? CodePlayground : EditPanels;

    let editorMarkerForViewMode = false;
    if(readOnly && this.props.config && this.props.config.inEditor){
      editorMarkerForViewMode = true;
    }

    return (<Component ref="component"
      {...this.props.content}
      isDraft={this.props.isDraft}
      default_themes={this.props.default_themes}
      editorMarkerForViewMode={editorMarkerForViewMode}
      updateContentState={!readOnly &&  this.props.updateContentState}
    />);
  }
}
