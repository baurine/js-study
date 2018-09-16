# Dva.js Note

2018/9/15

通过 Dva.js 的学习的使用，终于理解了 redux-saga 的精髓，从此抛弃了 redux-thunk。

redux-thunk 和 redux-saga 的区别：

使用 redux-thunk 时，dispatch 出来的 action 有两种，一种是函数，一种是 plain object，前者对应的是异步 action，后者是同步 action。当中间件 (即 redux-thunk) 检测到发出来的 action 是函数，则执行此函数，且不再交给 reducer 处理，如果检测到是 plain object，则交给下一步的 reducer 处理。

函数型 action，一般是执行异步网络请求，在请求前，会 dispatch 一个表示请求要开始的同步 action，然后再进行异步网络请求，请求成功，则 dispatch 一个结果为 success 的同步 action，如果失败，则 dispatch 一个结果为 fail 的同步 action。

而在 redux-saga 中，dispatch 出来的永远都是 plain object，即不会 dispatch 函数。所有 action 都会从 redux-saga 经过，redux-saga 可以选择监听并处理它感兴趣的 action (通过指定 type)，如果监听接收到这些特定 type 的 action，它就会额外启动一个函数来处理它，这些 action 仍然会继续传递给 reducer 处理。

这样，redux-saga 形成了一种统一。

redux-saga 的一个小问题是，一般来说，redux-saga 要处理的 action，交给 reducer 以后，没有 reducer 会处理这类 action，dispatch 的 action，要么只有 redux-saga 关心，要么只有 reducer 关心，但实际都会在 redux-saga 和 reducer 中循环一次，造成了多余的遍历，但真的不是大问题。

而且如果你用 dva 的话，其实 dva 用了一些优化，即 reudx-saga 处理过的 action，不会再交给 reducer 处理。

dva 的好处：

不用 dva 的话，dispatch 一个 action，一般要修改好几个文件，就我而言，要修改 types 文件，增加新的 type 并导出，修改 action，修改 reducer ... 烦。

使用 dva 后，这些修改都会集中在一个 model 文件中，清爽。

## 在已有项目中集成 dva

dva 的官方文档都是用 dva-cli 新建一个项目开始的，如果我已经有一个项目了，想把 dva 集成进来怎么办呢，直接 npm install dva 就行。

    $ npm install dva

dva 内部集成了 react-router，如果我不需要 router，或者说我自己实现了 router，又或者说我用的是 reach-router，那怎么办呢，那我们应该用 dva-no-router 包，而不是 dva。

    $ npm install dva-no-router

示例：

    // index.tsx
    import * as React from 'react'

    import dva from 'dva-no-router'
    import createLoading from 'dva-loading'

    // models
    import posts from '../models/posts'

    import MyApp from './MyApp'

    const handleError = (e: Error) => {
      console.error(e.message)
    }

    // 1. init dva instance
    import { createLogger } from 'redux-logger'  // for debug
    const app = dva({
      onError: handleError,
      onAction: createLogger(),  // for debug
    })

    // 2. plugins
    // loading example: https://github.com/sorrycc/blog/issues/18
    app.use(createLoading())

    // 3. model
    app.model(posts)

    // 4. router
    app.router(() => <MyApp/>)

    // 5. start
    app.start('#root')

## dva subscriptions 的使用

一般是用来注册监听一些全局事件，方法名任意，参数格式是固定的。可以在一个方法中监听多个事件，也可以拆成多个方法，每个方法监听一个事件。

示例，在 APP 启动时监听 "NEW_NOTIFICATION" 的自定义事件，监听到后取出 notification 对象，再 dispatch 一个同步 action 交给 reducer 处理，修改 state。("NEW_NOTIFICATION" 是 WebSocket 监听到服务端发来的新消息后发送的事件。)

    const notifications: Model = {
      namespace: 'notifications',

      state: {
        page: 0,

        list: [],
      },

      effects: {
        *fetch({ payload }, { put, call, select }) {
          ...
        }
      },

      reducers: {
        save(state, { payload }) {
          return {
            ...state,

            [...state.list, payload.notification]
          }
        }
      },

      subscriptions: {
        receive({dispatch}: {dispatch: any}) {
          window.addEventListener('NEW_NOTIFICATION', (event) => {
            console.log('haha - notification', event)
            dispatch({
              type: 'save',
              payload: {
                notification: event.detail
              }
            })
          })
        }
      }
    }

## 在 effect 中如何获取 state 的值

通过 select effect，以上面 notifications model 为值，如果我想在 `*fetch` 中得到 page 的值。

      effects: {
        *fetch({ payload }, { put, call, select }) {
          const { page } = yield select((state: any) => state.notifications)
          ...
        }
      },

注意，时刻不要忘了在前面加上 yield。

## dva 2.0 中 dispatch 返回 promise

dva 2.0 这个特性特别好用。

示例：

    addComment = () => {
      ...

      this.setState({replying: true})
      dispatch({
        type: 'comments/create',
        payload: {
          content,
          postId
        }
      }).then((res: any) => {
        this.setState({replying: false})
        if (res.data) {
          this.setState({showSuccessDialog: true})
        }
      })
    }

注意，要在 "comments/create" effect 中把 response return 回去，这样，在上面的 `then()` 中才能接收到此 response 参数。

    *create({ payload }, { put, call }) {
      const { content, postId } = payload
      const res = yield call(createComment, content, postId)
      if (res.data) {
        yield put({
          type: 'add',
          payload: {
            comment: res.data
          }
        })
      }
      return res
    }
