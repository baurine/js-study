const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    filename: '[name].bundle.[hash:4].js', // 给文件名加上 4 位的 hash 值
    path: path.resolve('dist')
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true // 在打包好的 bundle.js 后加上 "?xxx" hash 串
    })
  ],
  devServer: {},
  mode: 'development'
}
