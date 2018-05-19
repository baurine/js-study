const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    // filename: '[name].bundle.[hash:4].js', // 给文件名加上 4 位的 hash 值
    filename: '[name].js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader']
        use: ExtractTextWebpackPlugin.extract({
          // 将 css 用 link 的方式引入就不再需要 style-loader 了
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'],
      // hash: true // 在打包好的 bundle.js 后加上 "?xxx" hash 串
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      filename: 'login.html',
      chunks: ['login'],
      // hash: true // 在打包好的 bundle.js 后加上 "?xxx" hash 串
    }),
    new ExtractTextWebpackPlugin('css/style.css')
  ],
  devServer: {},
  mode: 'development'
}
