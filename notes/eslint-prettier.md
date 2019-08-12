# ESLint & Prettier

- [深入理解 ESLint](https://mp.weixin.qq.com/s/X2gShxrCw0ukZigjE_45kA)
- [使用 ESLint+Prettier 来统一前端代码风格](https://segmentfault.com/a/1190000015315545)

(以下大部分内容都直接摘抄自上面两篇文章)

TODO: 仔细阅读一下 eslint 和 prettier 的官方文档。

lint 和 prettier 的区别:

- [Prettier vs. Linters](https://prettier.io/docs/en/comparison.html)

linter 有两大类规则：

1. Formatting rules: eg: max-len, no-mixed-spaces-and-tabs, keyword-spacing, comma-style...
1. Code-quality rules: eg no-unused-vars, no-extra-bind, no-implicit-globals, prefer-promise-reject-errors...

prettier 侧重做 formatting rules，不 care code-quality rules。

总的来说 prettier 可以算是 linter 的子集，但它专注把 formatting 这一块做得比 linter 出色。

如果和 eslint 进行比较的话，eslint 仅限于对 js/ts 代码进行 lint，但 prettier 不只是对 js/ts 代码进行 prettier，它还可以对 css/html/json/markdown/yaml 等格式文件进行 prettier。

所以 prettier 是 linter 子集，但和 eslint 是交集。

eslint 和 ruby 中的 rubocop 本质没有区别，要学会触类旁通，举一返三。

初始化 eslint 配置：`eslint --init`

eslint 配置文件：.eslintrc.js (.eslintrc.js > .eslintrc.yaml > .eslintrc.yml > .eslintrc.json > .eslintrc > package.json)

## eslint 配置参数

### 解析器配置

```js
{
  // 解析器类型
  // espima(默认), babel-eslint, @typescript-eslint/parse
  "parse": "esprima",
  // 解析器配置参数
  "parseOptions": {
    // 代码类型：script(默认), module
    "sourceType": "script",
    // es 版本号，默认为 5，也可以是用年份，比如 2015 (同 6)
    "ecamVersion": 6,
    // es 特性配置
    "ecmaFeatures": {
        "globalReturn": true, // 允许在全局作用域下使用 return 语句
        "impliedStrict": true, // 启用全局 strict mode
        "jsx": true // 启用 JSX
    },
  }
}
```

### 环境与全局变量

ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。

```js
{
  "globals": {
    // 声明 jQuery 对象为全局变量
    "$": false // true表示该变量为 writeable，而 false 表示 readonly
  }
}
```

在 globals 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 env ，这是对一个环境定义的一组全局变量的预设（类似于 babel 的 presets）。

```js
{
  "env": {
    "amd": true,
    "commonjs": true,
    "jquery": true
  }
}
```

可选的环境很多，预设值都在这个文件中进行定义，查看源码可以发现，其预设变量都引用自 globals 包。

```js
{
  "jquery": {
    "$": false,
    "jQuery": false
  }
}
```

### 规则设置

略。

### 扩展

扩展就是直接使用别人已经写好的 lint 规则，方便快捷。扩展一般支持三种类型：

```
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard",
  ]
}
```

- eslint 开头的是官方扩展，一共两个：eslint:recommend, eslint:all
- plugin 开头的扩展是插件类型，也可以直接在 plugins 属性中进行设置
- 最后一种扩展来自 npm 包，官方规定 npm 包的扩展必须以 `eslint-config-` 开头，使用时可以省略这个前缀。

### 插件

#### 使用插件

虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。

这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 eslint-plugin- 开头，使用的时候也可以省略这个头。

```shell
npm install --save-dev eslint-plugin-vue eslint-plugin-react
```

```js
{
  "plugins": [
    "react", // eslint-plugin-react
    "vue",   // eslint-plugin-vue
  ]
}
```

或者是在扩展中引入插件，前面有提到 `plugin:` 开头的是扩展是进行插件的加载。

```js
{
  "extends": [
    "plugin:react/recommended",
  ]
}
```

通过扩展的方式加载插件的规则如下：

```js
extPlugin = `plugin:${pluginName}/${configName}`
```

那上面的 recommended 是从哪里来的呢，看 eslint-plugin-react 的源码：

```js
module.exports = {
  // 自定义的 rule
  rules: allRules,
  // 可用的扩展
  configs: {
    // plugin:react/recommended
    recomended: {
      plugins: [ 'react' ]
      rules: {...}
    },
    // plugin:react/all
    all: {
      plugins: [ 'react' ]
      rules: {...}
    }
  }
}
```

#### 开发插件

略。

---

- [使用 ESLint+Prettier 来统一前端代码风格](https://segmentfault.com/a/1190000015315545)

> 使用 ESLint 配合这些规范，能够检测出代码中的潜在问题，提高代码质量，但是并不能完全统一代码风格，因为这些代码规范的重点并不在代码风格上（虽然有一些限制）。

prettier 用来统一代码风格，自动帮你格式化代码。

## ESLint 与 Prettier 配合使用

前提是已经配置好了 eslint，有 eslintrc.js 配置文件。

安装 prettier：

```shell
npm i -D prettier
```

安装 eslint-plugin-prettier 插件：

```shell
npm i -D eslint-plugin-prettier
```

这个插件会让 eslint 调用 prettier 对代码风格进行检查。

在 rules 中添加 `"prettier/prettier": "error"` (暂时不太理解)

如果与已存在的插件冲突怎么办，安装 eslint-config-prettier 插件，能够关闭一些不必要的或者是与 prettier 冲突的 lint 选项。

简化配置：

```js
//.eslintrc.js
{
  "extends": ["plugin:prettier/recommended"]
}
```

---

至于 VS Code 上的 eslint 和 prettier extension，我自己写过扩展，所以很容易理解，extension 实际就是对上面那个工具或库又进行了一层封装嘛，真正调用的还是这两个工具或库的 API。
