var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var nodeExternals = require('webpack-node-externals')
var rootPath = process.cwd()
const api = process.env.api || 'http://45.55.244.189:3006/'

var client = {
  context: path.join(rootPath, 'src'),
  name: 'client',
  entry: {
    main: './app.js',
    vendor: ['moment', 'axios', 'js-cookie', 'jwt-decode', 'redux', 'react', 'react-dom', 'react-router']
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(rootPath, 'static/production'),
    publicPath: '/static/production/'
  },
  plugins: [
    new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor', 'manifest']}),
    new webpack.DefinePlugin({
      'process.env': {
        'target': JSON.stringify('production'),
        'NODE_ENV': JSON.stringify('production'),
        'targetenv': JSON.stringify('browser'),
        'api': JSON.stringify(api)
      }
    }),
    new webpack.NormalModuleReplacementPlugin(/SyncRoutes.js/, './AsyncRoutes.js')
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.(css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {minimize: true, modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]'}
            },
            'postcss-loader'
          ]
        })
      }
    ]
  }
}

var server = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  context: path.join(rootPath, 'src'),
  entry: './containers/Root/routes.js',
  output: {
    filename: 'routes.js',
    path: path.join(rootPath, 'build/production'),
    libraryTarget: 'commonjs2',
    publicPath: '/build/production/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'target': JSON.stringify('production'),
        'NODE_ENV': JSON.stringify('production'),
        'targetenv': JSON.stringify('server'),
        'api': JSON.stringify(api)
      }
    })
  ],
  module: {
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(css)$/,
        use: [
          {
            loader: 'css-loader/locals',
            query: {modules: true, importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]'}
          },
          'postcss-loader'
        ]
      }
    ]
  }
}

module.exports = [client, server]
