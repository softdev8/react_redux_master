module.exports = {
  filename: 'react-helloworld.html',

  jotted: {
    files: [{
      type: 'html',

      content: '<html>\n\t<head>\n\t\t<script src="https://fb.me/react-0.14.6.js"></script>\n\t\t<script src="https://fb.me/react-dom-0.14.6.js"></script>\n\t</head>\n\t<body>\n\t\t<div id="content"/>\n\t</body>\n</html>\n',
    }, {
      type: 'js',

      content: 'ReactDOM.render(\n\t        <span>Hello, 2 world!</span>,\n\t        document.getElementById("content")\n\t      );',
    }, {
      type: 'css',
      content: "span{ color: red };",
    }],

    plugins: [{
      name: 'babel',

      options: {
        presets: ['react'],
      },
    }],
  },
}
