import React from 'react';
import EditPanels from './src/components/EditPanels';
import CodePlayground from './src/components/CodePlayground';

export default class Playground extends React.Component {
  static getComponentDefault () {
    const defaultContent = {
      version: '8.0',
      filename: '',
      active: 'html',

      jotted: {
        pane: 'result',
        height: null,
        showBlank: false,
        hideResult: false,
        hideHtml: false,
        hideCss: false,
        hideJs: false,
        hideNav: false,
        showBabelTransformPane: false,
        codePlaygroundTemplate: 'jottedTabs',

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
      editorMarkerForViewMode={editorMarkerForViewMode}
      updateContentState={!readOnly &&  this.props.updateContentState}
    />);
  }
}
