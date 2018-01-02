# 微信小程序 Note

## References

- [小程序开发官方文档 - 简易教程](https://mp.weixin.qq.com/debug/wxadoc/dev/)

## Note

**准备阶段**

注册小程序开发账号，下载集成开发工具。

注意，小程序开发账号和公众号的账号是独立的，必须用不同的邮箱注册，但公众号账号可以绑定小程序开发账号开发的小程序。

**开发**

整体看了一下文档和示例代码，语法、框架基本和 Vue.js 是一样一样的，可以说是 Vue.js 的翻版，所以对于 Vue.js 的开发者来说简直是零成本上手。

另外小程序还借鉴了 PWA 的思想，即把 js / html / css 这些文件缓存在本地。

每个页面都是一个独立的文件夹，包含以下四种文件：

- js - 必选，实现 Page 对象，在 Page 对象中声明局部数据 data 和各种事件处理函数，页面的生命周期函数，是页面的逻辑部分
- wxml (即 html) - 必选，呈现给用户的页面，用于显示在 js 中定义的 Page 对象中的 data，以及将各个 view 的事件响应和 Page 对象中的事件处理函数绑定
- wxss (即 css) - 可选，css 样式
- json - 可选，声明本页面的窗口、导航栏等样式，用来覆盖在顶层 app.json 中声明的全局样式

在顶层有 app.js / app.wxss / app.json 来声明一些全局设置

- app.js - 实现全局唯一的 App 对象，包括 App 对象中的全局数据 globalData，生命周期函数如 onLaunch、onShow 等
- app.wxss - 全局 css 样式
- app.json - 声明此 APP 所有的页面，以及全局窗口样式、tab bar、网络超时等参数

顶层还有一个 project.config.json 的文件，存放了开发环境的配置文件，比如 appid、projectname、description 之类的，不是很重要。跟实际功能没有关系。

wxml 文件中，没有使用传统 html 中的 div / p / h1 等标签，而是采用了 React Native 中的 view / image / text 等标签，每一种标签都是一种组件的封装实现。

另外，在 js 中修改 data 时，没有采用 Vue 中直接修改数据的方式，比如 `this.data.msg = "hello"`，而是采用了类似 React 中显式 set 的方式 `this.setData({msg: "hello"})`。

(我猜小程序只实现了 Vue 的模板功能，而最重要的自动跟踪数据变化的功能却没有实现，相当于只用到了 Vue 的皮毛，而 setData 方法，不知道底层有没有像 React 那样做了 diff，从而上层只更新变化的部分，而不是全部重新渲染。)

可以说，小程序是 Vue + React + PWA 的混合体和简易版...

小程序的大致框架就是这样，并不复杂，剩下就是它提供的与系统打交道的 API 了，需要时再看文档即可。

## Todo

实现一个小程序。
