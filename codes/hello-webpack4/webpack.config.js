const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
        use: ['style-loader', 'css-loader']
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
  ],
  devServer: {},
  mode: 'development'
}
