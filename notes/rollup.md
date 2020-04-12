# Rollup 使用

- [Rollup](https://rollupjs.org/)
- [Rollup.js 实战学习笔记](https://chenshenhai.github.io/rollupjs-note/)

Rollup 只允许你的源代码使用 ES6 的模块管理系统 (即 ESM)，即 export 和 import (以方便地实现 TreeShaking?)，但它在 bundle 输出的时候，可以转译成 ESM / CommonJS / UMD / AMD 等任意模块系统，以支持你的代码在前后端都可以使用。

所以如果你的项目需要依赖一个只有 CommonJS 格式的库，比如 date-fn，你不能在项目中通过 `require('date-fn')` 来使用它，Rollup 不支持，你需要 `@rollup/plugin-commonjs` 这个 plugin 来支持在项目中使用 `import` 的语法来使用这个库，比如 `import format from 'date-fn/format'`。(现在还有只有 CommonJS 格式的库？刚看了一下 date-fn，已经支持生成 ESM 的库了)

在 package.json 的 main 字段指定 bundle 成 CommonJS 的输出文件，在 module 字段指定 bundle 成 ESM 的输出文件，这样，你的库在别的项目使用时，如果在 Node.js 中使用，它就会去找 main 字段对应的文件，如果在前端项目中使用，使用 webpack 或 rollup，就会去找 module 字段对应的文件。

## Tutorial

plugins:

- @rollup/plugin-node-resolve: 几乎是必须的，使用这个插件才能使用 node_modules 里的第三方库
- @rollup/plugin-commonjs: node_modules 里有一些库可能只有 CommonJS 格式
- @rollup/plugin-json: 允许在 js 代码中从 json 文件中 import。(ts 有自己的配置，在 tsconfig.json 中)
- rollup-plugin-terser: 用来 minify bundle

## Integrating Rollup With Other Tools

### With NPM Packages

@rollup/plugin-node-resolve, @rollup/plugin-commonjs

> Note that @rollup/plugin-commonjs should go **before** other plugins that transform your modules — this is to prevent other plugins from making changes that break the CommonJS detection.

(但看了一些例子，commonjs 都放在最后了呢...待更多验证)

### Peer dependencies

在 rollup.config.js 中使用 external 字段。比如 `external: ['lodash']`

### Babel

需要 rollup-plugin-babel plugin，需且 .babelrc 的设置有点特殊。

详略。(因为目前都用 ts 了)
