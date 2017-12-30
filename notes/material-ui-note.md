# Material-UI Note

## References

- [Google Material Design Lite](https://getmdl.io/components/index.html)
- [Materialize](http://materializecss.com/)
- [MUI](https://www.muicss.com/)
- [Material-UI](http://www.material-ui.com/#/)

## Note

想了解一下这个是因为公司有几个项目的后台管理界面用到了 Material Design 的组件，好奇用的是什么库，通过查阅代码，发现用的是 Material-UI 这个组件库。

为什么用这个库而不用其它的 Material Design 库呢？比如 Google 官方实现的 Material Design Lite。查阅了一下相关资料，比较有名的几个 Material Design  Web 实现 (列在上面 References 中)，前三个都是类似 Bootstrap，单纯地通过 CSS (或加上 jQuery) 实现。只有 Material-UI 是完全基于 React 实现的。而我们的项目基本都是基于 React 实现的，所以只有 Material-UI 满足要求。

Material-UI 的官方介绍：

> React components that implement Google's Material Design

所以目前基于 React 实现的组件库，我了解的现在就有这两个了：

- Material-UI
- Ant Design

Material-UI 的使用：

1. 安装 (截止 2017/12/30，v1.0 正式版即将发布)

        $ npm install --save material-ui@next

2. 在 React 中使用组件

        import React from "react";
        import { render } from "react-dom";
        import Button from "material-ui/Button";

        function App() {
          return (
            <Button raised color="primary">
              Hello World
            </Button>
          );
        }

        render(<App />, document.querySelector("#app"));

That's all.

其它详略，需要时再阅读文档。
