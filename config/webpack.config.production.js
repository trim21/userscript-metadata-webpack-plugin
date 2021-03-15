const { merge } = require('webpack-merge')
const path = require('path')
const UserScriptMetaDataPlugin = require('../')

const metadata = require('./metadata')
const webpackConfig = require('./webpack.config.base')

const cfg = merge({}, webpackConfig, {
  mode: 'production',
  output: {
    filename: metadata.name + '.prod.user.js',
  },
  entry: './config/empty.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata,
    }),
  ],
})


module.exports = cfg
