# single-spa

- [official site](https://single-spa.js.org/)

微前端框架，一种用法是可以用来替换 webpack 多页面打包方案。

入口：

```js
import * as singleSpa from 'single-spa'
const name = 'app1'
/* The app can be a resolved application or a function that returns a promise that resolves with the javascript application module.
 * The purpose of it is to facilitate lazy loading -- single-spa will not download the code for a application until it needs to.
 * In this example, import() is supported in webpack and returns a Promise, but single-spa works with any loading function that returns a Promise.
 */
const app = () => import('./app1/app1.js')
/* single-spa does some top-level routing to determine which application is active for any url. You can implement this routing any way you'd like.
 * One useful convention might be to prefix the url with the name of the app that is active, to keep your top-level routing simple.
 */
const activeWhen = '/app1'
singleSpa.registerApplication({ name, app, activeWhen })
singleSpa.start()
```

关键函数：`singleSpa.registerApplication({ name, app, activeWhen })`，那 app 长啥样呢：

```js
//app1.js
let domEl
export function bootstrap(props) {
  return Promise.resolve().then(() => {
    domEl = document.createElement('div')
    domEl.id = 'app1'
    document.body.appendChild(domEl)
  })
}
export function mount(props) {
  return Promise.resolve().then(() => {
    // This is where you would normally use a framework to mount some ui to the dom. See https://single-spa.js.org/docs/ecosystem.html.
    domEl.textContent = 'App 1 is mounted!'
  })
}
export function unmount(props) {
  return Promise.resolve().then(() => {
    // This is normally where you would tell the framework to unmount the ui from the dom. See https://single-spa.js.org/docs/ecosystem.html
    domEl.textContent = ''
  })
}
```

必须的三大属性：bootstrap, mount, unmount
