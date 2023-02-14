const path = require('path');

const UserScriptMetaDataPlugin = require('../');
const metadata = require('./metadata');

module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: false,
    moduleIds: 'deterministic',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'example.user.js',
  },
  devtool: 'inline-source-map',
  entry: path.join(__dirname, './src/main.js'),
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata,
      test: '.js$',
    }),
  ],
};
