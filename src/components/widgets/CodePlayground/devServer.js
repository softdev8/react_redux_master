const path = require('path');
const express = require('express');
const webpack = require('webpack');
const argv = require('yargs').argv;

const ports = {
  dev: 3000,
  playground: 8989,
};

const env = argv.env || 'dev';
const port = ports[env];
const webpackConfig = require(`./webpack.config.${env}`);
const compiler = webpack(webpackConfig);
const app = express();

app.use(require('webpack-dev-middleware')(
  compiler,
  {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
  },
));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/__babel.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'src', 'babel.js'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at localhost:${port}`);
});
