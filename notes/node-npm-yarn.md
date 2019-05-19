# NPM & Yarn & nvm

## NPM 使用

Resources:

1. [npm 模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

### 基本用法

1. 安装 package，-g 表示全局安装，--save 表示是否将依赖写入到 package.json 中

        npm install [package_name] [-g] [--save]

   如果没有指定包名，则安装 package.json 中指定的所有依赖

1. 升级 package

        npm update [package_name]

1. 卸载 package

        npm uninstall [package_name]

1. 搜索包

        npm search [package_name]

1. 查看已安装的包

        npm ls [-g]

1. 查看一个包的信息

        npm info [package_name]

1. 初始化一个包，生成 package.json

        npm init

1. 清除缓存

        npm cache clear

### npm run

在上面的参考链接 [npm 模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html) 中讲得很详细，这里就不赘述了。

## Yarn 使用

Resources：

1. [Yarn 使用](https://yarnpkg.com/zh-Hans/docs/usage)
1. [Yarn CLI](https://yarnpkg.com/zh-Hans/docs/cli/)

### 基本使用

1. 开始新项目

        yarn init

1. 添加依赖包

        yarn add [package] [--dev|--peer|--optinal]

1. 升级依赖包

        yarn upgrade [package]

1. 移除依赖包

        yarn remove [package]

1. 安装全部依赖

        yarn install
        // 或
        yarn

## nvm

使用 nvm 管理多版本的 node

Resources:

- [node 版本控制工具 nvm](https://www.jianshu.com/p/0cfeed299f2a)
- [Official GitHub Repo](https://github.com/nvm-sh/nvm)

### 基本使用

1. 安装

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

1. 查看 node 版本

        nvm ls-remote
        nvm ls-remote --lts
        nvm list
        nvm current

1. 安装指定版本的 node

        nvm install 10.15.3

1. 使用指定版本的 node

        nvm use 10.15.3

更多使用查看官方文档
