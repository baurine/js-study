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

(saga 内部对通过 `yield call(deplay, 1000)` 得到的值，即 `gen.next().value` 进行处理，saga 实际是一种 generator 的调度器，是特殊调度器，不是通用调度器。所谓通用调度器，就是直接把上一个 `gen.next().value` 作为参数传到下一个 `gen.next()` 方法中)

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

#### Non-blocking calls

这一章讲的是用 fork 替代 call，实现 yield 的非阻塞操作 (?? 越来越绕了...)

就以上面那个例子为例，我们说道，它有限制，LOGIN 必须发生在 LOGOUT 之前，如果 LOGOUT 发生在 LOGIN 之前，那么这个事件就丢失了。因为第一个 take 阻塞住了第二个 take。如果没有等到 LOGIN，就永远停在第一个 yield 那里。

复杂一点的例子：

    function* authorize(user, password) {
      try {
        const token = yield call(Api.authorize, user, password)
        yield put({type: 'LOGIN_SUCCESS', token})
        return token
      } catch(error) {
        yield put({type: 'LOGIN_ERROR', error})
      }
    }

    function* loginFlow() {
      while (true) {
        const {user, password} = yield take('LOGIN_REQUEST')
        const token = yield call(authorize, user, password)  // !!! 如果在 authorize 期间发出了 LOGOUT action，后面的 yield 将不会执行
        if (token) {
          yield call(Api.storeItem, {token})
          yield take('LOGOUT')
          yield call(Api.clearItem, 'token')
        }
      }
    }

正如上面的注释所言，如果在 authorize 还没有返回之前，app 发出了 LOGOUT action，后面的 yield 因为被前面的 yield 阻塞住了，所以执行不到，导致逻辑就完全乱了。

因为 call 是阻塞的，解决办法是换成 fork，fork 是非阻塞的，但换成 fork 后，等号左边就不再是 token 了，是什么呢，后面会说，是一个 task。

(Shit! 我现在觉得写 generator 函数完全颠覆了传统思维，首先，执行逻辑变了，return 意义变了，更重要的是，= 两边不是赋值的关系了，等号左边的值不是由右边决定的，而是由 `next(x)` 传进来的值决定的，现在突然觉得这有点让人难以接受。看到一个带 yield 的表达式，你都没法确切地知道等号左边到底该得到个啥值了，甚至是什么类型的值，因为你不知道 `next(x)` 里的 x 是啥玩意。)

然后换成了 fork 后又带了一堆屁事，各种补救，最后差不多是这个样子：

    function* authorize(user, password) {
      try {
        const token = yield call(Api.authorize, user, password)
        yield put({type: 'LOGIN_SUCCESS', token})
        yield call(Api.storeItem, {token})
        return token
      } catch(error) {
        yield put({type: 'LOGIN_ERROR', error})
      } finally {
        if (yield cancelled()) {
          // ... put special cancellation handling code here
        }
      }
    }

    function* loginFlow() {
      while (true) {
        const {user, password} = yield take('LOGIN_REQUEST')
        // fork return a Task object
        const task = yield fork(authorize, user, password)
        const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
        if (action.type === 'LOGOUT')
          yield cancel(task)
        yield call(Api.clearItem, 'token')
      }
    }

反正我是不会这么写的。

#### Running Tasks In Parallel

    // wrong, effects will be executed in sequence
    const users  = yield call(fetch, '/users'),
          repos = yield call(fetch, '/repos')

    // correct, effects will get executed in parallel
    const [users, repos]  = yield all([
      call(fetch, '/users'),
      call(fetch, '/repos')
    ])

类似 Promise.all()

#### Starting a race between multiple Effects

类似 Promise.race()，这里也是用 race。而且这里的 race，失败的 task 会自动取消。

简单的例子：

    function* fetchPostsWithTimeout() {
      const {posts, timeout} = yield race({
        posts: call(fetchApi, '/posts'),
        timeout: call(delay, 1000)
      })

      if (posts)
        put({type: 'POSTS_RECEIVED', posts})
      else
        put({type: 'TIMEOUT_ERROR'})
    }

一个使用场景，用一个按钮取消一个后台一直执行的任务：

    function* backgroundTask() {
      while (true) { ... }
    }

    function* watchStartBackgroundTask() {
      while (true) {
        yield take('START_BACKGROUND_TASK')
        yield race({
          task: call(backgroundTask),
          cancel: take('CANCEL_TASK')
        })
      }
    }

当接收到 `START_BACKGROUND_TASK` action 后，backgroundTask 和 `take(CANCEL_TASK)` 同时执行，如果 `CANCEL_TASK` action 发出，cancel 任务执行，并自动取消 backgroundTask 的执行。好玩，有意思。

#### Sequencing Sagas via `yield*`

    function* playLevelOne() { ... }
    function* playLevelTwo() { ... }
    function* playLevelThree() { ... }

    function* game() {
      const score1 = yield* playLevelOne()
      yield put(showScore(score1))

      const score2 = yield* playLevelTwo()
      yield put(showScore(score2))

      const score3 = yield* playLevelThree()
      yield put(showScore(score3))
    }

> Note that using yield* will cause the JavaScript runtime to spread the whole sequence. The resulting iterator (from game()) will yield all values from the nested iterators. A more powerful alternative is to use the more generic middleware composition mechanism.

这段话的意思是，`yield*` 不是代理，是展开?? shit，就跟 es6 的 `...rest` 的用法一样??

#### Composing Sagas

好像大致意思是说，用 `yield*` 有一些缺点有限制，还是用 `yield` 好。

#### Task cancellation

没什么新内容，只是说，取消了一个 task 后，会向下传递，task 里 yield 的 subtask 也会被连着取消，这个很好理解，觉得是理所当然的事。

#### redux-saga's fork model

- fork is used to create attached forks
- spawn is used to create detached forks

但这小节没怎么说 spawn。顾名思议，attach forks，意味着 task 和 parent 还有关联，而 detached forks 意味着 task 和 parent 没有关联了，放飞自我了。

    function* fetchAll() {
      const task1 = yield fork(fetchResource, 'users')
      const task2 = yield fork(fetchResource, 'comments')
      yield call(delay, 1000)
    }

    function* fetchResource(resource) {
      const {data} = yield call(api.fetch, resource)
      yield put(receiveData(data))
    }

    function* main() {
      yield call(fetchAll)
    }

这个例子用来说明，在 1 秒之后，即 `yield call(delay, 1000)` 执行完后，如果 taks1 和 task2 还没执行完，main() 函数是不会结束的。只有等 task1，task2，delay 都执行完了，main() 才会结束。因此，上面的 fetchAll 相当于：

    yield all([
      call(fetchResource, 'users'),
      call(fetchResource, 'comments'),
      call(delay, 1000)
    ])

#### Concurrency

这一小节描述了 takeEvery 和 takeLatest 的底层实现，果然是用 fork 实现的，难怪前面的内容一直说 takeEvery 会 fork 出一个 task 来执行。

    const takeEvery = (pattern, saga, ...args) => fork(function*() {
      while (true) {
        const action = yield take(pattern)
        yield fork(saga, ...args.concat(action))
      }
    })

    const takeLatest = (pattern, saga, ...args) => fork(function*() {
      let lastTask
      while (true) {
        const action = yield take(pattern)
        if (lastTask) {
          yield cancel(lastTask) // cancel is no-op if the task has already terminated
        }
        lastTask = yield fork(saga, ...args.concat(action))
      }
    })

这里的 fork 的底层又是怎么实现的呢，好奇?

#### Testing Sagas

略，前面已讲过。

#### Connecting Sagas to external Input/Output

略，暂时不需要。

#### Using Channels

这一小节的内容有点高级，但也大致明白了它们的作用。有三种 channel，分别是 actionChannel，eventChannel，channel。

actionChannel，用于缓存接收的消息，相当于一个消息队列。然后后面的 task 不断地从这个列队中取消息进行处理。

    function* watchRequests() {
      while (true) {
        const {payload} = yield take('REQUEST')
        yield fork(handleRequest, payload)
      }
    }

    function* handleRequest(payload) { ... }

上面这是经典的 watch-and-fork 模式，如果多个 REQUEST 发出，那么会有多个 handleRequest 同时运行。

而 actionChannel 可以让这些消息的处理串行化。

    function* watchRequests() {
      // 1- Create a channel for request actions
      const requestChan = yield actionChannel('REQUEST') // 所有发出的 REQUEST 消息都会先缓存到 requestChan 中
      while (true) {
        // 2- take from the channel
        const {payload} = yield take(requestChan)
        // 3- Note that we're using a blocking call
        yield call(handleRequest, payload)
      }
    }

而 eventChannel 呢，一般来说，take 只从 redux store 中取消息，而 eventChannel 则是生成了一个 event source，它不断地向外发消息，而 take 也可以从这个 eventChannel 中获取消息。

    import { eventChannel, END } from 'redux-saga'

    // creates an event Channel from an interval of seconds
    function countdown(secs) {
      return eventChannel(emitter => {
          const iv = setInterval(() => {
            secs -= 1
            if (secs > 0) {
              emitter(secs)
            } else {
              // this causes the channel to close
              emitter(END)
            }
          }, 1000);
          // The subscriber must return an unsubscribe function
          return () => {
            clearInterval(iv)
          } // !!! 这个部分很有意思，反注册的实现，和 redux 中的某个实现是一样的
        }
      )
    }

    export function* saga() {
      const chan = yield call(countdown, value)
      try {    
        while (true) {
          // take(END) will cause the saga to terminate by jumping to the finally block
          let seconds = yield take(chan)  // !!! 此时，take 从 eventChannel 中取消息，而不再是 redux store
          console.log(`countdown: ${seconds}`)
        }
      } finally {
        console.log('countdown terminated')
      }
    }

最后一种就叫 channel，描述说是用来在 sagas 间通信的，从例子来看，是这么个原理，一个 saga 从 redux store 中取到某个消息，然后放入这个 channel 中，然后有多个其它 saga 从这个 channel 取消息去处理，有点生产者-消费者模型，但这里有多个消费者。

    import { channel } from 'redux-saga'
    import { take, fork, ... } from 'redux-saga/effects'

    function* watchRequests() {
      // create a channel to queue incoming requests
      const chan = yield call(channel)

      // create 3 worker 'threads'
      for (var i = 0; i < 3; i++) {
        yield fork(handleRequest, chan)
      }

      while (true) {
        const {payload} = yield take('REQUEST')
        yield put(chan, payload)  // !!! 放入 channel，让 worker 去处理
      }
    }

    function* handleRequest(chan) {
      while (true) {
        const payload = yield take(chan) // !!! worker 从 channel 中取消息，处理
        // process the request
      }
    }

### Recipes

Throttle / Debounce / Retry / Undo

DONE!

## Note 2

在学习 dva 的过程中，对 redux-saga 有了新的认识，看 [dva note](./dva.md)。

## Note 3

- [Async React with Redux Saga](https://egghead.io/courses/async-react-with-redux-saga)

call/fork/spawn，都是用来调用另一个函数，但有一些区别：

1. call 是阻塞的，它要等待返回值，返回值返回来才继续执行
1. fork 是非阻塞的，不用等到返回值就可以继续执行，但是最终还是要待到 fork 执行完了整个 generator 函数才可以退出
1. spawn 是非阻塞的，但它和 fork 不一样的地方在于，它生成的 task 和 parent 是 detach 的，它有没有执行完，整个 generator 函数都可以退出

select effect 是用来从 state 中取值的。

可以用 throttle effect 消除抖动。

    yield throttle(500, 'INPUT_CHANGE', handleInput)

actionChannel 可以很方便地用来实现生产者-消费者模型。
