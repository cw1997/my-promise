const path = require('path');

const webpackConfig = {
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '.'),
    filename: '[name].min.js',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.([jt])sx?$/,
      use: [{
        loader: 'babel-loader'
      },],
      exclude: '/node_modules/',
    }],
  },
  plugins: [
  ],
  devtool: 'eval-cheap-module-source-map', // 'eval' is not supported by error-overlay-webpack-plugin
  mode: "development",
};

module.exports = webpackConfig;
