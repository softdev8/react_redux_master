const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: "../app.js",

        vendor: [
            "jquery",
            "lodash",
            "timeago",
            "cropper",
            "keymirror",
            "object-assign",
            "q",
            "ramda",
            "react",
            "react-bootstrap",
            "react-bootstrap",
            "react-radio",
            "react-slick",
            "redux",
            "react-toggle",
            "immutable",
        ],
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'ImagesEditorComponent.js',
        publicPath: '/static/',
    },

    externals: {
        jquery: "jQuery",

        //"q": "q",
        //"ramda": "ramda",
        //"react-bootstrap": "react-bootstrap",
        //"redux": "redux",
        //"immutable": "Immutable"
        react: "react",
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            /* chunkName= */"vendor",
            /* filename= */"vendor.bundle.js"
        ),
    ],

    resolve: {
        extensions: ['', '.js'],
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel?stage=0'],
        }],
    },
};
