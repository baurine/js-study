import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects'

export function* helloSaga() {
  console.log('Hello Sagas!')
}

// 工具函数，延迟 n 毫秒，新的 saga 已集成了 delay 方法，可以直接用
// export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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

export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}
