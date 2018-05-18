const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist')
  },
  module: {},
  plugins: [],
  devServer: {},
  mode: 'development'
}
