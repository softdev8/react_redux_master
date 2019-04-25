import { codeExecute } from '../../../actions';
import { flattenTree } from './filesTreeview/treeUtils';

const babelLoader = `
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      presets: ['latest', 'react-app']
    }
  },
  {
    test: /\.svg$/,
    loader: 'url-loader',
    options: {
      limit: 30000,
    },
  },
`;

const cssLoader = `
  {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
  {test: /\.less$/, loader:  ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")},
  {test: /\.scss/, include: [ './' ], loader:  ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")},
`;

const webpackConfig = `
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const ExtractTextPlugin = require("extract-text-webpack-plugin");

  module.exports = {
      entry: "./index.js",
      output: {
          path: './output',
          filename: "bundle.js"
      },
      module: {
          noParse: [ "react", "react-dom" ],
          loaders: [
            $Loaders_String$
          ]
      },
      plugins: [
        new CopyWebpackPlugin([
            { from: '*.html' },
            { from: '*.json' },
            { from: '*.csv' },
            { from: '*.xml' },
            { from: '*.txt' },
          ]),
        new ExtractTextPlugin("bundle.css"),
        function()
        {
            this.plugin("done", function(stats)
            {
                if (stats.compilation.errors && stats.compilation.errors.length)
                {
                  for (let error of stats.compilation.errors) {
                    console.error(error.message);
                  }
                  process.exit(-1);
                }
            });
        }
      ],
      externals: {
        // Use external versions

        'react': 'React',
        'react-dom': 'ReactDOM',
        'd3': 'd3',
      },
      resolve: {
        fallback: process.env.NODE_PATH,
      },
      resolveLoader: {
        fallback: process.env.NODE_PATH
      },
  };
`;

function getConfigFile(loaders) {
  let loaderString = '';
  if (loaders.babel.enabled) {
    loaderString += babelLoader;
  }

  if (loaders.css.enabled) {
    loaderString += cssLoader;
  }

  return webpackConfig.replace('$Loaders_String$', loaderString);
}

// function updateIndexHtml() {
//
// }

function getFilesList(codeContents, loaders) {
  return {
    configFile: getConfigFile(loaders),
    files: flattenTree(codeContents),
  };
}

function genOutput(codeContents, loaders, author_id, collection_id, page_id,
  isDraft, comp_id, callback) {
  const { configFile, files } = getFilesList(codeContents, loaders);

  codeExecute({
    language: 'webpack',
    source_code: configFile,
    additional_files: JSON.stringify(files),
    stdin: '',
    author_id,
    collection_id,
    page_id,
    is_draft_page: isDraft,
    comp_id: comp_id || null
  }).then((res) => {
      const result = JSON.parse(res);
      const { output_files, stderr, status, stdout, reason } = result;
      let outputUrl = null;
      let execError = null;

      if (result.status === 0) {
        const output_files = result.output_files;
        if (output_files &&
            output_files.rootPath &&
            output_files.files.indexOf('index.html') !== -1) {
          outputUrl = output_files.rootPath + '/index.html';
        }
      }
      else {
        execError = result.reason + '\n' + result.stderr;
      }

      callback(false, execError, outputUrl);
    }).catch(error => callback(false, error.responseText, null));
}

export default function (codeContents, loaders, author_id, collection_id, page_id,
  isDraft, comp_id, callback) {
  callback(true, null, null);
  genOutput(codeContents, loaders, author_id, collection_id, page_id,
    isDraft, comp_id, callback);
}
