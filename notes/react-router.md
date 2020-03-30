# React Router

- [GitHub](https://github.com/ReactTraining/react-router)

之前还有一个相同作用写的 reach-router，但这个库以后除了 bugfix 外不会再更新了 - [The Future of React Router and @reach/router](https://reacttraining.com/blog/reach-react-router-future/)，所以以后就只有 react-router 一个选择 (太好了!)

## React Router v6

- [精读《React Router v6》](https://github.com/dt-fe/weekly/blob/v2/145.%E7%B2%BE%E8%AF%BB%E3%80%8AReact%20Router%20v6%E3%80%8B.md)
- [A Sneak Peek at React Router v6](https://alligator.io/react/react-router-v6/)
- [What’s new in React Router v6](https://dev.to/narendersaini32/what-s-new-in-react-router-v6-2g8g)

一些变化：

- Switch 组件更名为 Routes

- Route 使用 element prop 统一 component 和 render prop

  ```js
  <Route path=":userId" element={<Profile/>}/>
  <Route path=":userId" element={<Profile animate={true}/>}/>
  ```

  这种写法不再工作：

  ```js
  <Route path=":userId">
    <Profile>
  </Route>
  ```

- 嵌套路由更加简单 (嵌套的路由不用加上父路由的路径前缀)

- 用 useNavigate 替代 useHistory

- 用 useRoutes 替代 react-router-config

- 大小从 24KB 降至 8KB

另外还要注意的是，v5 默认 path 是模糊匹配，如果要精确匹配则显式加上 exact prop，但 v6 默认是精确匹配，如果还想实现模糊匹配的效果，则要给 path 加上通过符 `*` 号。

比如在 v5 中，下面的路由：

```js
<Route path="/keyvis">
  <KeyVis />
</Route>
```

使用 `/keyvis` 和 `/keyvis/aaa` 都可以匹配到 `<KeyVis/>` component。

但在 v6 中，这样的写法 `<Route path="/keyvis" element={<KeyVis/>}/>` 只能被 `/keyvis` 匹配到，其它都不行，如果还想实现 v5 的效果，则要把 path 改写成 `/keyvis/*`，即 `<Route path="/keyvis/*" element=.../>`。
