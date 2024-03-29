var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true,
  stats: {
    colors: true
  },
}).listen(4444, 'localhost', function (err) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:4444');
  });