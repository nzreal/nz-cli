const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  output: {
    filename: 'js/[name].js',
    path: path.resolve(process.cwd(), 'dist'),
  },

  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('DEV'),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true,
    }),
  ],
}
