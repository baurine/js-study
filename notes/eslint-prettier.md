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

eslint 和 ruby 中的 rubocop 本质没有区别，要学会触类旁通，举一返三。`eslint --fix` 自动修改，类似 `rubocop --correct`。

初始化 eslint 配置：`eslint --init`

eslint 配置文件：.eslintrc.js (.eslintrc.js > .eslintrc.yaml > .eslintrc.yml > .eslintrc.json > .eslintrc > package.json)

## eslint 配置参数

### 解析器配置

```json
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
    }
  }
}
```

### 环境与全局变量

ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。

```json
{
  "globals": {
    // 声明 jQuery 对象为全局变量
    "$": false // true表示该变量为 writeable，而 false 表示 readonly
  }
}
```

在 globals 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 env ，这是对一个环境定义的一组全局变量的预设（类似于 babel 的 presets）。

```json
{
  "env": {
    "amd": true,
    "commonjs": true,
    "jquery": true
  }
}
```

可选的环境很多，预设值都在这个文件中进行定义，查看源码可以发现，其预设变量都引用自 globals 包。

```json
{
  "jquery": {
    "$": false,
    "jQuery": false
  }
}
```

### 规则设置

```json
{
  ...
  "rules": {
    // 使用数组形式，对规则进行配置
    // 第一个参数为是否启用规则
    // 后面的参数才是规则的配置项
    "quotes": [
      "error", // "warn"
      "single", // "single": 尽量用单引号，"double": 尽量用双引号，"backtick": 尽量用反引号
      {
        "avoidEscape": true
      }
    ]
    // "quotes": "off"
  }
}
```

rules 字段，可以单独控制每一条规则，打开或关闭，warn 或 error。

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

最常见的是扩展是 airbnb-base (eslint-config-airbnb-base)：

```json
{
  "extends": "airbnb-base"
}
```

### 插件

#### 使用插件

虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。

这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 eslint-plugin- 开头，使用的时候也可以省略这个头。

```shell
npm install --save-dev eslint-plugin-vue eslint-plugin-react
```

```json
{
  "plugins": [
    "react", // eslint-plugin-react
    "vue" // eslint-plugin-vue
  ]
}
```

或者是在扩展中引入插件，前面有提到 `plugin:` 开头的是扩展是进行插件的加载。

```json
{
  "extends": ["plugin:react/recommended"]
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

前提是已经配置好了 eslint，有 .eslintrc.js 配置文件。

安装 prettier：

```shell
npm i -D prettier
```

安装 eslint-plugin-prettier 插件：

```shell
npm i -D eslint-plugin-prettier
```

修改 .eslintrc.js，声明使用 prettier 插件，并在 rules 中把 "prettier/prettier" 规则设置为 "error" 级别 (奇怪，难道 eslint-plugin-prettier 插件内部不会自动把这个规则设置为 "error" 吗？)

```json
//.eslintrc.js
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

如果与已存在的插件冲突怎么办，安装 eslint-config-prettier 插件，能够关闭一些不必要的或者是与 prettier 冲突的 lint 选项。

```json
//.eslintrc.js
{
  "extends": ["prettier"], // 省略了 eslint-config，实际是 eslint-config-prettier，这个 config 关闭了 eslint 和 prettier 冲突的规则
  "plugins": ["prettier"], // 省略了 eslint-plugin，实际是 eslint-plugin-prettier
  "rules": {
    "prettier/prettier": ["error"] // 此规则的实现来自 eslint-plugin-prettier
  }
}
```

上面的配置可以简化成：

```json
//.eslintrc.js
{
  "extends": ["plugin:prettier/recommended"]
}
```

这个在 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 官网有提及。

> This does three things:

> - Enables eslint-plugin-prettier.
> - Sets the prettier/prettier rule to "error".
> - Extends the eslint-config-prettier configuration.

## VS Code 插件

至于 VS Code 上的 eslint 和 prettier extension，我自己写过扩展，所以很容易理解，extension 实际就是对上面那个工具或库又进行了一层封装嘛，真正调用的还是这两个工具或库的 API。所以仅仅在 VS Code 里安装插件是不够的，每个项目还要安装自己的 eslint 和 prettier 依赖及写相应的配置。

用 VS Code 打开一个前端项目后，eslint extension 会去找这个项目有没有安装 eslint 依赖，没有的话，会提示找不到 eslint，因此无法工作。

对于 prettier extension 的话，可能有所不同，我觉得它应该自己安装了默认的 prettier 依赖，如果 prettier extension 在这个项目中没有找到 prettier 依赖，它就会用 extension 自己的 prettier 和配置。

另外，安装 prettier VS Code extension 后，编辑器默认的格式化处理就会被 prettier 代替， 默认快捷键是 alt+shift+f (这样就可以不用设置 `editor.formatOnSave = true` 了)

## 其它

[Setting up ESLint on VS Code with Airbnb JavaScript Style Guide](https://travishorn.com/setting-up-eslint-on-vs-code-with-airbnb-javascript-style-guide-6eb78a535ba6)

The concise version:

- `cd coding-directory`
- `npm init -y`
- `npm i -D eslint eslint-config-airbnb-base eslint-plugin-import`
- Create `.eslintrc.js: module.exports = { "extends": "airbnb-base" };`
- In VSCode, search and install ESLint extension
- Restart VS Code

`eslint-plugin-import` 是 `eslint-config-airbnb-base` 的 peer dependency，它支持 lint 新的 import/export 语法。

[Setting up Prettier on VS Code](https://travishorn.com/setting-up-prettier-on-vs-code-1fd5e5a43523)

The concise version:

- `cd coding-directory`
- `npm init -y`
- `npm i -D prettier eslint eslint eslint-config-prettier eslint-plugin-prettier`
- Create `.eslintrc.js: module.exports = { "extends": "plugin:prettier/recommended" };`
- In VS Code, Ctrl + Shift + X
- Search and install ESLint
- Search and install Prettier Code formatter
- Restart VS Code

[ESLint + Airbnb Javascript Style Guide + Prettier + VS Code](https://medium.com/@svyandun/eslint-airbnb-javascript-style-guide-prettier-vs-code-ffdad3029044)

1. 安装依赖

   ```shell
   yarn add -D eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-prettier prettier
   ```

1. 配置 .prettierrc.json

   ```json
   {
     "singleQuote": true
   }
   ```

1. 配置 .eslintrc.json，声明 lint 规则扩展自 eslint-config-aribnb-base 和 eslint-plugin-prettier

   ```json
   {
     "extends": ["airbnb-base", "plugin:prettier/recommended"]
   }
   ```

   等同于：

   ```json
   {
     "extends": ["airbnb-base", "prettier"], // 省略了 eslint-config，实际是 eslint-config-prettier，这个 config 关闭了 eslint 和 prettier 冲突的规则
     "plugins": ["prettier"], // 省略了 eslint-plugin，实际是 eslint-plugin-prettier
     "rules": {
       "prettier/prettier": ["error"] // 此规则的实现来自 eslint-plugin-prettier
     }
   }
   ```

1. 在 package.json 中添加 lint 命令

   ```json
   {
     ...
     "scripts": {
       "lint": "eslint ."
     }
     ...
   }
   ```

1. 在 VS Code 中安装 eslint 和 prettier 扩展，配置编辑器保存时进行格式化 (需要吗？)

   ```json
   {
     ...
     "editor.formatOnSave": true
     ...
   }
   ```

That't all。

[paulolramos/eslint-prettier-airbnb-react](https://github.com/paulolramos/eslint-prettier-airbnb-react)

ESlint, Prettier Integration

1. eslint-plugin-prettier
   - Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.
1. eslint-config-prettier
   - Turns off all rules that are unnecessary or might conflict with Prettier.
