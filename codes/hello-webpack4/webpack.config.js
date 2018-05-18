const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  },
  module: {},
  plugins: [],
  devServer: {},
  mode: 'development'
}
