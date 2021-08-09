const path = require('path');

module.exports = {
  entry: './static/dist/index.js',
  output: {
    path: path.resolve(__dirname, './static'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  }
};