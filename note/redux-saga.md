# Redux-Saga

2017/7/23

## Note 1

### 资料

1. [redux-saga 官方文档](https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html)

saga：传说，冒险。

redux-saga 用来管理 redux 应用异步操作，是 redux-thunk 的替代品。

### Introduction

#### Beginner Tutorial

第一个简单的例子，由于一开始看的是中文翻译 - [Redux-saga 中文文档](http://leonshi.com/redux-saga-in-chinese/index.html)，内容已经过时了，一些用法在最新的 saga 上已经发生了变化，因此示例代码怎么也跑不过，只好回去看官方文档，折腾了好久终于跑起来了。

总结一些变化：

1. Middleware 的使用

        // 原来
        const sagaMiddleware = createSagaMiddleware(helloSaga, watchIncrementAsync)
        const store = createStore(
          reducer,
          applyMiddleware(sagaMiddleware)
        )

        // 现在
        const sagaMiddleware = createSagaMiddleware()
        const store = createStore(
          reducer,
          applyMiddleware(sagaMiddleware)
        )
        sagaMiddleware.run(watchIncrementAsync)
        sagaMiddleware.run(helloSaga)
        // 上面 2 个 run 也可以用一个 run 替代，
        // rootSaga 在 sagas.js 中实现，实际就是聚合了 helloSaga 和 watchIncrementAsync
        // sagaMiddleware.run(rootSaga)

1. watchIncrementAsync 的实现用 yield，不用 `yield*` (这点不知道是不是中文翻译的笔误)

        export function* watchIncrementAsync() {
          console.log('watchIncrementAsync')
          // not yield*
          yield takeEvery('INCREMENT_ASYNC', incrementAsync)
        }

1. takeEvery 改成从 `redux-saga/effects` 中 import 了

Anyway，之后就以官方文档为准，不管中文翻译了。

从这个简单的计数器的例子，已经大致能够理解 saga 的原理和使用方法了。(前提是我已经对 redux / redux-thunk / generator 已经比较熟悉了)。

再贴一下核心代码做一下解释：

    // worker saga，异步执行 increment 任务
    export function* incrementAsync() {
      console.log('incrementAsync')
      yield delay(1000)
      yield put({type: 'INCREMENT'})
    }

    export function* watchIncrementAsync() {
      console.log('watchIncrementAsync')
      // not yield*
      yield takeEvery('INCREMENT_ASYNC', incrementAsync)
    }

watchIncrementAsync 这个函数的作用是为 `INCREMENT_ASYNC` 这种 type 的 action 指定 handler，这个 handler 就是 incrementAsync，当 app 发出 `INCREMENT_ASYNC`，watchIncrementAsync 就是调用 incrementAsync 来处理这个 action。

在 incrementAsync 函数中，用 `yield delay(1000)` 先停止 1 秒钟，然后再发现一个 type 为 `INCREMENT` 的同步 action。

疑问：如果发现的异步 action 中含有 data 部分，该怎么传给 handler?

##### Making our code testable

为了方便测试，引出了 call 的用法。

    export function* incrementAsync() {
      console.log('incrementAsync')
      // yield delay(1000)
      yield call(delay, 1000)         // => { CALL: {fn: delay, args: [1000]} }
      yield put({type: 'INCREMENT'})  // => { PUT: {type: 'INCREMENT'} }
    }

用 `yield call(delay, 1000)` 替代 `yield delay(1000)` 的作用是什么呢。前者，`call(delay, 1000)` 生成的是一个 Plain Object，原始数据对象，只有数据，没有方法。它的值如上面的注释所示：

    { CALL: {fn: delay, args: [1000]} }

put 生成的也是 Plain Object，值为：

    { PUT: { type: 'INCREMENT' } }

当 saga 中间件接收到这样的值后，检测如果有 CALL 字段，那么就执行相应的方法，如果有 PUT 字段，则 dispatch 相应的 action。

这样，call / put 变成了同步操作，得到了立即返回的 plain object，这种的操作最好测试了，不是吗？

    test('incrementAsync Saga test', assert => {
      const gen = incrementAsync()

      assert.deepEqual(
        gen.next().value,
        call(delay, 1000),
        'incrementAsync Saga must call delay(1000)'
      )
      ...

(哎，妈呀，我怎么感觉是为了测试，就把简单问题复杂化了呢，徒增无用的中间环节)。

### Basic Conecpts

#### Using Saga Helpers

takeEvery, takeLatest 的用法。

takeEvery，同一时间允许多个 task 执行。takeLatest，同一时间只允许最新的一个执行，如果之前的还在执行中，将会被 cancel 掉。

#### Declarative Effects

这一小节的内容和上面讲测试的内容基本意思一样。所谓的 Effects 就是用 put / call 生成的 Plain Object。

    const products = yield call(Api.fetch, '/products')

    // Effect -> call the function Api.fetch with `./products` as argument
    {
      CALL: {
        fn: Api.fetch,
        args: ['./products']
      }
    }

所有用来生成 Effetcs 的方法都放在 `redux-saga/effects` 包里。

#### Dispatching actions to the store

在 generator 方法中用 `yield put({ type: xxx })` 替代直接调用 `dispatch({ type: xxx })`，好像还是为了方便测试。

#### Error handling

`try...catch`

### Advanced

#### Pulling future actions

这一小节的内容有点酷。用 `take` 来控制流程。

    import { select, take } from 'redux-saga/effects'

    function* watchAndLog() {
      while (true) {
        const action = yield take('*')
        const state = yield select()

        console.log('action', action)
        console.log('state after', state)
      }
    }

注意，在 generator 函数中，`while(true)` 并不是导致死循环，因为 generator 函数不是 run-to-completion 的行为，而是 run-stop-restart 的行为。

注意标题中的 `Pull` 是怎么来的：

> In the case of `take` the control is inverted. Instead of the actions being *pushed* to the handler tasks, the Saga is *pulling* the action by itself. It looks as if the Saga is performing a normal function call `action = getNextAction()` which will resolve when the action is dispatched.

> This inversion of control allows us to implement control flows that are non-trivial to do with the traditional push approach.

一个例子，用 take 可以做其它不能做的事情：

    function* watchFirstThreeTodosCreation() {
      for (let i = 0; i < 3; i++) {
        const action = yield take('TODO_CREATED')
      }
      yield put({type: 'SHOW_CONGRATULATION'})
    }

把 `LOGIN` 和 `LOGOUT` 的逻辑写在一起，不用分开写：

    function* loginFlow() {
      while (true) {
        yield take('LOGIN')
        // ... perform the login logic
        yield take('LOGOUT')
        // ... perform the logout logic
      }
    }

上面这个例子有限制，LOGIN 必须发生在 LOGOUT 之前，所以才叫 Flow 啊。
