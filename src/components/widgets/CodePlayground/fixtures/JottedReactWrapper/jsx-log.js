module.exports = {
  onFilesUpdate: console.log.bind(console),

  files: [{
    type: 'html',

    content: '<html>\n\t<head>\n\t\t<script src="https://fb.me/react-0.14.6.js"></script>\n\t</head>\n</html>\n',
  }, {
    type: 'js',
    content: 'console.log(<div/>);',
  }],

  plugins: [{
    name: 'babel',

    options: {
      presets: ['react'],
    },
  }],
};
