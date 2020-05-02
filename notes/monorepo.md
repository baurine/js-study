# monorepo 结构

参考：

- [lerna+yarn workspace+monorepo 项目的最佳实践](https://juejin.im/post/5d583231e51d45620541039e)
- [Workspaces in Yarn](https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/)
- [Why Lerna and Yarn Workspaces is a Perfect Match for Building Mono-Repos – A Close Look at Features and Performance](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/)
- [基于 lerna 和 yarn workspace 的 monorepo 工作流](https://zhuanlan.zhihu.com/p/71385053)

lerna + yarn workspaces + rollup

yarn workspaces 用来管理依赖，lerna 用来管理构建，发布，rollup 用来打包 library，root app 还是 webpack 打包。

(另一种选择是 all in webpack，使用 webpack 的多入口，不再拆成多个 packages。但是把目录细分成 lib, apps。apps 下放置不同的入口。)

## lerna & yarn workspaces

- 功能上较多重合
- 先有 lerna 后有 yarn workspaces
- lerna 为第三方实现，yarn workspaces 为原生实现
- lerna 支持和 npm 使用，yarn workspaces 只支持 yarn
- yarn 官方推荐：用 yarn 来处理依赖问题，用 lerna 来处理发布问题

## 配置

lerna.json

```json
{
  "packages": ["packages/*"],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

package.json

```json
{
  "workspaces": ["packages/*"],
  "private": true,
  "devDependencies": {
    "lerna": "^3.20.2",
    ...
  }
  ...
}
```

## yarn workspaces 管理依赖

- 给某个 package 安装依赖
  - `yarn workspace packageB add antd`
  - `yarn workspace packageB add packageA@version`
- 给所有的 packages 安装依赖
  - `yarn workspaces run add lodash`
- 给 root 安装依赖: 一般的公用的开发工具都是安装在 root 里
  - `yarn add -W -D typescript`

## leran 管理打包，发布

- 按拓扑顺序进行 build (yarn workspaces 不支持)
  - `lerna run --stream --sort build`
- 开发模式下并行 watch 所有 packages
  - `lerna run --parallel watch`
- 升级版本：所有依赖同时更新
  - `lerna version`
- 发布
  - `lerna publish`
