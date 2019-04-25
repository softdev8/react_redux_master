const path = require('path');
const _ = require('lodash');
const devConfig = require('./webpack.config.dev');

module.exports = _.extend(
  devConfig,
  {
    entry: [
      'webpack-hot-middleware/client',
      './playground/index',
    ],

    module: {
      loaders: [{
        test    : /\.js$/,
        loaders : ['babel'],
        exclude : [/node_modules/],
      }, {
        test    : /\.css$/,
        loader  : 'style!css',
      }, {
        test: /\.module.scss$/,
        loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap',
      }, {
        test: /^((?!\.module).)*scss$/,
        loader: 'style!css!sass',
      }],
    },

    resolve: {
      alias: {
        COSMOS_COMPONENTS: path.join(__dirname, 'src/components'),
        COSMOS_FIXTURES: path.join(__dirname, 'fixtures'),
      },
    },
  },
);
