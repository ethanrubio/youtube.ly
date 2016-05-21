const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const validate = require('webpack-validator');
const parts = require('./lib/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules/purecss'),
    path.join(__dirname, 'app/main.css')
    ],
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of paths
  // entries. We'll be using the latter form
  // given it's convenient with more complex
  // configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Youtube.ly',
      template: 'app/index.html'
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
  
  case 'stats':
    config = merge(
      common,
      {
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // This is used to require.ensure The
          // setup will work without but
          // this is useful to set
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.setupJSX(PATHS.app),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.setupJSX(PATHS.app),
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
};

module.exports = validate(config);