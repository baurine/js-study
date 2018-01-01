# PWA Note

## References

- [Progressive Web App tutorial – learn to build a PWA from scratch](https://www.youtube.com/watch?v=gcx-3qi7t7c)
- [您的第一个 Progressive Web App](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/)
- [PWA 入门: 写个非常简单的 PWA 页面](https://zhuanlan.zhihu.com/p/25459319)
- [PWA 入门: 理解和创建 Service Worker 脚本](https://zhuanlan.zhihu.com/p/25524382)

## Note

其实 PWA 很简单，没什么复杂的，我认为它的目的是两个：

1. 启动时快速加载，减少等待
1. 网络离线时还能使用

PWA APP 在没有网络的情况下，还能看到以前下载的一些内容，比如文本，图片，在这一点上，超过了 Native APP 的表现。现在很多 Native APP 一旦没有网络后，除了能显示之前打包的本地资源后，网络资源是完全歇菜了，除非 APP 手动把这些内容缓存到了本地 (比如微信)。

PWA 的实现靠两个文件：

1. manifest.json
1. service-worker.js (文件名可以任意)

其中 manifest.json 基本上只是用来生成桌面快捷方式用的，所以最主要的还是 service-worker.js 这一个文件。

service-worker.js 的作用，说白了，就是处理缓存。它会拦截所有的网络请求，当请求从服务器回来时，它可以把返回的数据缓存在客户端，当请求发出时，它可以从缓存中优先提取数据。

当然，还需要处理一些缓存过期的问题。

缓存主要分两种：

1. 静态缓存，在 PWA 中被称为 APP Shell，这部分内容在 PWA APP 被安装时会被 service-worker 从服务端抓取下来并缓存，当 PWA APP 打开时可以从缓存中迅速加载，给用户的感觉就是这个 PWA APP 的加载速度惊人。这部分内容一般不会经常变化。
1. 动态缓存，是指网页中通过 API 获得的数据，比如 JSON 数据，以及 JSON 数据中的资源链接，比如图片。

从 [Progressive Web App tutorial – learn to build a PWA from scratch](https://www.youtube.com/watch?v=gcx-3qi7t7c) 这个例子中学习到一种很方便地生成批量 DOM 元素的方法，如下所示：

    ulElement.innerHTML = articlesJsonArr.map(createArticle).join('\n')

    function createArticle(article) {
      reutrn `
        <li>
          <div>
            <h1>${article.title}</h1>
            <img src=${article.image}>
            <p>${article.content}</p>
          </div>
        </li>
      `
    }

简直是太方便了，我之前在实现一个 Chrome Extension 时是用一坨 createElement() 实现的，太笨了。

## Todo

跟着 [Progressive Web App tutorial – learn to build a PWA from scratch](https://www.youtube.com/watch?v=gcx-3qi7t7c) 教程实现一个完整的 PWA Demo，它用的 News API 很有用啊。
