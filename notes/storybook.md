# Storybook Note

## References

- [Learn Storybook](https://www.learnstorybook.com/)
- [文档](https://storybook.js.org/docs/basics/introduction/)

## Note

Storybook 是啥：

> Storybook is a user interface development environment and playground for UI components. The tool enables developers to create components independently and showcase components interactively in an isolated development environment.

> Storybook runs outside of the main app so users can develop UI components in isolation without worrying about app specific dependencies and requirements.

一个 UI playground，用来方便地展示组件的各个形态，方便测试和开发。

配置也很简单，就两个文件。

`.storybook/addons.js` - 导入要使用的 addon。addon 是用来增强 storybook 功能的小配件，比如 knobs addon 就允许用户实时修改 component 的 props。

示例：

```js
import '@storybook/addon-actions/register'
import '@storybook/addon-knobs/register'
import '@storybook/addon-links/register'
```

`.storybook/config.js` - 设置要从哪些文件中加载 stories，因为我们把 .stories.js 放在 components 目录中，所以在这个文件我们设置从 components 目录的 .stories.js 文件中加载 stories。

示例：

```js
import { configure } from '@storybook/react'
import '../src/index.css'

const req = require.context('../src/components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
```

这个文件的主要作用就是批量加载匹配的 .stories.js 文件。

require.context 是 webpack 提供的一个方法，它的返回值是一个函数，这个函数可以用来从外部加载一个 js 文件，同时这个函数内部又有三个属性，这三个属性也是函数，其中之一就是 keys() 方法，keys() 方法的结果是执行 require.context() 匹配到的文件数组。

- [webpack require.context](https://webpack.js.org/guides/dependency-management/#requirecontext)

```js
require.context(
  directory,
  (useSubdirectories = true),
  (regExp = /^\.\/.*$/),
  (mode = 'sync')
)
```

另外一个示例：

```js
const translations = {
  en: require('./translations/en.yaml'),
  zh_CN: require('./translations/zh_CN.yaml'),
}
// 等于
const translations = require.context('./translations/', false, /\.yaml$/)
// ==，有待验证是否等价
```

配置就这些，还是很简单的。

然后我们就为各个展示型组件写 stories (容器型组件后面再说)。比如有两个组件，components/Task.js，components/TaskList.js，我们依次创建相应的 .stories.js 文件，即 components/Task.stories.js，components/TaskList.stories.js。

在 .stories.js 文件中，我们主要使用 stoiresOf() 方法和 .add() 方法来添加各种不同参数的组件。并使用 action addon mock 函数型 prop。

示例：

```js
// Task.stories.js
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => {
    return <Task task={...task } {...actions} />;
  })
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

还有 addDecorator() 方法也很常用，给所有 story 添加装饰器。比如下例中，给 4 个 TaskList 都添加了一个 padding 为 3rem 的容器。

```js
storiesOf('TaskList', module)
  .addDecorator((story) => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => (
    <TaskList tasks={withPinnedTasks} {...actions} />
  ))
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />)
```

Storybook 应该只用来显示展示型组件，不关心容器型组件，但是如果这个展示型组件里嵌着容器型组件，那该怎么办呢。比如官方教程的例子中，要展示 PureInboxScreen 组件，但是这个组件中包含了 TaskListContainer，TaskListContainer 和 redux store connect，从 store 中取数据。

方法是自己 mock 一个 store，使用 addDecorator() 把这个 store 传给组件。

示例：

```js
const store = {
  getState: () => {
    return {
      tasks: defaultTasks,
    }
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
}

storiesOf('InboxScreen', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />)
```

(这个例子的 store 是很简单的，但是在实际项目中，store 里 state 很复杂的话，会不会很麻烦啊)

一个使用 Jest 进行测试的示例：

```js
// TaskList.test.js
import React from 'react'
import ReactDOM from 'react-dom'
import TaskList from './TaskList'
import { withPinnedTasks } from './TaskList.stories'

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div')
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() }
  ReactDOM.render(<TaskList tasks={withPinnedTasks} {...events} />, div)

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector(
    '.list-item:nth-child(1) input[value="Task 6 (pinned)"]'
  )
  expect(lastTaskInput).not.toBe(null)

  ReactDOM.unmountComponentAtNode(div)
})
```

## CSF

从 5.x 版本开始，storybook 增加了一种叫 [CSF (Componenst Story Format)](https://storybook.js.org/docs/formats/component-story-format/) 的写法，用来简化 `.add()` 这种链式写法。

写法如下所示：

```js
import MyComponent from './MyComponent';

export default { ... }

export const Basic = () => <MyComponent />;
export const WithProp = () => <MyComponent prop="value" />;
```

另外配置文件写在 .storybook/main.js 中，对 stories 进行 globally 级的配置写在 .storybook/preview.js 中。

## Work with React & Typescript & CRA & customize-cra

将 Storybook 用于使用 CRA 及 customize-cra 创建的 Typescript react 项目。实际项目可以参看这个 PR: [tidb-dashboard#691 - add ui playground by storybook](https://github.com/pingcap-incubator/tidb-dashboard/pull/691)

两个细节。

- storybook 如何复用 customize-cra 的 confi-overrides.js 配置
- storybook 如何配置可处理 src folder 以外的代码 (默认只支持 src 中的代码)

完整的 .storybook/main.js:

```js
const path = require('path')

// 处理 src 以外的 folder
function includeMorePaths(config) {
  // find rule to handle *.tsx files
  for (const rule of config.module.rules) {
    for (const subRule of rule.oneOf || []) {
      // /\.(js|mjs|jsx|ts|tsx)$/
      if (subRule.test instanceof RegExp && subRule.test.test('.tsx')) {
        subRule.include.push(path.resolve(__dirname, '../lib'))
        // although we don't care about the components inside diagnoseReportApp
        // but it can't pass compile if we don't add it to the rule.include
        subRule.include.push(path.resolve(__dirname, '../diagnoseReportApp'))
        break
      }
    }
  }

  return config
}

// ref: https://harrietryder.co.uk/blog/storybook-with-typscript-customize-cra/
// 复用 config-overrides.js
const custom = require('../config-overrides')

module.exports = {
  stories: ['../lib/components/**/*.stories.@(ts|tsx|js|jsx)'], // 6.x 后 glob 的写法有变，后缀前要加一个 `@` 符号
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: (storybookConfig) => {
    const customConfig = custom(storybookConfig)
    const newConfigs = {
      ...storybookConfig,
      module: { ...storybookConfig.module, rules: customConfig.module.rules },
    }
    return includeMorePaths(newConfigs)
  },
}
```

如果遇到了 `Uncaught SyntaxError: Unexpected token 'default'` 的运行时错误，可以参考这个 issue 解决：[storybookjs/storybook#11419 (comment)](https://github.com/storybookjs/storybook/issues/11419#issuecomment-658969643)。
