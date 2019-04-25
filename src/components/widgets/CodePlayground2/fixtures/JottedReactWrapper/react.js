module.exports = {
  onFilesUpdate: console.log.bind(console),

  files: [{
    type: 'html',

    content: '<html>\n\t<head>\n\t\t<script src="https://fb.me/react-0.14.6.js"></script>\n\t\t<script src="https://fb.me/react-dom-0.14.6.js"></script>\n\t</head>\n\t<body>\n\t\t<div id="content"/>\n\t</body>\n</html>\n',
  }, {
    type: 'js',

    content: 'ReactDOM.render(\n\t        <span>Hello, world!</span>,\n\t        document.getElementById("content")\n\t      );',
  }],

  plugins: [{
    name: 'babel',

    options: {
      presets: ['react'],
    },
  }],
};
