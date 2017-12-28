const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlguin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
const cssProd = ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: ['css-loader', 'sass-loader']
                })
const cssConfig = isProd ? cssProd : cssDev

module.exports = {
  entry: {
    "app.bundle": './src/app.js',
    "contact": './src/contact.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  devServer: {
    port: 9000,
    open: true,
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlguin({
      // title: 'Hello Webpack'
      template: './src/template-index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
      excludeChunks: ['contact']
    }),
    new HtmlWebpackPlguin({
      // title: 'Hello Webpack'
      template: './src/template-contact.html',
      filename: 'contact.html',
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
      chunks: ['contact']
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: !isProd
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig
      },
      // 处理 react
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jpeg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      }
    ]
  }
}
