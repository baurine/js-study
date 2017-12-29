# Node Beginner

## Resource

- [Node Beginner](https://www.nodebeginner.org/index-zh-cn.html)

## Note

[code 实现](../code/node-primer)

其实并不是 Node 入门，而是用 Node 开发 Web 入门，但 Node 并不完全是用来做 Web 的呀。

Node 是一个 JavaScript 的运行时环境，使 JavaScript 可以脱离浏览器环境运行，同时它也是一个库 (提供了很多模块，比如 http，fs ...)。

本教程实现了一个简单的表单上传图片并显示的例子。(通过这个例子，也能大致明白 express 的工作原理。)

从本教程进一步学习到了注入的思想。

### 注入思想

本教程的例子，包含三个模块：server、router、request-handlers。在 server 中调用 router，在 router 中调用 handlers。一般的实现，我们会直接在 server 中 require router 模块，在 router 模块中 require handlers 模块，这样导致的后果就是相当于 server 模块依赖了 router 模块，router 模块依赖了 handlers 模块。如果哪天我想用一个新的 router 模块替换掉原来的 router 模块，我就不得不深入到 server 模块中去修改代码。

本例中采用了注入的思想，来使 server、router、handlers 三个模块之间没有任何依赖，它们之间是完全独立的，即使是 router 和 handlers 之间有着极强的映射关系 (每个 route 对应哪个 handler)。

来看看是怎么实现的，通过在 index.js 中一次性 require 所有模块，然后将 router 和 handlers 作为 server 中的方法的参数。router 和 handlers 之间的映射关系也是 index.js 中完成。可谓是机智。

    var server = require('./server')
    var router = require('./router')
    var requestHandlers = require('./request-handlers')

    var handle = {}
    handle['/'] = requestHandlers.start
    handle['/start'] = requestHandlers.start
    handle['/upload'] = requestHandlers.upload
    handle['/show'] = requestHandlers.show

    server.start(router.route, handle)

### Node 中的 require 和 exports

Node 支持模块管理。(但和 ES6 的模块管理不同。)

在一个文件中，可以把需要导出的任意对象存储到 module.exports 这个对象中。然后在其它文件中通过 require('xxx') 来导入这个 exports 对象，然后就可以访问这个 exports 对象中的任意子对象了。

module.exports 有两种使用方法：

    // a.js
    function funA() = {...}
    function funB() = {...}

    exports.funA = funA
    exports.funB = funB

    // 或者
    // 注意，这种情况下，必须加 `module.` 前缀，不能直接 exports = {...}
    module.exports = {
      funA: funA,
      funB: funB
    }

    // b.js
    var modA = require('./a')
    // 此时，modA 等于 a 模块中的 exports 对象
    // 即 modA = { funA: funA, funB: funB }
    modA.funA()
    modA.funB()

### Node 的非阻塞

Node 是单线程工作，不能在线程中同步执行耗时操作，否则会阻塞其它操作，所有耗时操作都要通过异步执行，通过回调接收结果。

### 常用模块

- 内置模块
  - http：http server
  - fs：文件系统

    `fs.readFile()`

  - url：解析 url
  
    `url.parse(req.url).pathname`

    `url.parse(req.url).query`

  - querystring：解析 url 中的查询参数，或 post data 的 key value

    `querystring.parse(query).text`

    `querystring.parse(postData).text`

  - child_process：执行外部 shell 命令
  
    `require('child_process').exec('ls -lah', function() {...})`

- 第三方
  - formidable：处理 form，处理文件上传

### 其它

1. `<image>`

   `<image>` 元素中的 src 属性，不仅可以是一个静态图片的地址，还可以是一个动态请求。本例中，上传图片后，在 `/upload` handler 中，只是把图片移动到 `/tmp/test.png`，然后返回一个 `<image src='/show'>` 的元素，在 `/show` 的 handler 中，再返回 `/tmp/test.png` 的二进制内容。这样做的好处，一是可以隐藏图片的真实地址，二是可以随时运态替换掉这个图片而无需修改代码。
