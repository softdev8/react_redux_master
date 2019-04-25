import React, { Component } from 'react';

import CodePlayground from './components/widgets/CodePlayground/src/components/CodePlayground';

const THEME = 'landing';

class Page extends Component {

  render() {

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
        arrangeSideBySide: false,

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

    return (
      <div className={`b-page b-page_${THEME}`}>
        <CodePlayground {...this.props.content} />
      </div>
    );
  }
}

export default Page;
