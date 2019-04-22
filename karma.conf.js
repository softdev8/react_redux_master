var path = require('path');
var webpack = require('webpack');

var webpackConfig = {
    addVendor: function (name, relpath) {
      var abspath = path.join(__dirname, relpath);
      this.resolve.alias[name] = abspath;
      // this.module.noParse.push(new RegExp(abspath));
      // this.entry.push(name);
    },
      node : {
        fs: "empty"
      },
      devtool: 'inline-source-map',
      module: {
        loaders: [
        { test: /\.js$/, loaders: ['babel-loader'], exclude: [/node_modules/, /public\/js\/vendor/] },
        { 
          test: /^((?!\.module).)*less$/,
          loader: 'style!css!less'
        },
        { 
          test: /\.module.less$/, 
          loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!less'
        },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
        { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" }
        ]
      },
     resolveLoader: { fallback: path.join(__dirname, "node_modules") },
     resolve: {
        fallback: path.join(__dirname, "node_modules"),
        modulesDirectories: [
          'src',
          'node_modules'
        ],
        extensions: ['', '.json', '.js'],
        alias: { }
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
          __KARMA_WEBPACK__: true
        })
      ]
    }

webpackConfig.addVendor('polyfills',"public/js/polyfills/polyfills.js");
webpackConfig.addVendor('spectrum', "public/js/vendor/spectrum/spectrum.js");
webpackConfig.addVendor('jquery-steps', "public/js/vendor/jquery-steps/jquery-steps.js");
webpackConfig.addVendor('messenger', "public/js/vendor/messenger/messenger.min.js");
webpackConfig.addVendor('pace', "public/js/vendor/pace/pace.js");
webpackConfig.addVendor('handsontable',"public/js/vendor/handsontable/handsontable.full.js");
webpackConfig.addVendor('jcrop',"public/js/vendor/jcrop/jcrop.js");

module.exports = function (config) {
  config.set({

    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome' ],

    frameworks: [ 'mocha' ],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha' ],

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true
    }

  });
};