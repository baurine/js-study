# JavaScript Misc

- audio

## audio

safari/chrome/firefox 上 audio 的播放行为不太一致。change currentTime 就是其中之一。

chrome/firefox 中允许在 audio element load 后马上对 audio element 设置 currentTime，但在 safari 上不行，这种操作无效。

    loadSrc = () => {
      const { audioInfo, progress } = this.state
      if (audioInfo && audioInfo.src) {
        this.audioElement.src = audioInfo.src
        this.audioElement.load()

        const jumpTo = progress || audioInfo.startProgress
        if (jumpTo > 0) {
          this.audioElement.currentTime = jumpTo
        }

        this.startPlay &&
        this.audioElement.play().catch(this.handlePlayError)
      }
    }

这段代码在 chrome/firefox 上是工作正常的，即可以从上次记录的播放位置继续播放。

但在 safari 上，load() 之后直接改变 currentTime 是无效的，每次都从头开始播放。

于是改成在 canplay 回调中去改变 currentTime。

    onCanPlay = () => {
      console.log('can play')
      ...
      this.audioElement.currentTime = jumpTo
      this.audioElement.playbackRate = this.state.playbackRate
    }

如此修改以后，在 safari 上工作正常了，但发现在 chrome/firefox 上不行了，原来在 chrome/firefox 上修改 currentTime 后，会重新触发 canplay 回调，因此造成了死循环，但在 safari 上 change currentTime 不会触发 canplay 回调...

最后的修改方法是，把 change currentTime 的操作放到 loadeddata 中回调中，这样，在三者上都工作正常了。

      this.audioElement.addEventListener('loadeddata', this.onLoadData)

      onLoadData = () => {
        console.log('load data')
        ...
        this.audioElement.currentTime = jumpTo
      }

一个示例：https://jsfiddle.net/Richard_Liu/cvkxehz6/

## CJS / AMD / UMD / ESM

- [What are CJS, AMD, UMD, and ESM in Javascript?](https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm)
- [《模块化系列》彻底理清 CommonJS, AMD, CMD, UMD, ES Modules](https://juejin.im/post/5e4963f451882548fd305644)
- [packing example](https://github.com/hua1995116/packaging-example)
- [AMD, CMD, CommonJS, ES Module, UMD](https://juejin.im/post/5b7d2f45e51d4538826f4c28)
- [JS 模块化 —— CommonJS AMD CMD UMD ES6 Module 比较](https://juejin.im/post/5d9feafdf265da5b794f1d89)

一开始，js 并没有原生的模块管理，默认是全局的，所以后面诞生了各种第三方的模块管理方案。

### CJS - CommonJS

即 CommonJS，Node 使用 cjs 语法。语法：

```js
//exporting
module.exports = function doSomething(n) {
  // do something
}

//importing
const doSomething = require('./doSomething.js')
```

cjs 导入模块是同步的。(因为它用于后端，所有模块都在服务器本地，所以在后端使用同步导入是完全没有问题的，但如果在浏览器中使用同步导入就不太合适。)

可以从相对目录导入，也可以从 node_modules 目录中导入，像这样：`const React = require('react')`。

cjs 不能直接工作于浏览览器，但可以在源码中使用，然后用 babel/webpack 这些工具进行编译，bundle 出来的代码就没有 cjs 语法了。

### AMD - Asynchronous Module Definition

示例：

```js
define(['dep1', 'dep2'], function (dep1, dep2) {
  //Define the module value by returning a value.
  return function () {}
})

// or
// "simplified CommonJS wrapping" https://requirejs.org/docs/whyamd.html
define(function (require) {
  var dep1 = require('dep1'),
    dep2 = require('dep2')
  return function () {}
})
```

AMD 导入模块是异步的。

AMD 是为前端而设计的，而 CJS 是用于后端 (Node)。

AMD 是规范，它的最佳实践者是 RequireJS。

示例，假设目录下有 index.html, model1.js, model2.js, main.js 四个文件。

```js
// model1.js
define(function () {
    console.log('model1 entry');
    return {
        getHello: function () {
            return 'model1';
        }
    };
});
// model2.js
define(function () {
    console.log('model2 entry');
    return {
        getHello: function () {
            return 'model2';
        }
    };
});
// main.js
define(function (require) {
    var model1 = require('./model1');
    console.log(model1.getHello());
    var model2 = require('./model2');
    console.log(model2.getHello());
});
// index.html
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>
```

`requirejs(['main])` 这句语句，它是异步去服务器加载 main.js，main.js 又会去加载 model1.js 和 model2.js。

### CMD - Common Module Definition

Sea.js 提出的规范，现在已经没啥人用了，简单了解。一个文件就是一个模块，可以像 Node.js 一般书写模块代码。主要在浏览器中运行，当然也可以在 Node.js 中运行。使用方法和 AMD 类似，但写法更接近 CommonJS。

### UMD - Universal Module Definition

该模式主要用来解决 CommonJS 模式和 AMD 模式代码不能通用的问题，并同时还支持老式的全局变量规范。

示例：

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function ($, _) {
    // this is where I defined my module implementation

    var Requester = { // ... };

    return Requester;
}));
```

(不懂...)

UMD 可以同时工作于前端和后端 (正如其名 universal)。

UMD 更像是用来兼容多种模块的系统...(比如一个库只有 AMD 版本，我又想在后端用，或者一个库只有 CJS 版本，我又想在前端用，就可以用这个包装一下？)

### ESM - ES Modules

ES6 自带的原生模块管理，一开始仅用于前端，Node 并不兼容，现在 Node 也开始逐渐使用这种模块管理。

示例：

```js
import React from 'react';

import {foo, bar} from './myLib';

...

export default function() {
  // your Function
};
export const function1() {...};
export const function2() {...};
```

ESM 可以用于现代浏览器，兼有 CJS 简单的语法和 AMD 异步导入的优点。

Tree-shakeable。

ESM 允许像 Rollup 这种 bundler 移除不必要的代码。

可以在 HTML 中直接使用，像这样：

```html
<script type="module">
  import { func1 } from 'my-lib'

  func1()
</script>
```

关于 TreeShake，对于 CommonJS 来说，导入一个模块只有一种语法，必须将整个模块导入：

```js
// import the entire utils object with CommonJS
const utils = require('./utils')
const query = 'Rollup'
// use the ajax method of the utils object
utils.ajax(`https://api.example.com?search=${query}`).then(handleResponse)
```

但实际我只用到了 utils 中的 ajax 部分，而 ESM 则可以只导入这一部分：

```js
// import the ajax function with an ES6 import statement
import { ajax } from './utils'
const query = 'Rollup'
// call the ajax function
ajax(`https://api.example.com?search=${query}`).then(handleResponse)
```

所以如果你写一个库，如果这个库你只准备用于后端，那可以只编译成 CJS 或 UMD，如果只准备用于前端，则可以只编译成 AMD / ESM / UMD。如果前后端都可以用，则可以全部编译。

在使用端，如果你用 `requier(...)` 的语法去导入模块，则会去找模块的 CJS 版本，如果用 `import ... from ...` 的语法去导入模块，则会去找模块的 ESM 版本。

## CommonJS vs ESM

### CommonJS

- [CommonJS 规范](https://javascript.ruanyifeng.com/nodejs/module.html)
- [require() 源码解读](http://www.ruanyifeng.com/blog/2015/05/require.html)

CommonJS 不支持 TreeShaking，require() 时全部导入，且是同步加载，所以只适合后端。

> CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

```js
var x = 5
var addX = function (value) {
  return value + x
}
module.exports.x = x
module.exports.addX = addX
```

使用 require 加载：

```js
var example = require('./example.js')

console.log(example.x) // 5
console.log(example.addX(1)) // 6
```

module 对象：Node 内部提供一个 Module 构建函数。所有模块都是 Module 的实例。

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  // ...
}
```

每个模块内部，都有一个 module 对象，代表当前模块。它有以下属性。

- module.id 模块的识别符，通常是带有绝对路径的模块文件名。
- module.filename 模块的文件名，带有绝对路径。
- module.loaded 返回一个布尔值，表示模块是否已经完成加载。
- module.parent 返回一个对象，表示调用该模块的模块。
- module.children 返回一个数组，表示该模块要用到的其他模块。
- module.exports 表示模块对外输出的值。

exports 变量：为了方便，Node 为每个模块提供一个 exports 变量，指向 module.exports。这等同在每个模块头部，有一行这样的命令。

```js
var exports = module.exports
```

造成的结果是，在对外输出模块接口时，可以向 exports 对象添加方法。

```js
exports.area = function (r) {
  return Math.PI * r * r
}

exports.circumference = function (r) {
  return 2 * Math.PI * r
}
```

> 不能直接将 exports 变量指向一个值，因为这样等于切断了 exports 与 module.exports 的联系。

> 如果你觉得，exports 与 module.exports 之间的区别很难分清，一个简单的处理方法，就是放弃使用 exports，只使用 module.exports。

require：读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。

如果想得到 require 命令加载的确切文件名，使用 require.resolve(fileName)方法。

目录加载规则：如果此目录有 package.json 且有 main 字段，则从 main 字段指定的文件加载，否则从该目录下的 index.js 加载。

删除缓存：`delete require.cache[moduleName]`

CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

所以，CommonJS 中一个模块导出一个变量是没有意义的，一般是导出常量或方法。

(相比之下，ESM 导出的变量是引用，一处修改，全局改变。)

require 的内部处理流程。它其实不是一个全局命令，而是指向当前模块的 module.require 命令，后者又调用了 Node 的内部命令 `Module._load`。

```js
Module._load = function (request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
}

Module.prototype._compile = function (content, filename) {
  // 1. 生成一个require函数，指向module.require
  // 2. 加载其他辅助方法到require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
}
```

一旦 require 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。

```js
;(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE INJECTED HERE!
})
```

(咦，所以 CommonJS 实际也是 bundle 了，只不过 bundle 在内存中，没有落盘而已...)

require.resolve() 可以用来简化 `path.join(__dirname, xxx)`，示例：

```js
fs.readFileSync(path.join(__dirname, './assets/some-file.txt'))
fs.readFileSync(require.resolve('./assets/some-file.txt'))
```

还看到个 require.context()，这个又是干哈的...这个跟 CommonJS 的 module 没关系，这个是 webpack 加的方法。

- [webpack 中 require.context 的作用](https://zhuanlan.zhihu.com/p/59564277)
- [webpack 中 require.context 的使用](https://segmentfault.com/a/1190000017160862)

用来辅助实现批量 import。

### ESM

相比 CommonJS 只有 module.exports 和 require() 固定的用法，ESM 的 export/import 就灵活的有点过了...

示例：

```js
export default function xxx() {}
export default const A_CONST = 'xxx'
export function xxx() {}
export const A_CONST = 'xxx'

function xxx() {}
export {xxx}
export {xxx as yyy}

export * from './Toolbar' // 这种 export 无法导出 './Toolbar' 中的 default，对吧
export { default as Toolbar } from './Toolbar' // 需要还需要这行辅助一下

import React from 'react'
import * as React from 'react' // 这个怎么理解？
import {useEffect} from 'react'
import {xxx as yyy} from './x.js'
// ...
```

头大。

- [JavaScript modules 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

导出时，只能导出一个 default export，但可以导出多个 named exports。

default export 可以匿名，import 时可以取任意名字。示例：

```js
// square.js
export default function(ctx) {
  ...
}

// main.js
import randomSquare from './modules/square.js';
// 相当于
import {default as randomSquare} from './modules/square.js'
// 所以 default 相当于一个默认的 named export? 懂了
```

但 named exports 是具名的，import 时名字必须和 export 时相同，但可以用 as 在 export 或 import 时重命名。

创建模块对象：

```js
import * as Module from '/modules/module.js'
```

这将获取 module.js 中所有可用的导出，并使它们可以作为对象模块的成员使用，从而有效地为其提供自己的命名空间。

(包括 default 导出吗？如果包括的话，那么是通过 Module.default 来访问？试验一下。)

经验证，确实如此，Module 对象中会有 default 属性，它的值就是 module.js 中的 default export。

```js
// module.js
export default function foo() {
  console.log('foo')
}

export function bar() {
  console.log('bar')
}

export const hello = 'hello'

// main.js
import * as Module from './module.js'

console.log(Module)
// {
//   default: f foo()
//   bar: f bar()
//   hello: 'hello'
// }

Module.default() // 输出 foo
```

合并模块：

```js
export * from 'x.mjs'
export { name } from 'x.mjs'
export * from 'y.mjs'
// 可以推测出 default 肯定是会被 ignore 掉，不然若是从 x.mjs 和 y.mjs 导出的 default 都生效，那当前模块用哪一个 default 呢
// 况且，export default 时要取名字，而 `export * from 'x.mjs'` 没有名字啊
// 所以，可以推断出这个导出形多会 ignore 掉 default
// 那如何使 x.mjs 和 y.mjs 的 default 也导出呢，可以像下面这样：
export { default as X } from 'x.mjs'
export { default as Y } from 'y.mjs'
// 当然，前提是 x.mjs 和 y.mjs 中有 default export
```

这样一整理就清楚多了。
