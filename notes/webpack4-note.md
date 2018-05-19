# Webpack Note

## Note 2

参考：

- [webpack 4 测试版 -- 现在让我们先一睹为快吧！](https://juejin.im/post/5a72d569f265da3e3a6e2118)
- [webpack 从此不再是我们的痛点 — 核心基础](https://juejin.im/post/5ad1d85f518825651d081c68)
- [webpack4 - 用之初体验，一起敲它十一遍](https://juejin.im/post/5adea0106fb9a07a9d6ff6de)

---

### Note 2.1

Note for [webpack 4 测试版 -- 现在让我们先一睹为快吧！](https://juejin.im/post/5a72d569f265da3e3a6e2118)

webpack 4 的变化

受 Parcel 影响或刺激，webpack 4 也可以零配置工作了，默认 entry 是 `./src`，默认输出是 `./dist`。

webpack 4 重新设计了插件系统。

增加 mode 选项，值为 production 或 development，自动为生产模式提供各种优化，开发模式则优化了开发速度和开发体验。

去除了 CommonsChunkPlugin。

其余的详见上面的链接文章。

---

### Note 2.2

Note for [webpack4 - 用之初体验，一起敲它十一遍](https://juejin.im/post/5adea0106fb9a07a9d6ff6de)

#### 安装

webpack4 将 core 和 cli 进行了分离，命令行的 webpack 命令挪到了 webpack-cli 包中，因此我们需要安装两个包：

    $ npm i webpack webpack-cli -D

`-D` 是 `--save-dev` 的缩写形式。

#### 零配置

    $ npx webapck
    $ npx webpack --mode development

在没有任何选项和默认配置文件的情况下 (即没有 webpack.config.js)，直接执行 webpack 命令，相当于执行了 `webpack --mode produciton`，它会使用一些默认选项，比如 entry 是 `./src/index.js`，output 是 `./dist/main.js`。

#### 最原始的 webpack.config.js

    module.exports = {
      entry: '',
      output: {},
      module: {},
      plugins: [],
      devServer: {},
      mode: 'development'
    }

#### 配置 scripts

开发模式下用 webpack-dev-server，安装略。

    // package.json
    "scripts": {
      "build": "webpack",
      "dev": "webpack-dev-server"
    }

#### 多个 entry

略，和 webpack3 一样，看 webpack3 的 note。

#### 配置 html 模板

略，和 webpack3 一样。使用 html-webpack-plugin。

#### 配置多个 html 页面

略，和 webpack3 一样。

#### 引用 CSS 文件

略，和 webpack3 一样。使用 style-loader 和 css-loader。

注意，经过我的实验发现，style-loader 处理后 bundle 出来的 css content，只会放到 import 了它的 js 文件中，而不会直接输出到 html 的 head 的 style 标签中，js 代码执行时再动态地把 css content 放到 html head 的 style 标签中。

#### 将 CSS bundle 到一个单独文件中

略，和 webpack3 一样，使用 extract-text-webpack-plugin，但安装时要注意，稳定版定只用于 webpack3，用于 webpack4 的版本目前需要加上 `@next` 后缀，即：

    $ npm i extract-text-webpack-plugin@next -D

使用这个插件后，不再需要 style-loader。

#### 拆分多个 CSS

同样使用 extrac-text-webpack-plugin，但目前暂时不需要，跳过。写 chrome extension 时可能需要，那时再看。

#### 处理图片

处理作为背景的图片，使用 file-loader 和 url-loader，url-loader 可以将体积较小的图片转成 base64。

作为 img src 的图片，使用 html-withimg-loader。(webpack3 中是使用了 html-loader)

#### 字体

同样使用 file-loader。

#### 添加 CSS3 前缀

使用 postcss-loader 和 autoprefixer 插件。

安装，略。

使用：

    module.exports = {
      plguins: [
        ...
        require('autoprefixer')
      ],
      module: {
        rules: [
          ...
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
          }
        ]
      }
    }

#### 转义 ES6 语法

使用 babel-loader，babel-loader 需要 babel，需要安装 babel-core。

使用 babel 转义 ES6 语法，依赖 babel-preset-env。转义 ES7，依赖 babel-preset-stage-0。

其余略，看 webpack3 note。

#### 配置 webpack-dev-server

略。同 webpack3。

#### 热更新

略。和 webpack3 差不多。

#### 提取公共代码

如果我们配置了多个 entry，意味着会输出多个 bundle 的 js。比如：

    module.exports = {
      entry: [
        a: './src/a.js',
        b: './src/b.js'
      ]
    }

如果 a.js 和 b.js 都依赖了大量相同的 js，比如 c.js：

    // a.js 和 b.js 都依赖了 c.js
    import c from 'c.js'

那意味着在 bundle 出的 a.js 和 b.js 中包含了重复的 c.js。如果只有少量那还 OK，那如果重复的代码很多，这时候我们就要考虑把这些重复的 js 代码抽出来，bundle 到一个共同的 js 文件中了。

在 webpack3 中，这个工作由 CommonsChunkPlugin 来完成，在 webpack4 中，这个功能已经内置了，配置在 optimization 选项中。

    module.exports = {
      // 提取公共代码
      optimization: {
          splitChunks: {
              cacheGroups: {
                  vendor: {   // 抽离第三方插件
                      test: /node_modules/,   // 指定是 node_modules 下的第三方包
                      chunks: 'initial',
                      name: 'vendor',  // 打包后的文件名，任意命名
                      // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                      priority: 10
                  },
                  utils: { // 抽离自己写的公共代码，utils 这个名字可以随意起
                      chunks: 'initial',
                      name: 'utils',  // 任意命名
                      minSize: 0    // 只要超出 0 字节就生成一个新包
                  }
              }
          }
      },
      plugins: [
          new HtmlWebpackPlugin({
              filename: 'a.html',
              template: './src/index.html',  // 以 index.html 为模板
              chunks: ['vendor', 'a']
          }),
          new HtmlWebpackPlugin({
              filename: 'b.html',
              template: './src/index.html',  // 以 index.html 为模板
              chunks: ['vendor', 'b']
          })
      ]
    }

#### 指定 webpack 配置文件

    "scripts": {
      ...
      "vue": "webpack --config webapck.config.vue.js"
    }

DONE!
