# React Misc

- React in Patterns (React 模式) 一书笔记

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
