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
// 使用
// memoizedCallback(a, b)
```

// TODO: 增加例子

`useMemo()` 得到的是已计算出的值，相当于 vue 的 computed，同步执行，不会产生 side effect，其计算出的值可以在 render 方法中使用 (其实 useMemo 中的方法是在 render 时被调用的，并没有并提交计算出来，这算是一种 lazy 模式)。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

// TODO: 增加例子

现在明白了，useCallback() 是用来缓存方法，useMemo() 是用来缓存变量，这样在每次 render() 时不会生成新的方法或值，提高性能。

### useRef

useRef() a mutable ref object, component 的整个生命周期可随意改变和访问，但对它的修改不会引起 re-render

Essentially, useRef is like a "box" that can hold a mutable value in its .current property.

> Keep in mind that useRef doesn’t notify you when its content changes. Mutating the .current property doesn’t cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a callback ref instead.

相当于之前 class 中的实例成员。

### useImperativeHandle

useImperativeHandle (命令式，而非声明式的 handle)，和 useRef/forwardRef 配套使用，用于转发 ref handle。

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

一步一步来理解，首先执行 `const [count, setCount] = useState(0)`，此时 count 为初始值 0，接着执行 `const prevCount = usePrevious(0)`，因为 `useEffect(()=>{ref.current=value})` 在 render 之后执行，所以此时 ref.current 为初始值 undefined。初次 render 时，显示 `Now: 0, Previouse:`。

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
  toggleTheme: () => {}
})
```
