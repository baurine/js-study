import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import Counter from './Counter'
import reducer from './reducers'

import { helloSaga, watchIncrementAsync } from './sagas'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// don't use sagaMiddleware.run(helloSaga, watchIncrementAsync)
// sagaMiddleware.run(watchIncrementAsync)
// sagaMiddleware.run(helloSaga)
// 上面 2 个 run 也可以用一个 run 替代，
// rootSaga 在 sagas.js 中实现，实际就是聚合了 helloSaga 和 watchIncrementAsync
sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({type})

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrementAsync={() => action('INCREMENT_ASYNC')}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')} />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
