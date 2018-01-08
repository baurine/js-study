# Webpack Note

参考：

- [webpack 3 零基础入门教程](http://webpackbook.rails365.net/466996) | [GitHub](https://github.com/hfpp2012/hello-webpack)
- [webpack 官方指南中文翻译](https://doc.webpack-china.org/guides/)
- [深入浅出 Webpack](https://github.com/gwuhaolin/dive-into-webpack)

## Note 1

Note for [webpack 3 零基础入门教程](http://webpackbook.rails365.net/466996)

我觉得这篇教程写得简洁明了，真正做到了零基础入门，我看完了后对 webpack.config.js 中的配置基本明白了。不打算自己再写太多，不明白就回去看这篇教程。

这里记录一些琐碎的拾遗吧。

webpack 是一个命令，也是一个类似框架的东西。它自身没有太多功能，而是通过调用各种 loader 和插件来对 js / css / images 进行打包。所以，关键在于对 loader 和插件的配置。

如果你不写 webpack.config.js，那么就需要在执行 webpack 命令时，手动写很多选项。有了 webpack.config.js，执行 webpack 命令时，就会自动从这个文件中读取解析各个选项。也可以通过 `webpack --config other_config.js` 来指定其它 config 文件。

但是我们一般也不会直接执行 webpack 命令，而是把它放到 npm package.json 中的 scripts 字段中，如下所示：

    "dev": "webpack -d --watch",
    "prod": "webpack -p"

然后通过 `npm run dev` 或 `npm run prod` 来执行。

HtmlWebpackPlugin 插件，用来自动生成 html 文件。

ExtractTextPlugin 插件，用来将 CSS 抽取到一个单独的文件中，不然 CSS 是混杂在 JS 中的。

为了能使 CSS 生效，需要在任意一个 (我想估计最好是顶层的) 的 JS 文件中 import 这个 CSS 文件，如下所示：

    // app.js
    import css from './app.scss'

在 app.js 中 import app.scss，并不表示在 app.js 中要使用它，只是为了打包输出时，能把 app.scss 中的内容打包进行，如果一个 CSS 文件没有被任何一个 JS 文件 import，这个 CSS 文件就不会被解析、处理并打包。

Webpack 通过 babel-loader 来解析 jsx 文件，而 babel-loader 实际是包裹了 babel 命令，而 babel 其实也是类似 Webpack，它自己也不做太多事，它也是通过调用插件来实现代码转换。babel 中有一个 preset 的概念，一个 preset 是多个插件的集合，因为往往需要声明太多的插件，所以在 babel 中我们往往不再声明插件，而是声明一个个 preset，把它些要用到的 preset 声明在 .babelrc 配置文件中，babel 命令读取这个配置进行工作。

    // .babelrc
    {
      "presets": ["env", "react"]
    }

webpack-dev-server，一个命令，一个微型服务器 (应该是用 Express 实现的)，用来辅助开发调试。执行 webpack-dev-server 命令后，它会首先执行类似 `webpack --d --watch` 命令，对当前工作进行打包输出，然后启动一个服务端进程，供浏览器访问输出的文件。它同时使用 Websocket 维持和浏览器的连接，当检测到文件变化时，它可以将变化发送到流览器端，以支持所谓的热更新 - HotModuleRepalce (HMR)。

webpack-dev-server 还支持代理转发等功能，需要时再研究。

有了 webpack-dev-server 命令后，我们可以用它取代 `webpack --d --watch` 命令。

    // package.json
    "scripts": {
      "dev": "webpack-dev-server",
      "prod": "NODE_ENV=production webpack -p"
    },

在如何打包图片这一小节，我理解了如何处理在 CSS 和 HTML 中使用的图片，但我有一个疑问，如何处理在 React 的 JS 文件中的 img component 所使用的图片呢？

(经过研究，这不是问题，因为在 React 使用图片作为 img 的 src 时，我们要先 import 这张图片，如 `import dog from './images/dog.png'`，而 file-loader 可以处理这种情况。)

其余略。

一份比较完整的 [webpack.config.js](../codes/hello-webpack/webpack.config.js)，以供平时参考。
