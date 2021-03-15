const path = require('path')
const webpack = require('webpack')

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: false,
    moduleIds: 'deterministic',
  },
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `example.user.js`,
  },
}

module.exports = webpackConfig
