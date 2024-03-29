var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.standalone.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  },
}).listen(4441, 'localhost', function (err) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:4441');
  });