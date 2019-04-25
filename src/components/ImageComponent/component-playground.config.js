const webpack = require('webpack');

module.exports = {
  webpack(config) {
    config.module.loaders = config.module.loaders.concat(
      [{
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream",
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml",
      }, {
        test: /\.json$/,
        loader: "json",
      }, {
        test: /\.less$/,
        loader: "less",
      }],
    );

    return config;
  },
};