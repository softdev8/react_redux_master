var webpack = require("webpack");
var path = require("path");

module.exports = {
    webpack: function (config) {
        config.node = {
            fs: "empty"
        };

		config.plugins = [
		    new webpack.HotModuleReplacementPlugin(),
		    new webpack.NoErrorsPlugin()
	    ]

		config.resolveLoader = { fallback: path.join(__dirname, "node_modules") };
		config.resolve.fallback = path.join(__dirname, "node_modules");
	  	
		config.module.loaders = [
		{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['react-hot-loader', 'babel-loader']
        }, 
        {
          test: /\.jsx?$/,
          include: /cosmos-mocha/,
          loaders: ['babel-loader']
        },
          {
	      test: /^((?!\.module).)*css$/,
	      loader: 'style!css'
	    },
         {
	      test: /^((?!\.module).)*less$/,
	      loader: 'style!css!less'
	    },
        {
          test: /\.module.less$/,
          loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!less'
        },
        {
	      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
	      loader: "url?limit=10000&mimetype=image/svg+xml"
	    },
	    {
	      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
	      loader: "url?limit=10000&mimetype=application/octet-stream"
	    },
	    {
	      test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
	      loader: "url?limit=10000&mimetype=application/font-woff"
	    },
	    {
	      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
	      loader: "file"
	    }
	    ]

        return config;
    }
};