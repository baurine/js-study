# Electron Note

## References

- [Electron 文档 - 快速入门](https://electronjs.org/docs/tutorial/quick-start)
- [Learn Electron in Less than 60 Minutes - Free Beginner's Course](https://www.youtube.com/watch?v=2RxHQoiDctI)
- [Build an Electron App in Under 60 Minutes](https://www.youtube.com/watch?v=kN1Czs0m1SU)

## Note

看了上面三个参考链接的文章和视频，基本就能写个 Electron APP 了。明白了写个 Electron APP，本质上和写个 Chrome Extension 或 VS Code Extension 没有什么区别。只不过打交道的 API 从 Chrome Extension API 和 VS Code Extension API 换成了 Electron API。

上面的两个视频教程大同小异，只是 demo 不同，差不多都覆盖到了以下主要知识点：

1. 菜单
1. 打开新的窗口
1. 不同窗口之间通过 IPC 通信，发送数据
1. 访问 HTTP API 从网络取得数据
1. 发送系统 Notification
1. 通过 electron-packager 打包 APP

有空时写个什么 Electron APP 好呢？
