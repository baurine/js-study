# React Hooks

待补充完善。

react hooks 要求你对闭包的理解很深刻，否则理解起来会觉得困难，用起来也会遇到很多坑。

## 参考

- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)
- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)
- [How to fetch data with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data/)
- [Hooks, State, Closures, and useReducer](https://adamrackis.dev/state-and-use-reducer/)
- [【第 1645 期】useHooks 小窍门](https://mp.weixin.qq.com/s/fp-GNIcz5zwrikcM0648DQ) | [useHooks](https://usehooks.com/)

## Note

基础：

- useState
- useEffect
- useContext

高级：

- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue

useState 不多说了。

useEffect，和 useState 一样最常用，但也是最复杂，坑最多的用法，具体看 Dan 写的 [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)。

useEffect 在 layout/painted 之后 (即 render() --> DOM 更新之后) 触发，如果需要与 layout 同步触发，使用 useLayoutEffect (有没有例子?)。

useEffect 默认每次 render 后都会重新执行，为了提高性能，可以给它传递第二个参数 - deps 数组。如果 render 后 deps 数组没有变化，那么 useEffect 中的 fn 就不会再次执行。关键就是这是这个 deps 数组，如果设置错了，结果就有可能不符合预期。(而且有可能引起死循环)

deps 数组中可以包含方法。

useEffect 中执行的是具有副作用的操作，且一般是命令式的 (imperative)。(应该是只有 render 中是声明式 declarative 的吧)。

useContext 相当于 Context.Consumer 的简洁用法。

```js
const MyContext = createContext(null)

function MyComponent(props) {
  const value = useContext(MyContext)
  ...
}
```

### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialState, init)
```

setState/dispatch 是稳定的，不会在 re-render 时改变，所以这些方法不需要加入到 useEffect/useCallback 的 deps 中。

useReducer 在移除 useEffect 中的依赖时很有帮助，可以看这篇文章 - [Hooks, State, Closures, and useReducer](https://adamrackis.dev/state-and-use-reducer/)

### useCallback / useMemo

`useCallbakc(fn, deps)` 得到的是一个未执行，定义好的 callback (方法)，这个方法可以在合适的时候被我们调用，callback 可能会产生 side effect。

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

// TODO: 增加例子

`useMemo()` 得到的是已计算出的值，相当于 vue 的 computed，同步执行，不会产生 side effect，其计算出的值可以在 render 方法中使用 (其实 useMemo 中的方法是在 render 时被调用的，并没有并提交计算出来，这算是一种 lazy 模式)。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

// TODO: 增加例子

现在明白了，useCallback() 是用来缓存方法，useMemo() 是用来缓存变量，这样在每次 render() 时不会生成新的方法或值 (也取决于它们的依赖有没有变化)，如果有 useEffect 依赖这些方法或状态，则可以减少 render 的次数，提升性能。

- [【译】什么时候使用 useMemo 和 useCallback](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)

### useRef

useRef() 是一个可变的引用对象，组件的整个生命周期可随意改变和访问，但对它的修改不会引起 re-render。

基本上，useRef 像一个盒子，保存了一个可变的值在它的 `.currenty` 属性上，修改 `.current` 属性的值不会引起 re-render。相当于之前 class 中的实例成员。

如果想手动操作一个 DOM 节点，首先要获取它的引用，直接通过 ref 属性给它传递一个 useRef() 值，比如：

```ts
function TextInputWithFocusButton() {
  const inputEl = useRef(null)
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus()
  }
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  )
}
```

`<input ref={inputEl} />` 相当于把 input 这个 DOM node 绑定到了 inputEl.current 上。

React 中还有另外一个相似的 API: createRef()，这个 API 只能用于 class component，而 useRef() 只能用于 function component。

- [精读《useRef 与 createRef 的区别》](https://github.com/dt-fe/weekly/blob/v2/141.%E7%B2%BE%E8%AF%BB%E3%80%8AuseRef%20%E4%B8%8E%20createRef%20%E7%9A%84%E5%8C%BA%E5%88%AB%E3%80%8B.md)

### useImperativeHandle

useImperativeHandle (命令式，而非声明式的 handle)，和 useRef/forwardRef 配套使用，用于转发 ref handle。

使用场景：父组件需要调用子组件的方法，比如子组件中有 input，在父组件中需要 clear 或 focus 这个 input，这时就可以用上 useImperativeHandle。

官网文档里的例子：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

useImperativeHandle 中定义的方法可以被父组件调用。

### useLayoutEffect

上面解释了，和 useEffect 作用差不多，但场景不同

### useDebugValue

调试时使用，在 DevTools 中显示额外信息。

## 常见 Case

### How to get the previous props or state?

FAQ 中的 "How to get the previous props or state?"，现在理解了。

```javascript
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default function PreviousValue() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)
  return (
    <h1>
      Now: {count}, Previous: {prevCount}
      <button onClick={() => setCount(count + 1)}>Plus</button>
    </h1>
  )
}
```

一步一步来理解，首先执行 `const [count, setCount] = useState(0)`，此时 count 为初始值 0，接着执行 `const prevCount = usePrevious(0)`，因为 `useEffect(()=>{ref.current=value})` 在 render 之后执行，所以此时 ref.current 为初始值 undefined。初次 render 时，显示 `Now: 0, Previous:`。

render 执行完后会执行 useEffect 中定义的 `()=>{ref.current=value}`，所以此时 ref.current 变为 0。注意 ref 的变化不会引起 re-render。

点击 Plus 后，执行 `setCount(count + 1)` 触发 re-render，PreviousValue() 方法重新执行，第一步 `const [count, setCount] = useState(0)` 将拿到 count 的新值 1，`const prevCount = usePrevious(1)` 将拿到 ref.current，此时为 0，所以再次渲染时，显示 `Now: 1, Previous: 0`。

再次 render 后执行 `()=>{ref.current=value}`，此时的 value 为 1，所以 ref.current 变为 1。

依此类推。

所以，我们看到的 Now 值 (state.count)，在内存中此时也是这个值，它们始终保持一致，而 Previous 值 (ref.current)，当它显示完后，在内存中的值实际已经马上改变了，比如当我们在页面上看到它显示 3 时，实际在内存中它已经马上变成 4 了，显示的值和内存中的值不同步。

useEffect() 有点像 Go 中的 defer，在函数的最后执行。

---

useEffect 的性能优化问题，主要是如何避免声明 deps 数组出错。

方法一，尽可能将相关的方法在 useEffect 内部定义，而不是外部，以防止漏掉相关的 deps。

```js
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp)
    }

    doSomething()
  }, [someProp]) // OK (our effect only uses `someProp`)
}
```

其它方法，

1. 使用 setState(prevState => {...})
1. 使用 useReducer ...
1. 使用 useCallback ... (缓存住依赖的方法，这样每次 render 后这个依赖的方法不会被修改)

待续，FAQ 中总结了很多用法，很有价值。

### 在子 component 中修改 context

(但要小心引起死循环)

- [How to update React Context from inside a child component?](https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component)
- [在嵌套组件中更新 Context](https://zh-hans.reactjs.org/docs/context.html#updating-context-from-a-nested-component)

从一个在组件树中嵌套很深的组件中更新 context 是很有必要的。在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context。

比如：

```js
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
})
```

### useInterval

- [使用 React Hooks 声明 setInterval](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/)

结合了 useRef 和 useEffect 的使用示例。

实现：

```ts
// https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: null | number) {
  const savedCallback = useRef<() => void>(callback)

  // save new callback
  useEffect(() => {
    savedCallback.current = callback
  })

  // set interval
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      tick() // 我额外加的
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
```

根据上面的实现，如果想要消除 interval，只需要把 delay 设置为 null。所以，一个使用示例：

```ts
const [report, setReport] = useState<Report | undefined>(undefined)
const [stopInterval, setStopInterval] = useState(false)

// 轮循获取进度
useInterval(
  () => {
    async function fetchData() {
      try {
        const res = await fetchReport(id)
        setReport(res)
        if (res.progress >= 100) {
          // 进度到达 100% 后停止轮循
          setStopInterval(true)
        }
      } catch (error) {
        message.error(error.message)
      }
    }
    fetchData()
  },
  stopInterval ? null : 2000
)
```

Update:

如果一个组件内的 interval 是依赖于 state，那么需要这样做，因为不这样做，仅用常规的 useEffect()，每次 interval 都会修改 state，触发 re-render，从而引发 clear interval 和重新 set invterval，这并不是我们预期的行为，我们预期的是如果间隔时间固定，那么 interval 应该一直工作，直到 unmount 才会被 clear 掉。

如果只是依赖于 props，那么只需要按常规的做法，使用 useEffect() 就足够了。

### 使用自定义的 hook 抽取复杂查询

示例 (代码来自开源的 tidb-dashboard)：

```js
import { useState, useEffect, useMemo } from 'react'
import { useSessionStorageState } from '@umijs/hooks'
import client, { StatementTimeRange, StatementModel } from '@lib/client'
import {
  TimeRange,
  DEF_TIME_RANGE,
  calcValidStatementTimeRange,
} from '../pages/List/TimeRangeSelector'

const QUERY_OPTIONS = 'statement.query_options'

export interface IStatementQueryOptions {
  timeRange: TimeRange
  schemas: string[]
  stmtTypes: string[]
  orderBy: string
  desc: boolean
}

export const DEF_STMT_QUERY_OPTIONS: IStatementQueryOptions = {
  timeRange: DEF_TIME_RANGE,
  schemas: [],
  stmtTypes: [],
  orderBy: 'sum_latency',
  desc: true,
}

export default function useStatement(
  options?: IStatementQueryOptions,
  needSave: boolean = true
) {
  const [queryOptions, setQueryOptions] = useState(
    options || DEF_STMT_QUERY_OPTIONS
  )
  const [savedQueryOptions, setSavedQueryOptions] = useSessionStorageState(
    QUERY_OPTIONS,
    options || DEF_STMT_QUERY_OPTIONS
  )

  const [enable, setEnable] = useState(true)
  const [allTimeRanges, setAllTimeRanges] = useState<StatementTimeRange[]>([])
  const [allSchemas, setAllSchemas] = useState<string[]>([])
  const [allStmtTypes, setAllStmtTypes] = useState<string[]>([])

  const validTimeRange = useMemo(
    () => calcValidStatementTimeRange(queryOptions.timeRange, allTimeRanges),
    [queryOptions.timeRange, allTimeRanges]
  )

  const [loadingStatements, setLoadingStatements] = useState(true)
  const [statements, setStatements] = useState<StatementModel[]>([])

  const [refreshTimes, setRefreshTimes] = useState(0)

  function refresh() {
    setRefreshTimes((prev) => prev + 1)
  }

  useEffect(() => {
    async function queryStatementStatus() {
      const res = await client.getInstance().statementsConfigGet()
      setEnable(res?.data.enable!)
    }

    async function querySchemas() {
      const res = await client.getInstance().statementsSchemasGet()
      setAllSchemas(res?.data || [])
    }

    async function queryTimeRanges() {
      const res = await client.getInstance().statementsTimeRangesGet()
      setAllTimeRanges(res?.data || [])
    }

    async function queryStmtTypes() {
      const res = await client.getInstance().statementsStmtTypesGet()
      setAllStmtTypes(res?.data || [])
    }

    queryStatementStatus()
    querySchemas()
    queryTimeRanges()
    queryStmtTypes()
  }, [refreshTimes])

  useEffect(() => {
    async function queryStatementList() {
      if (allTimeRanges.length === 0) {
        setStatements([])
        return
      }
      let curOptions = needSave ? savedQueryOptions : queryOptions
      setLoadingStatements(true)
      const res = await client
        .getInstance()
        .statementsOverviewsGet(
          validTimeRange.begin_time!,
          validTimeRange.end_time!,
          curOptions.schemas,
          curOptions.stmtTypes
        )
      setLoadingStatements(false)
      setStatements(res?.data || [])
    }

    queryStatementList()
  }, [
    needSave,
    queryOptions,
    savedQueryOptions,
    allTimeRanges,
    validTimeRange,
    refreshTimes,
  ])

  return {
    queryOptions,
    setQueryOptions,
    savedQueryOptions,
    setSavedQueryOptions,
    enable,
    allTimeRanges,
    allSchemas,
    allStmtTypes,
    validTimeRange,
    loadingStatements,
    statements,
    refresh,
  }
}
```

要对外暴露刷新接口和修改选项的接口。

### @umijs/hooks | react-use | useSWR()

TODO
