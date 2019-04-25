module.exports = {
  onFilesUpdate: console.log.bind(console),

  files: [{
    type: 'html',

    content: '<html>\n\t<head>\n\t\t<script type="text/javascript" src="//code.jquery.com/jquery-1.12.0.js"></script>\n\t</head>\n\t<body>\n\t\t<div id="content"/>\n\t</body>\n</html>\n',
  }, {
    type: 'js',

    content: '$(document).ready(function () {\n$(\'#content\').html(\'<span>Hello World!</span>\');\n});\n',
  }],
};
