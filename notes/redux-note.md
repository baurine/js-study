# Redux Note

Time: 2016/5/30

## Refrences

- [Redux 中文文档](http://cn.redux.js.org/)
- [Redux Tutorial 中文翻译](https://github.com/react-guide/redux-tutorial-cn)
- [Dan Abramov - Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Dan Abramov - Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

## Note

### Dan Abramov - Getting Started with Redux

[Dan Abramov - Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)

Dan Abramov 制作的 Redux & React 的初级教程。

#### 第 1 - 21 集

reducer:

    const counter = (state = 0, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return state+1;
        case 'DECREMENT':
          return state-1;
        default:
          return state;
      }
    }

createStore(reducer) 的简易实现版：

    // const { createStore } = Redux;

    const createStore = (reducer) => {
      let state;
      let listeners = [];

      const getState = ()=> state;

      const dispatch = (action)=>{
        state = reducer(state, action);
        listeners.forEach(listener=>listener())
      }

      const subscribe = (listener)=>{
        listeners.push(listener);
        return ()=>{
          listeners = listeners.filter(l!=listener);
        }
      }

      dispatch({})

      return {getState, dispatch, subscribe}
    }

(再这么 JS 写下去，还能回去写 Java 吗)

    const Counter = ({value}) => (
      <div>
        <h1>{value}</h1>
      </div>
    );
    // 这是啥用法? () => ()，箭头函数的简写，省略了 return

简易完整实现：

    const { createStore } = Redux;

    const store = createStore(counter);

    console.log(store.getState());

    const Counter = ({
      value,
      onIncrement,
      onDecrement
    }) => (
      <div>
        <h1>{value}</h1>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
      </div>
    );

    const render = () => {
      ReactDOM.render(
        <Counter 
          value={store.getState()}
          onIncrement={()=>{
                       store.dispatch({type:'INCREMENT'})
                      }}
          onDecrement={()=>{
                       store.dispatch({type:'DECREMENT'})
                      }}
        />,
        document.getElementById('root')
      );
    }

    store.subscribe(render);

    render();

从 Redux 作者身上看到了一种强大的代码抽象能力!

combineReducer 是怎么实现的这一部分，让我体会到 JS 是多么的博大精深，shit~!

#### 第 22 集

这一集是关键。是 FilterLink 进一步重构，重构出一个只用于展示的 Link 和真正的 controller & contanier FilterLink。

这个 FilterLink 相当于 connect(Link) 的组件。

重构后的 FilterLink 通过 store.subscribe() 向 store 注册监听，并通过 store.getState() 从 store 读取数据。并通过 store.dispatch() 发送 action。

所有和 store 相关的操作都在 controller 这一层。

这就是 Redux 中 connect 方法的作用。

让每个 view 直接从 store 中关注特定的某个数据，省去了 state 的层层传递。cool~!

所以，可以推断出，将来导出的组件，必然都是 connect 过的组件。

连接型组件。作者管它叫 Container Component

#### 第 23 集

继续分离 Container Component 和 Presenter Component。

哦，MVP，no no no，不一样，这时的 Present 层就是单层的展示层，和 MVP 中的 P 不是一个意思，MVP 中的 P 相当于这里的 Container Component，而 V 才相当于 Presenter Component。

### 第 25 集

如何实现 Provider，如何使用 Context。

但是例子的代码并不能真正运行... 可以工作，不知道哪里写错了，自己半天也没看出来，删了重写就好了。

#### 第 26 集

用 react-redux 库的 Provider 替代自己的实现。

#### 第 27 集

用 react-redux 库的 connect 替代自己的 container component 的实现。

#### 第 28 集

演示 connect()(componet) 的用法。

看了 Dan 的视频教程，为其美妙的代码惊叹不已，好想翻译成中文。

js 真是一门奇妙的语言。

语言这东西，真的是不能只是看，不动手练就很难真的去理解。

Redux，如此短小精悍，让人惊叹。

---

### Dan Abramov - Building React Applications with Idiomatic Redux

Time: 2016/6/17

[Dan Abramov - Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

Dan Abramov 制作的 Redux & React 的高级教程。

#### 第 1 课

进一步简化函数的写法

    const addTodo = (id, text) => {
      return {
        id,
        text,
        completed: false
      }
    }

在函数执行体简单的 return 回了一个对象，完全可以省略这个 return

    const addTodo = (id, text) => ({
      id,
      text,
      completed: false
    })

    const mapDispatchToProps = (dispatch) =>  ({
      onTodoClick(id) {
        dispatch(toggleTodo(id))
      },
    })

#### 第 2 课

在 createStore 时提供初始数据

    const store = createStore(todoApp, persistedState);
    console.log(store.getState());

#### 第 3 课

在初始化 store 时，从 localStorage 中读取之前存储的数据作为初始化数据。

然后用 `store.subscribe(()=>saveState())` 监听 store 的变化，变化时更新本地数据。

为了避免更新太过频繁，使用 lodash 的库的 throttle() 方法，控制频率。

使用 node-uuid 替代 id

#### 第 4 课

重构入口，将 store 的创建抽取出来，变成 configureStore()

    // 伪代码写法
    class Root = {
      <Provider store={configureStore()}>
        <App/>
      </Provider>
    }

#### 第 5 课

使用 React Router

    import { Router, Route, browserHistory } from 'react-router'

    Root =
      <Provider store={store}>
        <Router history={browerHistory}>
          <Route path='/' component={App} />
        </Router>
      </Provider>

#### 第 6 课

使用 react-router 的 Link 替代之前写的 Link，并且点击后不再 dispatch(action)，而是跳转链接。

    // root
    <Router history={browerHistory}>
      <Route path='/(:filter)' component={App} />
    </Router>

    // FilterLink
    import { Link} from 'react-router'
    const FilterLink = ({ filter, childer }) => ({
      <Link
        to={filter==='all' : '' : filter}
        activeStyle={{textDecoration: 'none', color:'black'}}>
        {children}
      </Link>
    })

#### 第 7 课 - Filtering Redux State with React Router Params

因为 js 代码自己处理了 route，后端代码就不需要再处理路由了... 明白。

路径上的参数以 { params } 变量名传递给 component

    App = ({ params }) => (
      <div>
        <VisibleTodoList filter={params.filter || 'all'} />
        ...
      </div>
    )

#### 第 8 课 - Using withRouter() to Inject the Params into Connected Components

使用 react-router 的  withRouter() 方法，替代 params 的层层传递，和 connect 的作用相同。

    VisibleTodoList = withRouter(connect(
      mapStateToProps,
      actions)(VisibleTodoList));

#### 第 9 课 - Using mapDispatchToProps() Shorthand Notation

    const VisibleTodoList = withRouter(connect(
      mapStateToProps,
      // mapDispatchToProps,
      { onTodoClick: toggleTodo }
    )(TodoList));

#### 第 10 课 - Colocating Selectors with Reducers

cool~! understand.

意思是说，要把 selector 和相应的 reducer 放在一起，用来避免一些轻量的耦合。

然后在定义 rootReducer 的地方对这个 selector 再做一次代理，

然后在 Component 中应该使用这个代理 selector，而非直接使用原来的 selector。(看代码就能明白了)

#### 第 11 课 - Normalizing the State Shape

没有特别明白，好像只是调整了 state 中 TodoList 的结构。

#### 第 12 课 - Wrapping dispatch() to Log Actions

cool~! 展示了 createLogger() 的实现原理。原来如此。一种 Hook。

    if (process.env.NODE_EVN !== 'production') {
      store.dispatch = addLoggingToDispatch(store)
    }

    const addLogginToDispatch = (store) => {
      const rawDispatch = store.dispatch

      return (action) => {
        console.group(action.type)
        console.log("pre state:", store.getState())
        const returnValue = rawDispatch(action)
        console.log("next state", store.getState())
        console.groupEnd(action.type)
        return returnValue
      }
    }

#### 第 13 课 - Adding a Fake Backend to the Project

如何用 promise 来 fake api，提供了一种 fake 思路。

#### 第 14 课

在 componentDidMount() 和 componentDidUpdate() 生命周期中调用 fetchTodos() api。

#### 第 15 课

进一步抽象...

进一步简化 mapDispatchToProps 的写法

    import * as actions from '../actions'

    VisibleTodoList = withRouter(connect(
      mapStateToProps,
      actions
    ))(VisbileTodoList);

    // VisibleTodoList
    render() {
      const { toggleTodo, ...rest } = this.props;
      return (
        <TodoList
          {...rest}
          onTodoClick={toggleTodo}
        />
      );
    }

我明白这一课的意义了，这一课讲的是，如何在不使用中间件的情况下，使用异步 api 去网络获取数据。这一部分逻辑应该放在 componentDidMount() 和 componentDidUpdate() 生命周期中。在得到了 response 后，将结果 dispatch() 到 store 中，更新 store 中的 state，从而更新 view。

这一课是演示如果进化到使用中间件来替代这一步操作的过程。

#### 第 16 课

明白是明白了，但我觉得作者这一小节讲得太仓促了，忽略了很多细节。

这一课，逐步演示如何将 15 课的异步操作逻辑从 component 移动到 action 中。

首先，在 action 中定义 fetchTodos(filter)

    export const fetchTodos = (filter) =>
      api().fetch(filter).then(response=>
        receiveTodos(filter, response);

然后，在 component 中调用 fetchTodos(filter)，但请注意！这正是这一小课没有讲清楚的地方 (也或许是我没听清作者的讲解)，在 compoent 中调用 fetchTodos(filter)，实际调用的是 dispatch(fetchTodos(filter))。

但由于 dispatch() 的参数必须是一个 plain object，而不能是一个 promise，所以才需要 addPromiseSupport()

    const addPromiseSupport = (store) => {
      const rawDispatch = store.dispatch
      store.dispatch = (action) => {
        if (typeof action.then === 'function') {
          action.then(rawDispatch);
        } else {
          rawDispatch(action);
        }
      }

#### 第 17 课

这一课很炫啊，抽象中间件。

    // configureStore.js
    const middleWares = [promise]
    if (process.env.NODE_ENV !== ‘production’) {
      middlewars.push(logger)
    }

    wrapDispatchWithMiddlewares(store, middlewares)

    const wrapDispatchWithMiddlewares = (store, middlewares) => {
      middlewares.slice().reverse().forEach(middleware=>{
        store.dispatch = middleware(store)(store.dispatch)
      }
    }

    const promise = (store) => (next) => (action) => {
      if (typeof action.then === 'function') {
        return action.then(next);
      }
      return next(action);
    }

所以说，我觉得评价一个人的编码水平，抽象能力是一个很重要的方面。

#### 第 18 课

用库来替代手动实现的 middleware

    import promise from 'redux-promise'
    import createLogger from 'redux-logger'

    const configureStore = () => {
      const middlewares = [promise]
      if (process.env.NODE_ENV !== ‘production’) {
        middlewares.push(createLogger())
      }

      return createStore(
        todoApp,
        applyMIddleware(…middlewares)
      )
    }

#### 第 19 课 - Updating the State with the Fetched Data

这一课主要是讲 todos 的 reducers 的设计

#### 第 20 课 - Refactoring the Reducers

进一步抽取重复代码

#### 第 21 课 - Displaying Loading Indicators

进一步演示如何在 reducer 中写 selector

reducer 中不仅有 reducer，还有 selector

#### 第 22 课 - Dispatching Actions Asynchronously with Thunks

重要的一课，thunk 的原理，怎么来的，由 promise 进化到 thunk。

thunk action 返回的是一个函数，可以同时进行同步和异步操作，组合多个操作。

而 promise action 返回的是一个 promise，只可以进行异步操作。

thunk 可以处理更复杂的操作。

    // promise action
    export const fetchTodos = (filter) =>
      api().fetch(filter).then(response=>
        receiveTodos(filter, response);

    // thunk action
    export const fetchTodos = (filter) => (dispatch) => {
      dispatch(requestTodos(filter));   // 同步

      return api().fetch(filter).then( res =>
        receiveTodos(filter, res);      // 异步
    }

    // thunk midllware
    const thunk = (store) => (next) => (action) =>
      typeof action === 'function' ?
        action(next) :
        next(action);
    // 啧啧，如此美妙！

#### 第 23 课 - Avoiding Race Conditions with Thunks

1. 避免竞争冒险，方法是请求之前，判断当前是否正在请求，如果在请求，则直接返回，很常见的做法；
1. 用 redux-thunk 库替代手写的 thunk 实现
1. thunk action 约定返回一个函数，这个函数的返回值 promise 对象。这样在 Component 中可以继续链式处理。

#### 第 24 课 - Displaying Error Messages

捕捉网络错误并显示错误信息

#### 第 25 课 - Creating Data on the Server

允许添加 Todo

#### 第 26 课

We will learn how to use normalizr to convert all API responses to a normalized format so that we can simplify the reducers.

这一课没怎么懂，不知道  [normalizr](http://www.jscon.cc/redux-normalizr/) 是干嘛用的。

#### 第 27 课 - Updating Data on the Server

让 ToggleTodo works! 明白。

DONE~!

---

### 其它

自从开始学习 React 后，接触了一堆新的编程思想，各种新的概念和编程思想铺面而来，简直了。感谢 React，让我终于走上前端的正轨。

感悟，Redux 将客户端的所有数据都存在一个 store 中，这是不是有点像服务器端，单一数据源，把所有的数据都放在数据库里。而 Redux 就像是客户端的数据库。(看到后面，[文档](http://cn.redux.js.org/docs/basics/Reducers.html) 果然是这么说的，把应用的 state 想像成数据库。)

(想法，git 的实现就如同是纯函数的实现，改变文件后，输出的是一个新的文件，而不会改变原来的文件。)

[中间件](https://github.com/react-guide/redux-tutorial-cn/blob/master/09_middleware.js) 这一部分有点难理解。got!

中间件这一部分和 reactive programing 的 lazy run 有一些相似的地方。

[Middleware](http://cn.redux.js.org/docs/advanced/Middleware.html) 中 next 是什么，是 old dispatch (类似的实现)

    function logger(store) {
      // 这里的 next 必须指向前一个 middleware 返回的函数：
      let next = store.dispatch

      return function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
      }
    }
    ...

这正是 Redux middleware 的样子。

Middleware 接收了一个 next() 的 dispatch 函数，并返回一个 dispatch 函数，返回的函数会被作为下一个 middleware 的 next()，以此类推。由于 store 中类似 getState() 的方法依旧非常有用，我们将 store 作为顶层的参数，使得它可以在所有 middleware 中被使用。

[Reddit API](http://cn.redux.js.org/docs/advanced/ExampleRedditAPI.html) 这个例子很好。
