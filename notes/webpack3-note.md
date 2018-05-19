# Webpack Note

## Note 1

参考：

- [webpack 3 零基础入门教程](http://webpackbook.rails365.net/466996) | [GitHub](https://github.com/hfpp2012/hello-webpack)
- [webpack 官方指南中文翻译](https://doc.webpack-china.org/guides/)
- [深入浅出 Webpack](https://github.com/gwuhaolin/dive-into-webpack)
- [webpack 从此不再是我们的痛点 — 核心基础](https://juejin.im/post/5ad1d85f518825651d081c68)

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

update: 还是决定做个完整一些的笔记，免得每次都要去原始网站看，而且担心原始网站哪天要是访问不了了怎么办。

### 1. 介绍

略。

### 2. 安装

全局安装：

    $ npm install -g webpack

然后就要可以全局使用 `webpack` 命令了，比如

    $ wepback -v

但我们一般不全局安装，只在项目目录下安装，在 `npm init` 项目后，使用 `npm install webpack`，然后在 package.json 的 npm script 中使用 webpack 命令。

### 3. 实现 hello world

初始化项目：

    $ mkdir hello-webpack && cd hello-webpack
    $ npm init

安装 webpack，注意使用 `--save-dev` 选项：

    $ npm install --save-dev webpack

手动指定选项使用 webpack:

    $ webpack ./src/app.js ./dist/app.bundle.js
    $ webpack -d --watch ./src/app.js ./dist/app.bundle.js
    $ webpack -p ./src/app.js ./dist/app.bundle.js

- `--watch` 选项用于开发环境，可以监控文件的变化，有变化则实时编译。
- `-p` 用于生产环境，可以在编译时进行压缩，减小生成的文件大小。
- `-d` 表示会同时生成 source maps，开发环境和生产环境都有可能用到。

### 4. webpack 的配置文件 webpack.config.js

直接在命令行使用 webpack 命令很烦，我们可以把所有选项写到 webpack.config.js 中，执行 webpack 命令时，它默认会从这个文件读取配置。

最简单的配置，配置入口 js 和输出 js 文件路径：

    // webpack.config.js
    module.exports = {
      entry: './src/app.js',
      output: {
        filename: './dist/app.bundle.js'
      }
    }

同时，把执行 webpack 命令的操作写到 package.json 的 scripts 字段中：

    // package.json
    "scripts": {
      "dev": "webpack -d --watch",
      "prod": "webpack -p"
    }

这样，我们在命令行中执行 `npm run dev` 时就相当于执行了 `webpack -d --watch` 命令。

### 5. 使用第一个 webpack 插件 html-webpack-plugin

html-webpack-plugin 会帮我们自动生成 html 文件，从而免去我们自己手动创建 html 的过程。

html-webpack-plugin 支持各种选项，从而允许我们动态地生成所需要的 html 文件，比如支持自定义的模板，title 等。

首先要自己手动安装这些插件，每一个插件都是独立的 npm 包，需要自己先安装，然后才能在 webpack.config.js 中导入使用。

    $ npm install html-webpack-plugin --save-dev

在 webpack.config.js 中导入并使用，先使用默认选项：

    const HtmlWebpackPlugin = require('html-webpack-plugin')

    module.exports = {
      ...
      plugins: [
        new HtmlWebpackPlugin()
      ]
    }

接着，我们可以配置一些动态选项，比如模板，title，生成的文件名：

    ...
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        minify: {
          collpaseWhitespace: true,
        }
        hash: true,
      })
    ]

`collpaseWhitespace` 表示生成的 html 会清除不需要的空格 (这样会比较难以阅读，可以用于生产环境)，hash 表示给生成的 js 文件名中加入一串 hash 值，以避免网络缓存的影响。

### 6. 使用 loader 处理 CSS 和 Sass

webpacke 中的 loader:

> loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "加载" 模块时预处理文件。因此，loader 类似于其他构建工具中 "任务 (task)"，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言 (如 TypeScript) 转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件。

把它理解成转换器吧。

webpack 在不装任何插件和 loader 的情况下，只能做极为有限的事情，那就是处理 js 文件，它可以解析多个 js 文件之前的依赖关系，并且 bundle 到一个 js 文件中，而且这些 js 只能用很老的语法，比如 ES5，ES6/JSX/TypeScript 这些先进的语法它都处理不了，必须安装相应的 loader。

默认情况下，webpack 连 css 都处理不了。(你可以在 html 中手动导入这些 css 文件)

我们新建一个 css 文件并在 js 中导入：

    // src/app.css
    body {
      background: pink;
    }

    // src/app.js
    import css from './app.css'
    ...

执行 `npm run dev` 执行 webpack 的编译，失败，处理不了。

我们用 css-loader 和 style-loader 来处理 css (这两者的区别是什么?)

首先是安装：

    $ npm install --save-dev css-loader style-loader

在 webpack.config.js 中配置，loader 统一配置在 module 属性下：

    module.exports = {
      ...
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-laoder', 'css-loader']
          }
        ]
      }
    }

再次编译，成功，但这两个 loader 会把 css 放置到 html 的 style 标签中。我们希望多个 css 应该是要 bundle 成一个 css 并放置到一个单独的 css 文件中的。后面会讲到如何来用 extract-text-webpack-plugin 插件来做这件事情。

在讲这个之前，讲一下如何用 sass-loader 来帮助我们将 sass 编译成 css。我们可以用 sass 语法来写 css，然后使用这些 loader 将其转换成普通的 css。

具体过程略，sass-loader 需要同时安装 node-sass。

新的配置：

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    }

extract-text-webpack-plugin，可以把 css 放置到一个单独的文件中。

安装略。

使用：

    ...
    const ExtractTextPlugin = require('extract-text-webpack-plugin')

    module.exports = {
      ...
      output: {
        path: __dirname + '/dist',
        filename: 'app.bundle.js'
      }
      plugins: [
        ...
        new ExtractTextPlugin('style.css')
      ],
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: ExtractTextPlugin({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          }
        ]
      }
    }

使用了 ExtractTextPlugin 后，css 是放到一个单独文件中了，所以实际 style-loader 是没有作用了，可以不再需要它，上面用 `fallback: 'style-loader'` 可以是为了防止 ExtractTextPlugin 出错后退回到用 style-loader 吧 (如果是这样的话我觉得是错误的设计，出错了应该是去找到原因并修复，而不是让它 fallback)。

编译以后会在 dist 目录下生成 style.css 文件。

另外，还可以使用 postcss-loader 和 autoprefix 来处理 css3 在各大浏览器的兼容问题，自动为一些 css3 属性加上前缀。(具体怎么用还需要再看文档)

更多解释：

> css-loader 使你能够使用类似 @import 和 url（...) 的方法实现 require 的功能，style-loader 将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入 webpack 打包后的 js 文件中。(没错，经过验证，style-loader 生成的 style 仅打包在相应的 js 文件中，不会直接输出到 html 中，检查生成的 html，head 里并没有相应的 style 标签，是 js 在执行时再动态地把 style 放到 html 的 head 中。)

> 因此，我们这样配置后，遇到后缀为 .css 的文件，webpack 先用 css-loader 加载器去解析这个文件，遇到 "@import" 等语句就将相应样式文件引入 (所以如果没有 css-loader，就没法解析这类语句)，最后计算完的 css，将会使用 style-loader 生成一个内容为最终解析完的 css 代码的 style 标签，放到 head 标签里。

> 需要注意的是，loader 是有顺序的，webpack 肯定是先将所有 css 模块依赖解析完得到计算结果再创建 style 标签。因此应该把 style-loader 放在 css-loader 的前面 (webpack loader 的执行顺序是从右到左)。

(以上引用来自：[webpack 学习笔记 1 - css-loader & style-loader](https://blog.csdn.net/qq_38652603/article/details/73822752))

### 7. 初识 webpack-dev-server

webpack-dev-server 也是一个独立的插件，需要安装使用。它实际是 webpack 的一层包裹，执行它，会做几件事，它会先去执行 `webpack --d --watch`，编译打包，然后启动一个 server，根据 webpack.config.js 中的设置配置路由。

webpack-dev-server 没有自己独立的配置文件，反正它都是要读取 webpack.config.js 的，所以它的配置选项是直接写到 webpack.config.js 中的，比如它的默认端口是 8000，但你可以在 webpack.config.js 的 devServer 属性中修改它的端口：

    module.exports = {
      ...
      devServer: {
        port: 9000,
        open: true // 自动打开浏览器
      }
    }

修改 package.json，开发环境使用 webpack-dev-server:

    "scripts": {
      "dev": "webpack-dev-server"
    }

### 8. 用 webpack 和 babel 配置 react 开发环境

首先安装 react，需要安装 react 和 react-dom 两个包：

    $ npm install --save react react-dom

那么问题来了，我们一般用 ES6 和 JSX 语法来写 react，但默认情况下 webpack 无法处理 ES6 和 JSX 语法。

怎么来将 ES6 和 JSX 转换成普通的 ES5 语法呢，我们需要借助 Babel。Babel 是一种语法转换器，但是默认情况下，它也是无法处理 ES6 和 JSX 语法的，它和 webpack 有点相似，需要相应的插件来帮它做具体的工作。

所以我们需要安装基础的 babel：

    $ npm install --save-dev babel-core

babel 需要 env 和 react 两种 presets 来处理 react 代码，每一个 preset 实际都是一系列 babel 插件的集合，我们同时需要安装这两种 presets：

    $ npm install --save-dev babel-preset-react babel-preset-env

env preset 用来转换 ES6 语法，react preset 用来转换 JSX 语法，如果需要用到 ES7 的语法，那么还需要 stage-0 preset。

babel 有自己独立的配置文件 .bablerc，我们创建这个文件，告诉 babel 需要依赖 env 和 react 两个 presets。

    // .babelrc
    {
      "presets": ["env", "react"]
    }

在 webpack 中使用 babel-loader 来调用 babel 处理 ES6 和 JSX 语法。

    module: {
      rules: [
        ...
        {
          test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/
        },
        {
          test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/
        }
      ]
    }

可以简化一下：

    modules: {
      rules: [
        ...
        { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
      ]
    }

写一些 react 代码，略。

### 9. 用 clean-webpack-plugin 来清除文件

一般我们会为编译生成的文件加上 hash 串，这样每次生成的文件名都不一样，如果编译前不清除，那么文件就会越来越多。

安装略。

使用：

    ...
    const path = require('path')
    const pathsToClean = ['dist']

    module.exports = {
      ...
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
      }
      plugins: [
        ...
        new CleanWebpackPlguin(pathsToClean)
      ]
    }

### 10. 配置多个 HTML 文件

通过定义多个 HtmlWebpackPlugin 对象，可以配置多个 html 文件，但这些 html 所包含的 js 是一模一样的 (因为目前为止我们只输出一个 js 文件)。

如果想让它们包含不同的 js 文件，那么意味着我们需要允许有多个 js 输出文件，webpack 支持输出多个 js 文件，配置多个 entry 即可。

    module.exports = {
      entry: [
        "app.bundle": "./src/app.js",
        "contact": "./src/contact.js"
      ],
      ...
      plugins: [
        ...
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          filename: "index.html",
          minify: {
            collpaseWhitespace: true
          },
          hash: true,
          excludeChunks: ['contact'] // 这个 html 将不包含 bundle 输出的 contact.js，从而只包含 app.bundle.js
        }),
        new HtmlWebpackPlugin({
          template: "./src/contact.html",
          filename: "contact.html",
          minify: {
            collpaseWhitespace: true
          },
          hash: true,
          chunks: ['contact'] // 这个 html 将只包含 bundle 输出的 contact.js
        })
      ]
    }

### 11. 使用 pug 作为 HTML 的模板

使用 raw-loader 和 pug-html-loader 即可。

先安装，再配置使用：

    { test: /\.pug$/, loader: ['raw-loader', 'pug-html-loader'] }

### 12. 如何使用模块热替换 HMR 来处理 CSS

HMR: Hot Module Replacement

前面我们用 `webpack --watch` 或 webpack-dev-server 监听到文件变化，然后自动刷新浏览器，而 HMR 只更新修改的那一点地方，而不会导致整个页面重新加载，类似 ajax 一样的效果，实际后台是用 websocket 来实现的。

webpack-dev-server 支持 HMR，但默认是关闭的，我们在 devServer 属性中来开启它：

    devServer: {
      ...
      hot: true
    }

还需要 webpack 内置的两个插件支持 (暂不清楚它们的工作原理)：

    const webpack = require('webpack')
    ...

    module.exports = {
      ...
      plugins: [
        ...
        new webpack.NamedModulesPlguin(),
        new webpack.HotModuleReplacementPlugin()
      ]
    }

如此配置之后，还是出错，需要更多修改，根据提示，将 `filename: '[name].[chunkhash].js'` 改成 `filename: '[name].[hash].js`。

然而，修改 css 后，不会引起页面变化，连自动刷新都没有了。这是因为在 HMR 模式下，不能使用 extract-text-webpack-plugin 这个插件。我们去掉它，HMR 就完全生效了。

但在生产环境，我们还是很需要 extract-text-webpack-plugin 这个插件的，那怎么办呢。

这就产生了一个问题，在开发环境和生产环境下，我们需要不同的配置，有几种办法，我们在后面的章节会讨论到。

### 13. 开发环境 vs 生产环境

方法之一，使用同一个配置文件，但在文件中，通过判断当前是开发环境还是生产环境，选择使用或关闭 extract-text-webpack-plugin 插件。

如果区分开发环境还是生产环境，借助环境变量。修改 package.json，为生产环境传入 `NODE_EVN=production` 的环境变量参数。

    "scripts": {
      "dev": "webpack-dev-server",
      "prod": "NODE_ENV=production webpack -p"
    }

然后在 webpack.config.js 中，我们就能通过 `NODE_ENV` 是否等于 production 来区分处于哪个环境。

    const isProd = process.env.NODE_ENV === 'production'
    const cssDev = ['style-loader', 'css-loader', 'sass-loader']
    const cssProd = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
    const cssConfig = isProd ? cssProd : cssDev

    ...
    module.exports = {
      ...
      plugins: [
        ...
        new ExtractTextPlugin({
          filename: 'style.css',
          disable: !isProd
        })
      ],
      module: {
        rules: [
          ...
          { test: /\.scss$/, use: cssConfig }
        ]
      }
    }

### 14. 如何打包图片

使用图片的几种方式：

1. 在 css 文件中作为背景使用，比如：

        body {
          background: url('./images/logo.png') 0 0 no-repeat;
        }

1. 直接在 html 的 img 标签中作为 src 属性的值，比如：

        <img src='./images/logo.png' />

对于第一种情况，我们使用 file-loader 来处理。

安装，略。

使用，默认情况下，file-loader 会对图片改名，加 hash，我们不希望这样，通过选项可以指定文件的名字和路径，如下所示：

    rules: [
      ...
      {
        test: test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    ]

对于第二种情况，解析 html 中的 img 标签，我们要用 html-loader。这个 loader 的主要工作还是处理 html，处理 img 只是它顺带做的，还可以压缩 html。

安装，略。使用：

    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      ]
    }

压缩图片。在生产环境时，希望图片体积可以小点，image-webpack-loader 可以帮我们自动压缩图片。

安装，略。使用：

    {
      test: /\.(gif|png|jpe?g|svg)$/i,
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
            bypassOnDebug: true,
          }
        }
      ]
    }

### 15. 加载和打包 Bootstrap 框架

暂略，先跳过。

### 16. 使用 ProvidePlugin 插件来处理像 jQuery 这样的第三方包

暂略，先跳过，目前主要使用 React 开发，尽量避免使用 jQuery，操作 DOM 尽量使用 DOM 原生 API。

### 17. 理解 `devtool: 'source-map'`

主要是用来方便调试的，出错时可以定位到错误所在的原始代码的位置。

为 js 代码添加 source-map 支持：

    module.exports = {
      ...
      devtool: 'source-map'
    }

为 css 代码添加 source-map 支持，设置相应的 loader 的 sourceMap 属性为 true，简洁写法如下所示：

    const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']

### 18. 构建开发和生产环境分离的配置文件

将 webpack.config.js 拆成 webpack.dev.js 和 webpack.prod.js，并将公共部分抽取到 webpack.common.js 中，使用 webpack-merge 库，在 dev 和 prod 中将 common 的内容与自身进行 merge。

修改 package.json 中的 scripts，为 dev 和 prod 指定相应的 webpack 配置文件：

    "scripts": {
      "dev": "webpack-dev-server --config webpack.dev.js",
      "prod": "webpack -p --config webapck.prod.js"
    }

还有一些微小的调整，比如把 devtool 选项的值改为 "inline-source-map"。

用了 DefinePlugin 这个插件来定义全局变量，这样就不用通过命令行中通过环境变量来传参数了，比如上面的 scripts 中就没再使用 `NODE_EVN=production`。

DefinePlugin 的使用：

    const webpack = require('webpack')
    const merge = require('webpack-merge')
    const common = require('./webpack.common.js')

    // webpack.prod.js
    module.exports = merge(common, {
      entry: {
        "app.bundle": './src/app.js',
        "contact": './src/contact.js',
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')  // 注意，使用 JSON.stringify 是必要的，原文有参考链接解释
          }
        })
      ]
    })

### 总结

webpack 配置文件中的几个重要的属性：

- entry
- output
- plugins
- module

一些用于开发模式的属性：

- devtool
- devServer

这篇文章 - [webpack 从此不再是我们的痛点 — 核心基础](https://juejin.im/post/5ad1d85f518825651d081c68) 有每个选项的详细介绍。不过这篇文章是基于 webpack4 的，但没关系，基础理念是一样的。
