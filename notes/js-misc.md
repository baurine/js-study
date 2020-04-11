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
