# NPM & Yarn & nvm

## NPM 使用

Resources:

1. [npm 模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

### 基本用法

1.  安装 package，-g 表示全局安装，--save 表示是否将依赖写入到 package.json 中

         npm install [package_name] [-g] [--save]

    如果没有指定包名，则安装 package.json 中指定的所有依赖

1.  升级 package

        npm update [package_name]

1.  卸载 package

        npm uninstall [package_name]

1.  搜索包

        npm search [package_name]

1.  查看已安装的包

        npm ls [-g]

1.  查看一个包的信息

        npm info [package_name]

1.  初始化一个包，生成 package.json

        npm init

1.  清除缓存

        npm cache clear

### npm run

在上面的参考链接 [npm 模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html) 中讲得很详细，这里就不赘述了。

### 将包发布到 npm registry

非常简单，一点都不麻烦，去 npm.js 注册一个账号，然后在命令行下执行 `npm login`，输入验证信息验证，或者直接在 npm.js 个人设置中创建 auth token 加到 `~/.npmrc` 中，`npm login` 相当于自动帮你生成了 auth token 并添加到了 `~/.npmrc` 中。

发布时，如果你的 repo 是要直接发布到 npm.js 根下 (不推荐)，使用 `npm publish` 命令。

推荐发布到用户名 scope 下，不容易和别的包名冲突，比如我注册时用户名为 baurine，则将包名设置为 "@baurine/package_name"，发布时用 `npm publish --access public`，则会发布到 npm.js 的 @baurine scope 下。(如果用 yarn，则是 `yarn publish --access public`)

## Yarn 使用

Resources：

1. [Yarn 使用](https://yarnpkg.com/zh-Hans/docs/usage)
1. [Yarn CLI](https://yarnpkg.com/zh-Hans/docs/cli/)

### 基本使用

1.  开始新项目

        yarn init

1.  添加依赖包

        yarn add [package] [--dev|--peer|--optinal]

1.  升级依赖包

        yarn upgrade [package]

1.  移除依赖包

        yarn remove [package]

1.  安装全部依赖

        yarn install
        // 或
        yarn

## nvm

使用 nvm 管理多版本的 node

Resources:

- [node 版本控制工具 nvm](https://www.jianshu.com/p/0cfeed299f2a)
- [Official GitHub Repo](https://github.com/nvm-sh/nvm)

### 基本使用

1.  安装

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

1.  查看 node 版本

        nvm ls-remote
        nvm ls-remote --lts
        nvm list
        nvm current

1.  安装指定版本的 node

        nvm install 10.15.3

1.  使用指定版本的 node

        nvm use 10.15.3

更多使用查看官方文档
