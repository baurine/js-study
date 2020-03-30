# React Misc

- React in Patterns (React 模式) 一书笔记
- i18n

## React in Patterns (React 模式) 一书笔记

[原始链接](https://github.com/krasimir/react-in-patterns)

此书比较精髓的部分在于 "组合" 一小节：

- 组合 (组件化)
  - 使用 React children API
  - 将 children 作为 prop 传入
  - 高阶组件
  - 将函数作为 children 传入 (即 children 为函数) 和 render prop

React 组件传入的属性可以是任意值，甚至另一个组件。

    function SomethingElse({ answer }) {
      return <div>The answer is {answer}</div>
    }
    function Answer() {
      return <span>42</span>
    }

    <SomethingElse answer={<Answer/>}>

`<Answer/>` 相当于执行了 `Answer()` 函数。

Ant Design 中很多组件使用了 prop 为 component 的用法：

    <SubMenu
      title={<span><Icon type='dashboard'/><span>Dashboard</span></span>}>
      <Menu.Item>分析页</Menu.Item>
      <Menu.Item>监控页</Menu.Item>
      <Menu.Item>工作台</Menu.Item>
    </SubMenu>

    <Card.Meta
      avatar={<img
        alt=""
        style={{ width: '64px', height: '64px', borderRadius: '32px' }}
        src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"/>}
      title="Alipay"
      description="在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。"/>

props.children 属性，可以让我们在父组件中访问它的子元素。

    function Title({text, children}) {
      return (
        <h1>
          {text}
          {children}
        </h1>
      )
    }
    function App() {
      return (
        <Title text='hello react'>
          <span>community</span>
        </Title>
      )
    }

如果在 Title 的定义中将 `{children}` 移除掉，那么 `<span>community</span>` 将不会被渲染。

使用 React children API 和 将 children 作为 prop 传入说的是差不多的事情，就是上面这个例子。

Ant Design 中 Layout 使用了些用法：

    <Layout>
      <Sider>
        Sider
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>
          {this.props.children}
        </Content>
        <Footer>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>

### 高阶组件

类似装饰器模式，将组件即为函数的参数，然后返回一个新的包装过的组件。redux 中的 connect() 函数，react-router 中的 withRouter() 函数，都是高阶组件。

    const enhanceComponent = (Component) =>
      class Enhance extends React.Component {
        render() {
          const newProps = {...}
          return (
            <Comonent {...this.props} {...newProps}>
          )
        }
      }

    const OriginalTitle = () => <h1>Hello React</h1>
    const EnhancedTitle = enhancedComponent(OriginalTitle)

    const App = () => <EnhancedTitle/>

### children 为函数和 render prop 模式

children 为普通对象：

    function UserName({ children }) {
      return (
        <div>
          <b>{children.lastName}</b>,{children.firstName}
        </div>
      )
    }

    function App() {
      const user = {
        firstName: 'Krasimir',
        lastName: 'Tsonev
      }
      return <UserName>{user}</UserName>
    }

children 为函数：

    function TodoList({ todos, children }) {
      return (
        <section className='main-section'>
          <ul className='todo-list'>
          {
            todos.map((todo, i) =>
              <li key={i}>{ children(todo) }</li>
            )
          }
          </ul>
        </section>
      )
    }

    function App() {
      const todos = [...]
      const isCompeleted = todo=>todo.status === 'done'
      return (
        <TodoList todos={todos}>
          {
            todo => isCompleted(todo) ?
            <b>{ todo.label }</b> :
            todo.label
          }
        </TodoList>
      )
    }

优点：TodoList 可以无须知道 todos 的数据结构，不需要知道它有 label 和 status 属性。其实也是一种包装模式。

[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 采用了这种模式。

    import { Droppable } from 'react-beautiful-dnd'

    <Droppable droppableId="droppable-1" type="PERSON">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
          {...provided.droppableProps}>
          <h2>I am a droppable!</h2>
          {provided.placeholder}
        </div>
      )}
    </Droppable>

React 16 新的 context API 也使用了这个模式。

    <Provider.Consumer>
      { ({title}) => <h1>Title: {title}</h1> }
    </Provider.Consumer>

render prop 模式与上面所讲基本相同，只不过将 children 属性用 render 属性替代。

    function TodoList({ todos, render }) {
      return (
        <section className='main-section'>
          <ul className='todo-list'>
          {
            todos.map((todo, i) =>
              <li key={i}>{ render(todo) }</li>
            )
          }
          </ul>
        </section>
      )
    }

    function App() {
      const todos = [...]
      const isCompeleted = todo=>todo.status === 'done'
      return (
        <TodoList
          todos={todos}
          render={
            todo => isCompleted(todo) ?
            <b>{ todo.label }</b> :
            todo.label
          }/>
      )
    }

这个属性也不一定要叫 render，其它也可以，比如 renderItem。

Ant Design 中 Table 组件使用了这种用法：

    class List extends React.Component {
      columns = [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'desc'
        },
        {
          title: '链接',
          dataIndex: 'url',
          render: value => <a href={value}>{value}</a>
        }
      ]
      ...
    }

## i18n

两种常用方案：

- [react-intl](https://github.com/formatjs/react-intl)
- [react-i18next & i18next](https://github.com/i18next/react-i18next)

react-intl 使用更简单，功能也更简单；react-i18next 是 i18next 的 react 封装，功能更强大，使用也复杂一些，比如支持动态加载语言包。

ant design 使用的是 react-intl 方案。

- [Ant Design 实战教程 - 国际化](https://www.yuque.com/ant-design/course/aut0sr)

ant design 里分 ant design 自身组件的国际化 (使用 LocaleProvider)，以及业务本身的国际化 (使用 react-intl & IntlProvider)。

### react-intl

示例：[dm-portal: add i18n support](https://github.com/pingcap/dm/pull/476)

首先在最顶层容器使用 IntlProvider。

```ts
const DmLayout: React.FC = ({ children }) => {
  const [locale, setLocale] = useState('en')

  return (
    <Container>
      <div className="change-locale">
        <Radio.Group
          value={locale}
          onChange={(e: any) => setLocale(e.target.value)}
        >
          <Radio.Button key="en" value={'en'}>
            English
          </Radio.Button>
          <Radio.Button key="zh" value={'zh'}>
            中文
          </Radio.Button>
        </Radio.Group>
      </div>
      <IntlProvider locale={locale} messages={getMessages(locale)}>
        {children}
      </IntlProvider>
    </Container>
  )
}
```

在 component 中使用 `useIntl()` hook / `formatMessage()` 方法 / FormattedMessage component 进行国际化。

```ts
...
import { FormattedMessage, useIntl } from 'react-intl'

function MyComponent(...) {
  const intl = useIntl()

  return (
    <Modal
      title={intl.formatMessage(
        { id: 'binlog_filter' },
        { target: targetItem.key }
      )}
      ...
    >
      <WaringText>
        <FormattedMessage id="binlog_modify_warning" />
      </WaringText>
      ...
    </Modal>
  )
}
```

### react-i18next / i18next

使用文档：

- [react-i18next](https://react.i18next.com/)
- [i18next](https://www.i18next.com/)

(其实我没太明白 react-i18next 存在的意义，感觉在 react 中直接用 i18next 也是可以的...)

使用：

1. 初始化: `i18n.init(...)`
1. 在子 component 中使用 `const {t, i18n} = useTranslations()` hook

react-i18next 不需要在顶层容器使用 Provider。(?? 好奇是如何做到的)

动态改变语言：`i18n.changeLanguage(lng)`

获取当前语言：`i18n.language`

示例，初始化：

```js
function init() {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {},
      defaultNS: 'defNS',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    })
}

function addTranslations(res) {
  for (const lng in res) {
    const lngIETF = lng.replace(/_/g, '-')
    i18next.addResourceBundle(lngIETF, 'defNS', res[lng], true, false)
  }
}

init()
```

在 component 中使用：

```ts
import { useTranslation } from 'react-i18next'

function StatisCard({ detail }: { detail: StatementDetailInfo }) {
  const { t, i18n } = useTranslation()

  return (
    <div className={styles.statement_statis}>
      <p>
        {t('statement.common.sum_latency')}:{' '}
        {getValueFormat('ns')(detail.sum_latency, 2, null)}
      </p>
      ...
    </div>
  )
}
```

## Suspense & React.lazy

- [精读《Suspense 改变开发方式》](https://github.com/dt-fe/weekly/blob/v2/143.%E7%B2%BE%E8%AF%BB%E3%80%8ASuspense%20%E6%94%B9%E5%8F%98%E5%BC%80%E5%8F%91%E6%96%B9%E5%BC%8F%E3%80%8B.md)
- [Suspense for Data Fetching (Experimental)](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)
- [深度理解 React Suspense](https://juejin.im/post/5c7d4a785188251b921f4e26)

TODO

> 在原文写作的时候，Suspense 仅能对 React.lazy 生效，但现在已经可以对任何异步状态生效了，只要符合 Pending 中 throw promise 的规则。

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')) // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

所以现在 Suspense 已经不再依赖 React.lazy，可以独立工作了。

> 之所以说 Suspense 开发方式改变了开发规则，是因为它做到了将异步的状态管理与 UI 组件分离，所有 UI 组件都无需关心 Pending 状态，而是当作同步去执行，这本身就是一个巨大的改变。

> 另外由于状态的分离，我们可以利用纯 UI 组件拼装任意粒度的 Pending 行为，以整个 App 作为一个大的 Suspense 作为兜底，这样 UI 彻底与异步解耦，哪里 Loading，什么范围内 Loading，完全由 Suspense 组合方式决定，这样的代码显然具备了更强的可拓展性。

## 代码分割

- [代码分割](https://zh-hans.reactjs.org/docs/code-splitting.html)

TODO

动态 import，React.lazy(), react-loadable

React.lazy() 加载的 component 必须放在 `<Suspense/>` 中。

## SWR - Hooks 取数据

- [精读《Hooks 取数 - swr 源码》](https://github.com/dt-fe/weekly/blob/v2/128.%E7%B2%BE%E8%AF%BB%E3%80%8AHooks%20%E5%8F%96%E6%95%B0%20-%20swr%20%E6%BA%90%E7%A0%81%E3%80%8B.md)
- [zeit/swr](https://github.com/zeit/swr)

## create-react-app / react-app-rewrite / customize-cra 配置

TODO，完整地看一下 create-react-app 的文档。
