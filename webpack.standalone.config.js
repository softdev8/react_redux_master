var path = require('path');
var webpack = require('webpack');
var createLoaders = require('./webpack/createLoaders');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var relativeAssetsPath = './static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);

var COMPONENT_STANDALONE = true;

var config = {

  addVendor: function (name, relpath) {
    var abspath = path.join(__dirname, relpath);
    this.resolve.alias[name] = abspath;
    // this.module.noParse.push(new RegExp(abspath));
    this.entry.push(name);
  },

  entry: [
    'webpack-dev-server/client?http://localhost:4441',
    'webpack/hot/only-dev-server',
    'jquery',
    'underscore',
    'bootstrap',
    'codemirror' ,
    'd3',
    'eventemitter2',
    'html5shiv',
    'jquery-ui',
    'react',
    'react-bootstrap',
    './index'
  ],
  devtool: 'eval',
  debug : true,
  devServer: {
    proxy: {
      '/ajax/*': 'http://localhost:8080'
    },
   headers: { "Access-Control-Allow-Origin": "http://localhost:8080" },
   publicPath: "http://localhost:4441/static/"
  },
  cache: true,
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
  resolve: {
    fallback: path.join(__dirname, "node_modules"),
    root: __dirname,
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js'],
    alias: { }
  },
  output: {
    path: assetsPath,
    filename: "component.standalone.dev.js",
    publicPath: "http://localhost:4441/static/"
  },
  module: {
    loaders: createLoaders({rootDirname:__dirname, isDebug:true})
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        "window.jQuery": 'jquery'
    }),
    new webpack.DefinePlugin({
      'COMPONENT_STANDALONE': '"true"'
    }),

    new webpack.HotModuleReplacementPlugin(),
    new WebpackErrorNotificationPlugin(),
    // new ExtractTextPlugin('styles.css', {allChunks: false})
  ]
};


config.addVendor('polyfills',"public/js/polyfills/polyfills.js");
//config.addVendor('jquery-steps', "public/js/vendor/jquery-steps/jquery-steps.js");
//config.addVendor('pace', "public/js/vendor/pace/pace.js");
//config.addVendor('handsontable',"public/js/vendor/handsontable/handsontable.full.js");
//config.addVendor('jcrop',"public/js/vendor/jcrop/jcrop.js");

module.exports = config;