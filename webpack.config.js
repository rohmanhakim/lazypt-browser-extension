const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  context: __dirname,
  devtool: 'eval-source-map',
  entry: {
    popup: './src/scripts/popup.js',
    background: './src/scripts/background.js',
    content: './src/scripts/content.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  }, module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: __dirname + '/src/pages',
          from: '**'
        },
        {
          context: __dirname + '/src/images',
          from: '**',
          to: 'images'
        },
      ],
    }),
  ],
};