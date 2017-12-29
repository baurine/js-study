# TypeScript Note

## References

- [官方文档中文翻译](https://www.tslang.cn/docs/home.html)
- [TypeScript Handbook 中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/)

上面两个链接的内容其实是一样的。TypeScript 的文档相比 VS Code extension API 的文档就不知道好到哪里去了，还解释了一些 JavaScript 的基础问题，比如 this 指针，var 声明变量产生的问题，还比较有参考价值。

## Note

随便瞄了一眼，毕竟有了这么多种语言的基础后，而且比较熟练使用 JavaScript，对这样一门新的语言就没有必要一字一句地那么细致地学习。了解它的框架，思想，用到不懂时再回来细看。

整体看来，TypeScript 声明类型的写法和 Swift 很相似，把类型放在变量或参数后面，用 `:` 隔开。

TypeScript 声明了几种基础数据类型：

- 布尔值：boolean
- 数值：number
- 字符串：string
- 数组：`number[]`, `Array<number>`, `string[]`, `Array<string>`
- 元组：`[number, string]`
- 枚举：`enum Color { Red, Green, Blue }`
- 任意类型：any
- void
- ...

手动类型断言：as - `(someValue as string).length`

用 interface 定义自定义数据类型。TypeScript 中的 interface 意义和其它静态语言的 interface 意义不尽相同。(据说和 Go 的很相似，我还没有看过 Go)。

不用显式地声明实现此 interface，只要这个对象实现了 interface 中的属性，它就是这种 interface 类型。还是鸭子模型。

当然，也可以用 class 显示声明 implement 这个 interface。

interface 中可以定义可选属性，也 `?` 声明的属性是可选属性。

    interface SquareConfig {
      color?: string;
      width?: number;
    }

注意，这里的可选属性和 Swift 中用 `?` 声明的 Optional 变量不一样。Swift 中的 Optinal 变量，此变量一定是存在的，但值可以为 nil。但 TypeScript 的 `?` 表示此属性可能不存在，跟值是否为 null 没有关系。

用 interface 定义函数类型：

    interface SearchFunc {
      (source: string, subString: string): boolean;
    }

    let searcFunc: (source: string, subString: string) => boolean =
    function(source: string, subString: string) : boolean { return true }

    let searcFunc: SearchFunc =
    function(source: string, subString: String) : boolean { return true }

class，TypeScript 的 class 用起来和静态语言的 class 差不多。

泛型：

    function identity<T>(arg: T): T {
      return arg;
    }

TypeScript 使用 tsconfig.json 作为配置文件。

TypeScript 和 React、Webpack 的配合使用。和一般 React & Webpack 项目没有什么区别，就是多了用 awesome-typescript-loader 处理 .tsx 文件。

其它略，需要时再看。
