# Geektime Webpack Course Note

- [极客时间 - 玩转 Webpack](https://time.geekbang.org/course/detail/190-97202)
- [课件和代码](https://github.com/geektime-geekbang/geektime-webpack-course)

## 第一章：webpack 与构建发展简史

略

## 第二章：基本用法

- entry
- output
- loaders
- plugins
- module

css / less / sass: loader 是从右到左执行，"style-loader", "css-loader"。style-loader 在 production 中要去掉，要用 min css 抽取成单独的 css。

图片和字体：file-loader，url-loader，后者依赖了前者，对前者的增强，可以设置在体积小于多少时转成 base64。

### 18. 文件监听

`--watch`

`watch: true , watchOptions: {...}`

缺陷，重新编译后浏览器不会自动刷新，需要手动刷新

原理：poll，对比文件的修改时间

### 19. 热更新 HMR

webpack-dev-server，内容都在内存中，不落盘

配置：`plugins: [ new webpack.HotModule... ]`

原理：浏览器端的 bundle js 中加上了额外的 HMR Runtime，和服务端间保持 websocket 连接，服务端监听到变化后通过 websocket 发送到浏览器端。

### 20.文件指纹：

hash, chunkhash, contenthash

js 用 chunkhash，css 用 contenthash

占位符：`[name][hash:8].[ext]`

不能和热更新一起用

webpack.dev.js / webpack.prod.js

使用 mini css，要把 style-laoder 去掉换成 MiniCss...loader

### 21. 压缩

html / js / css

js webpack 内置了 ungify

css: optimize .. cssnano

html: html-webpack-plugin

## 第三章：进阶

### 22. 自动清理 clean plugin

clean-webpack-plugin

### 23. postcss + autoprefix

postcss 是后置处理器，less-loader 是前置处理器。

postcss 的位置为啥可以放在 less-loader 后面呢... (可能放前放后对结果影响不大?)

### 24. px -> rem

移动端 px2rem-loader

### 25. 静态资源内联

用 raw-loader，可以内联 html，比如 meta.html，内联 js ...

css 内联：1. style-loader 2. html-inline-css-webpack-plugin

直接写在 html 中就行了，不需要在 webpack.config.js 中配置？

(raw-loader 还可以很方便地用来编译前端组件的文档，在组件下面显示组件的源码)

### 26. 多页面打包方案

动态获取 index.js，使用 glob 库

awesome!

### 27. source map

eval / cheap / inline ...

通过在 webpack.config.js 中 devtool 属性指定：eval, source-map, inline-source-map, cheap-source-map ...

方便调试，如果没有 source map ，代码出错时，定位到的是 bundle 后的代码，如果有 source map，定位到的是源码位置

### 28. 提取页面公共资源

例子：

1. react, react-dom，通过 cdn 引进，不打入 bundle，使用 html-webpack-externals-plugin (还需要自己手动在 html 中引入，execuse me?)

1. 使用 SplitChunksPlugin 进行公共脚本分离，内置

   chunks 参数说明：async (动态引入的库要进行分离), initial, all (推荐)

1. TreeShaking (摇树优化)

   从 rollup 借鉴，必须使用 es6 的写法，commonjs 写法不支持。只打包用到的代码。

   .bablerc 中设置 modules:false (??)

   production 默认支持

   none 默认不进行 treeshaking

DCE (dead code elimination)

不能有副作用，有副作用会失效？？（啥意思)

### 30. scope hositing

从 rollup 借鉴，只引用一次的，直接内联，减少包裹

prodution 默认开启

### 31. 代码分割和动态 import

es6，没有原生支持，需要 babel 插件

### 32. eslint

Airbnb: eslint-config-airbnb, eslint-config-airbnb-base

eslint:recommend

落地：

1. 和 ci/cd 集成： 添加 lint pipeline, precommit hooks: lint-staged
1. 和 webpack 集成: ['babel-loader', 'eslint-loader']

   ```js
   {
    parser:
    extends:
    rules:
    env: {
      node: true, // 使 node 的全局变量生效
      browser: true, // 使 window, document 等全局变量生效
    }
   }
   ```

### 33. 打包组件库

其实现在组件库没有必须打包成压缩了吧，毕竟最终都会在 bundle 的时候压缩...但转换 js 高级用法和 less/scss 转 css 还是需要的 (但像 antd 连 less 也还保留了呢)

```js
output: {
  library: ...
  libraryTarget: ...
  libraryExport: 'default'
}
```

如果是 'default' ，相当于 export default funtion add()，使用：import xxx from 'large-number', xxx()
否则则为 export function add(), 使用：import {add} from 'large-number', add()
或者 import xxx from 'large-number', xxx.add()

TerserPlugin，设置只对 min 进行压缩

### 34. SSR 上

了解即可，手工模式好麻烦，直接上 next.js

### 35. SSR 下

有意思了。如何处理样式。在服务端的模板，不要用自己的，而是用客户端 bundle 出来的，然后在客户端的模板中加入占位符，在服务端用 renderToString() 产生的内容替换掉占位符。

soga，原来如此！

数据，也是替换占位符一样的思路。

### 36. 优化命令行

stats 属性

FriendlyErrorsWebpackPlugin

### 37. 构建异常和中断处理

`echo \$?`

## 第四章：编写可维护的 webpack 构建配置 (9 讲)

### 38. 构建配置设计

构建配置抽成 npm 包

```
webpack.base.js
webpack.dev.js
webpack.prod.js
webpack.ssr.js
```

`const merge = require('webpack-merge')`

### 39. 功能模块设计和目录结构

分别实现 webpack.base.js dev.js prod.js ssr.js ...

### 40 | 使用 ESLint 规范构建脚本

elint --fix

### 41 | 冒烟测试介绍和实际运用

nice!

`webpack(config, callback)`

rimraf

### 42 | 单元测试和测试覆盖率

mocha + chai/assert

describe, it, expect

测试覆盖率，原理是啥？istanbul

### 43 | 持续集成和 Travis CI

可以跳过

### 44 | 发布构建包到 npm 社区

npm publish

开发工具可以源码发布到 npm，不需要 bundle。其实很多都不需要 bundle。

### 45 | Git Commit 规范和 changelog 生成

推荐直接使用 https://github.com/commitizen/cz-cli 每次 git cz 代替 git commit，会自动运行交互程序，填空，就能创建规范的 commit log 信息

validate-commit-msg 好像废弃了，推荐使用 commitlint

husky

### 46 | 语义化版本（Semantic Versioning）规范格式

x.y.z-alpha|beta|rc.m

- alpah - 测试人员使用
- beta - 发布，不断加新功能
- rc - release candidate，不再加新功能，除错

semver

## 第五章：webpack 构建速度和体积优化策略 (12 讲)

### 47 | 初级分析：使用 webpack 内置的 stats

stats

### 48 | 速度分析：使用 speed-measure-webpack-plugin

这个插件可以分析插件和 loader 的耗时

### 49 | 体积分析：使用 webpack-bundle-analyzer

### 50 | 使用高版本的 webpack 和 Node.js

降低构建时间

### 51 | 多进程/多实例构建

thread-loader / HappyPack / Parral...

### 52 | 多进程并行压缩代码

parallel-uglify-plugin

uglify-webpack-plugin

terser-webpack-plugin

### 53 | 进一步分包：预编译资源模块

DLLPlugin DLLReferencePlugin

将公共基础包打包成一个单独包

### 54 | 充分利用缓存提升二次构建速度

开启缓存，缓存持久化

(试一试，改善 tidb-dashboard 构建速度)

### 55 | 缩小构建目标

exclude node_modules

resolve / alias

### 56 | 使用 Tree Shaking 擦除无用的 JavaScript 和 CSS

purifycss

purgecss-webpack-plugin

### 57 | 使用 webpack 进行图片压缩

image-webpack-loader

### 58 | 使用动态 Polyfill 服务

interesting!

根据 user agent，返回不同的 polyfill

这一章实用的并不多，缓存那个可以试试

## 第六章：通过源代码掌握 webpack 打包原理 (9 讲)

### 59 | webpack 启动过程分析

`node_modules/.bin/webpack` 是个软链接，指向 `node_modules/webpack/bin/webpack.js` package.json 中有 bin 字段
(webpack_cli 呢... 啥关系 这玩意又没有了... webpack-cli 好像变成了管理配置的工具)

我怎么没找到 webpack-cli 和 webpack-command 呢

(cra, umi 这些工具不依赖 webpack-cli，直接使用 webpack() 函数)

require

require.resolve()

### 60 | webpack-cli 源码阅读

yargs

webpack.config.js 中的大部分配置都可以用参数表示

webpack-cli 专门用来解析这些参数，汇总成最终的 options，然后调用 webpack()

```js
const webpack = require('webpack')
const compiler = webpack(options)
```

这一章讲得挺好的。

### 61 | Tapable 插件架构与 Hooks 设计

Compiler / Tapable

Compilation

Tapable: 控制钩子函数的发布和订阅，控制 webpack 的插件系统

演示了 tapable 和各种 hooks 的使用

所以，各插件就是要定义自己的 hook 类型？非也，webpack 内部已经定义了一百多个 hooks，各插件选取合适的 hook 进行监听。

### 62 | Tapable 是如何和 webpack 进行关联起来的？

plugin.apply(compiler)

plugin 监听 compiler 的各种 hook 事件，然后执行相应逻辑。

compiler 执行各个 hook，插件订阅各种 hook

```js
class MyPlugin {
  constructor() {}
  apply(compiler) {
    compiler.hooks.brake.tap('WarningLampPlugin', () =>
      console.log('WarningLampPlugin')
    )
    compiler.hooks.accelerate.tap('LoggerPlugin', (newSpeed) =>
      console.log(`Accelerating to ${newSpeed}`)
    )
    compiler.hooks.calculateRoutes.tapPromise(
      'calculateRoutes tapAsync',
      (source, target, routesList) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`tapPromise to ${source} ${target} ${routesList}`)
            resolve()
          }, 1000)
        })
      }
    )
  }
}
```

compiler.hooks.brake.tap() 就是订阅，或者说注册监听器

### 63 | webpack 流程篇：准备阶段

WebpackOptionsApply，将配置的参数转换成 webpack 内部插件

(webpack 库本身没有 bundle，因为不需要，它是 dev dependency

cjs: module.exports / require

有点割裂，打包工具有 cjs，前端代码本身用 esm)

其它库可以不用 bundle，但为啥还是 bundle 呢，因为如果你用 less，es7 等高级用法，不 bundle 转换 css 和 es5，有些应用用了 sass 或需要兼容更低版本 browser，就用不了你的库。

webpack 还真是有点复杂

将 plugins 挂载到 compilation 上

### 64 | webpack 流程篇：模块构建和 chunk 生成阶段

parser: acron

### 65 | webpack 流程篇：文件生成

emit

### 66 | 动手编写一个简易的 webpack(上)

模块化：esm cjs amd

`import * as Xxx from 'xxx'`

(和 export default 有冲突吗，待验证)

AST:

esprima.org/demo/parse.html

### 67 | 动手编写一个简易的 webpack(下)

babylon

require('xxx').default

cjs 也有 defautl ??

```
getAST
getDepedencies
transform
```

有点牛！

path / fs

awesome!

## 第七章：编写 loader 和插件 (7 讲)

### 68 | loader 的链式调用与执行顺序

path.resolve()

为何从右往左，Compose 模式

webpack-cli genernate-loader

### 69 | 使用 loader-runner 高效进行 loader 的调试

不安装 webpack 调试 loader

raw-loader

### 70 | 更复杂的 loader 的开发场

load-utils

getOptions() 获取参数

异步 loader

loader 缓存

file-loader

### 71 | 实战开发一个自动合成雪碧图的 loader

sprite 雪碧图的合成

像这类工具，只会在 node 中使用，就只用 cjs 就可以，而且完全不需要 bundle，源码发布到 npm 就行

### 72 | 插件基本结构介绍

loader 没法做的事可以交给 plugin 做

主要逻辑：监听 hook，在回调中执行相应逻辑

实现 apply(compiler) 方法

### 73 | 更复杂的插件开发场景

插件的插件...

插件暴露 hook

### 74 | 实战开发一个压缩构建资源为 zip 包的插件

JSZip()

emit hook

## 第八章：React 全家桶和 webpack 开发商城项目 (10 讲)

这一章其实跟 webpack 没啥关系，有点多余了

### 75 | 商城技术栈选型和整体架构

多页架构

### 76 | 商城界面 UI 设计与模块拆分

后台拆分：拆成各种服务，service

### 77 | React 全家桶环境搭建

react + redux ...

### 78 | 数据库实体和表结构设计

### 79 | 登录注册模块开发

jwt

### 80 | 商品模块开发

### 81 | 订单模块开发

### 82 | 谈谈 Web 商城的性能优化策略

### 83 | 功能开发总结

### 84 | 结束语

多页面！
