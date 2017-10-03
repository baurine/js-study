# Node.js 开发指南笔记

Resource：

- BYVoid - *Node.js 开发指南*

## 第 1 章 - Node.js 简介

略。讲了 Node.js 和 JavaScript 的发展历史，简单了解即可。

## 第 2 章 - 安装和配置 Node.js

略。Node.js、npm、多版本管理 nvm。

## 第 3 章 - Node.js 快速入门

### 3.1 开始用 Node.js 编程

Node 命令行工具、REPL 模式。

建立 HTTP 服务。

使用 supervisor，监控文件变化，自动重启 node。

    $ sudo npm install -g supervisor
    $ supervisor app.js

### 3.2 异步式 I/O 与事件式编程

有一点要理解，当一个程序运行时，并不是只有 CPU 在执行指令，还有各个 I/O 设备，比如硬盘，网络。当 CPU 给 I/O 设备发送了指令后，I/O 设备就自己独立工作了，CPU 或是空等，或是继续执行其它指令。

- 如果 CPU 给 I/O 设备发送指令后，等待 I/O 设备执行结束后返回结果，再继续执行后面的指令，这种模式称为同步 I/O 或是阻塞式 I/O。当 CPU 处于等待时，CPU 处于空闲状态。
- 如果 CPU 给 I/O 设备发送指令后，不等 I/O 设备执行结束就继续执行后面的指令，当 I/O 设备执行结束后会通过中断通知 CPU，CPU 再回过头来执行之前的逻辑。这种模式称为异步 I/O 或非阻塞式 I/O。这种模式能够充分使用 CPU，使用率可以一直是 100%。

一个程序如果主要是 CPU 在工作，那么这种程序称为计算密集型程序，比如各种算法，压缩图片等，如果大部分是 I/O 操作，比如操作文件，网络，那么这种程序称为 I/O 密集型程序，各种 Web 程序都可以算是 I/O 密集型程序。

大部分传统的 Web 程序，如 PHP、Ruyb、Java 都是同步 I/O，使用多线程来支持并发。而 Node 是异步 I/O，单线程就是支持并发。

**3.2.3 事件**

EventEmitter。(不就是一个 EventBus 吗?)

    // event.js
    var EventEmitter = require('events').EventEmitter
    var event = new EventEmitter()

    // 相当于注册监听器
    event.on('some_event', function() {
      console.log('some_event occured.)
    })

    // 发射事件
    setTimeout(function() {
      event.emit('some_event')
    }, 1000)

Node.js 的事件循环机制。

### 3.3 模块和包

对模块的使用的一个补充。除了可以把需要导出的对象内嵌在 exports 对象中，还可以将这个要导出的对象直接赋值给 exports。

    // hello.js
    function Hello() {
      var name
      this.setName = function() {...}
      this.sayHello = function() {...}
    }

    module.exports = Hello

    // getHello.js
    var Hello = require('./hello')

    var hello = new Hello()
    hello.setName('hehe')
    hello.sayHello()

如果将 Hello 内嵌到 module.exports 中，就显得麻烦了，如下所示：

    // hello.js
    exports.Hello = Hello

    // gethello.js
    var Hello = require('./hello').Hello

**3.3.3 创建包**

Node.js 的包是一个目录，在根目录下需要一个说明文件 package.json。

一般的规范：

- package.json 在顶层目录下
- 二进制代码在 bin 目录下
- JavaScript 代码在 lib 目录下
- 文档在 doc 目录下
- 测试在 test 目录下

默认入口在根目录下的 index.js，但是如果在 package.json 中的 "main" 属性指定了新的入口，则使用 package.json 中的配置。比如：

    // package.json
    {
      "main": "./lib/interface.js"
    }

**3.3.4 Node.js 包管理器**

npm 的使用。

安装包：

    npm [install/i] package_name

全局安装：

    npm [install/i] -g package_name

在全局和本地模式之间创建链接：

    npm link package_name

包的发布，略。

### 3.4 调试

远程调试。用调试模式启动程序，然后可以在另一个终端或浏览器中远程访问并调试。

以调试模式启动程序：

    node --debug[=port] app.js
    node --debug-brk[=port] app.js

默认端口 5858，两个命令的区别，前者正常执行脚本，后者会暂停执行脚本，等待客户端连接。

调试端。在另一个终端：

    node debug 127.0.0.1:5858
    > debug n
    ...
    > debug

在浏览器中 (Chrome)。先要安装 node-inspector 模式，然后启动 node-inspector，在浏览器中访问 `http://127.0.0.1:8080/debug?port=5858`。

    $ sudo npm install -g node-inspector
    $ node-inspector

## 第 4 章 - Node.js 核心模块

- 全局对象 global
- 常用工具 util
- 事件机制 events
- 文件系统 fs
- HTTP 服务器与客户端

### 4.1 全局对象

在浏览器中，window 是全局对象，在 Node 中，global 是全局对象，所有全局变量 (除了 global 本身) 都是 global 对象的属性。

global 最根本的作用是作为全局变量的宿主。当定义一个变量，没有用 `var` 声明时，定义的就是全局变量。

    // 本地变量
    var local_var = 'local_var'

    // 全局变量
    g_var = 'g_var'
    g_var  // => 'g_var'
    global.g_var  // => 'g_var'

在 Node.js 中能够直接访问到的对象通常都是 global 的属性，如 console、process。

**4.1.2 process**

process 是一个全局变量，它用于描述当前 Node.js 进程状态，提供了一个与操作系统的简单接口。写命令行工具的时候，免不了和它打交道。

1. process.argv - 命令行参数数组，第一个元素是 node，第二个是脚本文件名，从第三个开始是参数
1. process.stdout - 标准输出流
1. process.stdin - 标准输入流
1. process.nextTick(callback) - 如果一个任务要执行很长时间，那么要把它拆分成多次执行，以免阻塞其它操作。等效于 `setTimeout(fn, 0)`，但比它效率高。
1. process.platform, process.pid, process.execPath, process.memoryUsage ...

**4.1.3 console**

- console.log()
- console.error()
- console.trace()

console.log() 接受一个参数，或多个参数。和 c 中的 printf() 一样的用法，printf() 接受变参。

    console.log('hello world')
    console.log('hello %s', 'world')

呃，但是，现在 console.log 也能这么用啊：

    > console.log('Log:', 'hello', 'world')
    Log: hello world

自动在参数之间加上了空格。

### 4.2 常用工具 util

- util.inherits(constructor, superConstructor) - 实现继承
- util.inspect(obj, [showHidden], [depth], [colors]) - 将对象转成字符串
- util.isArray, util.isRegExp, util.isDate, util.isError - 感觉没什么用，就是对 typeof 的封装嘛

### 4.3 事件驱动 events

events 是 Node.js 最重要的模块，没有 "之一"，原因是 Node.js 本身架构就是事件式的，而它提供了唯一的接口。events 模式不仅用于用户代码与 Node.js 下层事件循环的交互，还几乎被所有模块所依赖。

**4.3.1 事件发射器**

events 模块只提供了一个对象：events.EventEmitter，EventEmitter 的核心就是事件发射和事件监听器功能的封装。

常用 API：

- EventEmitter.on(event, listener)
- EventEmitter.once(event, listener) - 只监听一次，触发后立即移除此监听器
- EventEmitter.removeListener(event, listener)
- EventEmitter.removeAllListeners([event])
- EventEmitter.emit(event, [arg1], [arg2], ...)

**4.3.2 error 事件**

EventEmitter 定义了一个特殊的事件 error，遇到异常时通常会发射 error 事件。如果上层没有响应的监听器，就是触发异常。

**4.3.3 继承 EventEmitter**

大多数时候我们不会直接使用 EventEmitter，而是在对象中继承它，包括 fs、net、http 在内，只要是支持事件响应的核心模块都是 EventEmitter 的子类。

### 4.4 文件系统 fs

fs 模块是文件操作的封装，它提供了文件的读取、写入、更名、删除、遍历目录、链接等 POSIX 文件系统的操作。

- fs.readFile(filename, [encoding], [callback(err, data)]) - 读取文件，如果指定了 encoding，读取回来的数据是字符串，否则是以 Buffer 形式表示的二进制数据。
- fs.open(path, flags, [mode], [callback(err, fd)]) - 对 POSIX open 函数的封装。
- fs.read(...) - 对 POSIX read 函数的封装。
- fs.write, fs.close ...

### 4.5 HTTP 服务器与客户端

Node.js 标准库提供了 http 模块，其中封装了一个高效的 HTTP 服务器和一个简易的 HTTP 客户端。

- http.Server - 服务器
- http.request - 客户端，用于向 HTTP 服务器发起请求

自带的 HTTP 客户端平时用的比较少，因为太多替代品了，比如 fetch。

**4.5.1 HTTP 服务器**

http.Server 对象。

一个最常见的示例代码：

    // app.js
    var http = require('http')

    http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write('<p>Hello World</p>')
      res.end(0)
    }).listen(3000)

http.createServer() 返回一个 http.Server 实例对象。

http.Server 是一个基本事件的 HTTP 服务器，所有的请求都被封装成为独立的事件。继承自 EventEmitter，提供了以下几件事件：

- request - 当客户端请求到来时，该事件被触发，提供两个参数 req 和 res，分别是 http.ServerRequest 和 http.ServerResponse 的实例，表示请求和响应信息。
- connection - 当 TCP 建立连接时触发，提供一个参数 socket，为 net.Socket 的实例。这个事件比 request 事件更底层。
- close - 当服务器被关闭时触发，注意不是在用户连接断开时触发。

无疑 request 是最常用的，因此 http 提供了一个捷径：http.createServer([requestListener])。事实上，上面的代码是下面代码的简写：

    // app.js
    var http = require('http')

    var server = new http.Server()
    server.on('request', function(req, res) {
      // ...
    })
    server.listen(3000)

**http.ServerRequest**

http.ServerRequest 也是 EventEmitter 的子类。提供 3 个事件：

- data - 当请求数据到来时触发，提供一个参数 chunk
- end - 当请求数据完成时触发
- close - 用户请求结束时触发

常用属性：

- method - 请求方法 GET / POST / DELETE ...
- url - 原始的完整请求路径，如 /static/image/x.jpg 或 /user?name=xxx
- headers - HTTP 请求头

**获取 GET 请求内容**

使用 url 模块中的 parse(url, [parseQueryString]) 函数来手动解析。如果第二个参数为 true，那么会用 querystring 模块的 parse 函数将 query 部分从字符串解析成对象。

    > var a_url = 'http://localhost:3000/user?name=byvoid&email=byvoid@byvoid.com'
    > url.parse(a_url)
    Url {
      protocol: 'http:',
      slashes: true,
      auth: null,
      host: 'localhost:3000',
      port: '3000',
      hostname: 'localhost',
      hash: null,
      search: '?name=byvoid&email=byvoid@byvoid.com',
      query: 'name=byvoid&email=byvoid@byvoid.com',
      pathname: '/user',
      path: '/user?name=byvoid&email=byvoid@byvoid.com',
      href: 'http://localhost:3000/user?name=byvoid&email=byvoid@byvoid.com' }
    > url.parse(a_url, true)
    Url {
      ...
      query: { name: 'byvoid', email: 'byvoid@byvoid.com' },
      ...
      href: 'http://localhost:3000/user?name=byvoid&email=byvoid@byvoid.com' }

**获取 POST 请求内容**

Node.js 默认没有解析 POST 请求的 body，需要自己手动解析。(实际项目中我们肯定是用一些模块来帮我们做的。)

示例代码：

    // app.js
    var http = require('http'),
        querystring = require('querystring'),
        util = require('util')

    http.createServer(function(req, res) {
      var post = ''

      req.on('data', function(chunk) {
        post += chunk
      })

      req.on('end', function() {
        post = querystring.parse(post)
        res.end(util.inspect(post))
      })
    })

**http.ServerResponse**

三个重要函数，用于返回响应头、响应 body、结束请求。

- res.writeHead(statusCode, [headers]) - 填充响应头，在一个请求中最多只能调用一次，如果不调用，则会自动生成一个响应头。
- res.write(data, [encoding]) - 填充响应 body，可以调用多次。
- res.end(data, [endcoding]) - 结束响应。

**4.5.2 HTTP 客户端**

简单了解。http 模块提供了两个函数：http.request 和 http.get，功能是作为客户端向 HTTP 服务器发起请求。

- http.request(options, callback) - options 是一个对象，包括以下属性：
  - host
  - port
  - method
  - path: 完整路径，比如 '/search?query=xxx'，默认是 '/'
  - headers：请求头对象

callback 的参数为 http.ClientReponse 的实例。http.request 返回一个 http.ClientRequest 的实例。注意，http.request 执行后只是得到了一个 http.ClientRequest 的实例对象，请求并没有发出去，你还需要手动在这个对象上执行 write() 和 end() 才会将请求发出去。

示例代码，暂略，因为我想我们应该并不会使用它。

http.get(options, callback) 是 http.request 的简化版，它自动将请求方法设置为 GET，并在内部自动执行 req.end() 发送请求。

http.ClientRequest 和 http.ClientResponse，暂略，需要时再回来看。

## 第 5 章 - 使用 Node.js 进行 Web 开发

使用 Express 框架，一个轻量级的 Web 框架。它包括以下功能：

- 路由控制
- 模板解析支持
- 动态视图
- 用户会话
- CSRF 保护
- 静态文件服务
- 错误控制器
- 访问日志
- 缓存
- 插件支持

### 5.2 快速开始

发现 Express 的内容已经过时了，简单过一下。然后自己看 Express 的官方文档。

- app.use() - 用来设置各种中间件。最常见的中间件就是 bodyParser。
- app.get(), app.post(), app.all() - 设置路由。

**5.3.5 控制权转移**

Express 提供了路由控制权转移的方法，即回调函数的第三个参数 next，通过调用 next()，会将路由控制权转移给后面的规则。(这个很有用啊)

    app.all('/user/:username', function(req, res, next) {
      console.log('all methods captured.)
      next();
    })
    app.get('/user/:username', function(req, res) {
      res.send('user: ' + req.params.username)
    })

这种机制可以让我们轻易地实现中间件。

### 5.4 模板引擎

和 Rails 中的理念没太多区别。可以说是照搬。

ejs 中的 3 种标签：

- <% code %> - JavaScript Code
- <%= code %> - 显示替换过 HTML 字符串的内容
- <%- code %> - 显示原始 HTML 内容。

使用 res.render() 来渲染 view，并可以通过 layout 参数指定新的 layout。

    res.render('userlist', {
      title: 'title',
      layout: 'admin'
    })

Express 也支持 partial 视图，支持 view helper 函数。view helper 是允许在 view 中访问的全局函数或对象，不用每次渲染 view 时单独传入。实际 partial 就是一个 view helper 函数。

    // list.ejs
    <ul><%- partial('listitem', items) %></ul>

    // listitem.ejs
    <li><%= listitme %></li>

Express 的 view helper 分两种：

- 静态 view helper - 接受任意参数
- 动态 view helper - 参数固定为 req 和 res

Express 用 app.helpers() 注册静态 view helper，用 app.dynamicHelpers() 注册动态 view helper。

    var util = require('util')

    app.helpers({
      inspect: function(obj) {
        return util.inspect(obj, true)
      }
    })

    app.dynamicHelpers({
      headers: function(req, res) {
        return req.headers
      }
    })

    app.get('/helper', function(req, res) {
      res.render('helper', {
        title: 'Helpers'
      })
    })

    // helper.ejs
    <%= inspect(headers) %>

view helper 的本质是给所有 view 注册了全局变量。

### 5.6 用户注册和登录

- req.session - 储存 session
- req.flash - 储存 flash message，`req.flash('success', 'login success')`
- res.redirect - 重定向

(原来 session 和 flash 是作用在 req 对象上的。)

**5.6.4 页面权限控制**

通过 next() 方法实现。在 rails 中通过 `before_action` 实现。还是 rails 方便。

    app.get('/reg', checkNotLogin)
    app.get('/reg', function(req, res) {
      res.render('reg', { title: 'Reg' })
    })

    app.post('/reg', checkNotLogin)
    app.post('/reg', function(req, res) {
      // ...
    })

    app.get('/login', checkNotLogin)
    app.get('/login', function(req, res) {
      // ...
    })

    function checkNotLogin(req, res, next) {
      if (req.session.user) {
        req.flash('error', 'already login in')
        return res.redirect('/')
      }
      next()
    }

## 第 6 章 - Node.js 进阶话题

- 模块加载机制
- 异步编程模式下的控制流
- Node.js 应用部署
- Node.js 的一些劣势

### 6.1 模块加载机制

Node.js 的模块分为两大类：

- 核心模块

  Node.js 标准 API 中提供的模块，如 fs、http、net、vm 等，由 Node.js 官方提供，编译成了二进制代码，通过类似 `require('fs')` 直接加载。核心模块拥有最高的加载优先级。

- 文件模块

  存储为单独的文件或文件夹的模块，可能是 JavaScript 代码、JSON 或编译好的 C/C++ 代码。在不显示指定文件模块扩展名的时候，Node.js 会分别试图加上 .js、.json 和 .node 扩展名，.node 是编译好的 C/C++ 代码。(我觉得还漏了一种，如果这个文件模块名是一个目录名，则访问的是 folder/index，或是 folder 中 package.json 中指定的入口)

核心模块的加载就没得说了，就一种方法。文件模块的加载方法：

1. 如果文件模块名以 '/' 或 '.' 开头，则按指定的路径加载，前者为绝对路径，后者为相对路径，比如 `require('./hello')
1. 如果文件模块名不以 '/' 或 '.' 开头，且模块名不是核心模块，则查找当前目录下的 `node_modules` 目录，如果当前 `node_modules` 没有，则查找上一级目录，依此类推，直接顶层目录。

**6.1.4 加载缓存**

require 后的文件模块会被缓存下来，之后不会再被重新加载。

### 6.2 控制流

略。现在 promise、async / await 都很成熟了。

### 6.3 部署

之前程序不适合在生产环境使用，因为有几个重大缺陷：

- 不支持故障恢复
- 没有日志
- 无法利用多核提高性能
- 独占端口
- 需要手动启动

**6.3.1 日志功能**

Node.js 支持两种运行模块：development 和 production，通过 NODE_ENV 环境变量指定。

    NODE_ENV=production node app.js  # 以生产模式启动 node app

日志分两种：

- 访问日志 - 记录客户对服务器的每个请求
- 错误日志 - 记录程序发生的错误

Express 提供了一个访问日志中间件，指定 stream 参数为一个输出流即可。

    var fs = require('fs')
    var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'})
    app.use(express.logger({stream: accessLogfile}))

错误日志，由需要手动实现，捕捉全局错误，写入错误日志文件中。

    var accessLogfile = fs.createWriteStream('error.log', {flags: 'a'})
    app.configure('production', function() {
      app.error(function(err, req, res, next) {
        var meta = `[${new Date()} ${req.url}`
        errorLogfile.write(meta+err.stack)
        next()
      })
    })

**6.3.2 使用 cluster 模块**

cluster 的功能是生成与当前进程相同的子进程，并且允许父进程和子进程之间共享端口，和 child_process 的最大区别就是，cluster 允许跨进程端口复用。

示例代码：

    // app.js，需要略做修改
    // 当 app.js 是通过 node app.js 启动时，才监听 3000 端口
    // 如果是被其它模块加载，则不启动监听
    if (!modules.parent) {
      app.listen(3000)
    }

    // cluster.js
    var cluster = require('cluster')
    var os = require('os')

    var cpuNums = os.cpus().length

    var workers = {}
    if (cluster.isMaster) {
      // 主进程分支
      cluster.on('death', function(worker) {
        // 当一个工作进程结束时，重启工作进程
        delete workers[worker.pid]
        worker = cluster.fork()
        workers[worker.pid] = worker
      })

      // 初始开启和 CPU 数量相同的工作进程
      for (var i = 0; i < cpuNums; i++) {
        var worker = cluster.fork()
        workers[worker.pid] = worker
      }
    } else {
      // 工作进程分支，启动服务器
      // 可以动态 require?
      var app = require('./app')
      app.listen(3000)
    }

    // 当主进程被终止时，关闭所有工作进程
    process.on('SIGTERM', function() {
      for (var pid in workers) {
        process.kill(pid)
      }
      process.exit(0)
    })

执行 `node cluster.js` 后，一个既能利用多核资源，又有实现故障发烧友复功能的服务器就诞生了。

**6.3.3 启动脚本**

写一个启动脚本来简化维护工作。像 nginx 的启动脚本一样：`/etc/init.d/nginx start` 和 `/etc/init.d/nginx stop`。

    #!/bin/sh

    NODE_ENV=production
    DAEMON="node cluster.js"
    NAME=Microblog
    DESC=Microblog
    PIDFILE="microblog.pid"

    case "$1" in
      start)
        echo "Starting $DESC: "
        nohup $DEAMON > /dev/null &
        echo $! > $PIDFILE
        echo "$NAME."
        ;;
      stop)
        echo "Stopping $DESC: "
        pid='cat $PIDFILE'  # works?
        kill $pid
        rm $PIDFILE
        echoo "$NAME."
        ;;
    esac

    exit 0

**6.3.4 共享 80 端口**

通过 Nginx 反向代理。

    server {
      listen 80;
      server_name mysite.com;

      location / {
        proxy_pass http://localhost:3000;
      }
    }

这个配置文件的功能是监听访问 mysite.com 80 端口，并将所有请求转发给 http://localhost:3000。

### 6.4 Node.js 不是银弹

Node.js 不适合做计算密集型任务、单用户多任务应用等...

## 附录 A - JavaScript 的高级特性

总结得很好，不过我都已经理解了，忘记时再回来看。
