# Deno Study

5.13 Deno 1.0 正式发布。

- [Deno 1.0](https://deno.land/v1)
- [Deno 1.0: What you need to know](https://blog.logrocket.com/deno-1-0-what-you-need-to-know/)
- [Deno 1.0，来了解一下](https://mp.weixin.qq.com/s/JYgqdzN1RooeALMBpmS76g)
- [20 分钟入门 deno](https://juejin.im/post/5ebcabb2e51d454da74185a9)
- [servestjs](https://servestjs.org/)

特性：

- 安全，权限控制
- TypeScript 开箱即用，甚至无须 tsconfig.json
- 和 Go 只生成一个可执行文件
- 和 Go/Rust 一样内置 fmt 等工具
- 提供标准库

其它：

- 没有 node_modules，和 Go 一样，没有中心化的包管理，直接通过 url 引用
- 不再用 EventEmitter
- 使用 ES Module

servestjs 是基于 deno 的 web 框架，最吸引人的是它直接用 react jsx 作为后端模板，nice，可以尝试用 servestjs 干点啥，仿个 v2ex?
