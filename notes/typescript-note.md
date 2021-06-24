# TypeScript Note

## References

- [官方文档中文翻译](https://www.tslang.cn/docs/home.html)
- [TypeScript Handbook 中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/)
- [TypeScript 入门教程](https://github.com/xcatliu/typescript-tutorial)
- [深入挖掘 TypeScript](https://rexdainiel.gitbooks.io/typescript/)
- [TypeScript 101](https://scrimba.com/playlist/pKwrCg)

上面第一个和第二个链接的内容其实是一样的。TypeScript 的文档相比 VS Code extension API 的文档就不知道好到哪里去了，还解释了一些 JavaScript 的基础问题，比如 this 指针，var 声明变量产生的问题，还比较有参考价值。

## Note for Handbook

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

注意，这里的可选属性和 Swift 中用 `?` 声明的 Optional 变量不一样。Swift 中的 Optinal 变量，此变量一定是存在的，但值可以为 nil。但 TypeScript 的 `?` 表示此属性可能不存在，跟值是否为 null 没有关系，而是表示有可能是 undefined。

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

### 高级类型

- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript 高级技巧](https://juejin.im/post/6844903863791648782)

内容：

- Intersection Types `&`
- Union Types `|`
- Type Guards and Differentiating Types: `typeof` `instanceof`
- type / interface
- String Literal Types: `'a' | 'b' | 'c'`
- Index types: keyof
- Mapped types: `{ [P in keyof T]: number }`
- Conditional Types: `T extends U ? X : Y`
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

```ts
// Indexed Access Types
// https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
type Person = { age: number; name: string; alive: boolean }
type I1 = Person['age' | 'name']
// type I1 = string | number

type bb = { delay: 'dddd'; setMessage: 'eeee'; hehe: never; foo: 'bar' }[
  | 'delay'
  | 'setMessage'
  | 'hehe']
// => type bb = 'dddd' | 'eeee'

type bb = { delay: 'dddd'; setMessage: 'eeee'; hehe: never; foo: 'bar' }[
  | 'delay'
  | 'setMessage'
  | 'haha']
// 编译错误，'haha' key 不存在

type bb = { delay: number; setMessage: () => void; foo: string }[
  | 'delay'
  | 'foo']
// => type bb = number | string

// T[P extends keyof T] ==> keyof {[K in P]: T[K]}

function get<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]
}
```

```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// K extends keyof T 表明 K 是 keyof T 的一个子集
// keyof T 表示 T 类型所有 key 的 union 集合
// 比如 type T = {id:number, age:number, name:string}，则 keyof T 为类型 "id"|"age"|"name"
// 则 K 可以为 "id", "id"|"age", "id"|"age"|"name" 等，但不能为类似 "id"|"gender" ...

// [P in K], [P in keyof T]
// in 后面必须是 union 类型

interface User {
  id: number
  age: number
  name: string
}

// 相当于: type PartialUser = { id?: number; age?: number; name?: string; }
type PartialUser = Partial<User>

// 相当于: type PickUser = { id: number; age: number; }
type PickUser = Pick<User, 'id' | 'age'>
```

一个复杂的示例：

```ts
interface Action<T> {
  payload?: T
  type: string
}

class EffectModule {
  count = 1
  message = 'hello!'

  delay(input: Promise<number>) {
    return input.then((i) => ({
      payload: `hello ${i}!`,
      type: 'delay',
    }))
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: 'set-message',
    }
  }
}

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]
// FunctionPropertyNames<EffectModule> => "delay" | "setMessage"
// { [K in keyof T]: T[K] extends Function ? K : never }
// =>
// { "count": never, "message": never, "delay": "delay", "setMessage": "setMessage" }
// { "count": never, "message": never, "delay": "delay", "setMessage": "setMessage" }["count" | "message" | "delay" | "setMessage"]
// =>
// "delay" | "setMessage"

// get
// {
//   delay: (input: Promise<number>) => Promise<{
//     payload: string;
//     type: string;
//   }>;
//   setMessage: (action: Action<Date>) => {
//     payload: number;
//     type: string;
//   };
// }
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>
type EffectModuleFuns = FunctionProperties<EffectModule>
type EffectModuleFunMap<T> = T extends (
  input: Promise<infer U>
) => Promise<Action<infer V>>
  ? (input: U) => Action<V>
  : T extends (action: Action<infer U>) => Action<infer V>
  ? (input: U) => Action<V>
  : never

type ConnectedEffectModule = {
  [K in keyof EffectModuleFuns]: EffectModuleFunMap<EffectModuleFuns[K]>
}

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type Connect = (module: EffectModule) => ConnectedEffectModule

const connect: Connect = (m) => ({
  delay: (input: number) => ({
    type: 'delay',
    payload: `hello 2`,
  }),
  setMessage: (input: Date) => ({
    type: 'set-message',
    payload: input.getMilliseconds(),
  }),
})

type Connected = {
  delay(input: number): Action<string>
  setMessage(action: Date): Action<number>
}

export const connected: Connected = connect(new EffectModule())
```

示例 2：

```ts
interface User {
  name: string
  age: number
  adult: boolean
}

type UserKeysTypes = User['name' | 'age']
// => type UserKeysTypes = string | number

const user: User = { name: 'foo', age: 10, adult: false }
user['name' | 'age'] = 'foo' | 10
```

示例 3：

```ts
type MyUnion = 'a' | 'b' | 'c'
type UnionArr = MyUnion[]
const unionArr: UnionArr = ['a']
const unionArr2: UnionArr = ['a', 'b']
const unionArr3: UnionArr = ['a', 'b', 'c']
const unionArr4: UnionArr = ['a', 'b', 'c', 'd'] // wrong, 'd' 不存在

type Weeks = 'Mon' | 'Tue' | 'Wed' | 'Thur' | 'Fri' | 'Sat' | 'Sun'
type WeeksArr = Weeks[]
const weeks: WeeksArr = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
const weeks2: WeeksArr = [
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
  'Sun',
  'hehe',
] // wrong, 'hehe' 不存在
```

表示这个类型包含任意字段：

```ts
interface MyType {
  [k: string]: any
}
```

`Exclude<Type, ExcludedUnion>` 有点不好理解

```ts
type Exclude<T, U> = T extends U ? never : T

type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// => type T0 = "b" | "c"
// 所以是对 'a'|'b'|'c' 的每一个元素，判断它是否 extends 'a'，然后将结果再 union?
// `T extends U ? never : T` 到底是怎么工作的？

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// => type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>
// => type T2 = string | number
```

Exclude 的反向操作是 `Extract<Type, Union>`：`type Exclude<T, U> = T extends U ? T : never`

Extract 和 Pick 的区别？定义完全不一样。

Pick:

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

[TypeScript: Conditional Types Explained](https://rossbulat.medium.com/typescript-conditionals-explained-a096591f3ac0)

在上面这篇文章里有解释，在 contidtional types 中，`T extends U ? T : never`，如果 T 是单独的 union 类型，则会用 union 的每一个单独的值来判断是否 extends U，但如果 T 是作为函数返回值类型，或是数组元素类型，则拿 T 整体进行判断，而不是拿 T 的每个值进行比较。

```ts
// Distributive vs non-distributive conditionals

// distributive
type StringOrNumberOnly<T> = T extends string | number ? T : never
type MyResult = StringOrNumberOnly<string | number | boolean>
// type MyResult = string | number

// non-distributive
type MyTypeFunction<T> = (() => T) extends () => string | number ? T : never
type MyResultFunction = MyTypeFunction<number | string | boolean>
// type MyResultFunction = never
type MyResultFunction = MyTypeFunction<number>
// type MyResultFunction = number

type MyTypeTuple<T> = [T] extends [string | number] ? T : never
type MyResultTuple = MyTypeTuple<string | number | boolean>
// type MyResultTuple = never
type MyResultTuple = MyTypeTuple<string>
// type MyResultTuple = string
```

官网文档上也有 distributive conditional types 的说明：https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

## Note for Others

TypeScript 是 JavaScript 的超集，普通的 .js 改成 .ts 就能直接运行了。没有显式声明类型且没有赋值的变量，默认是 any 类型，如果声明时赋值了，则根据字面量自动推导出它的类型。

TypeScript 的编译命令是 tsc，编译的配置文件是 tsconfig.json，用来配置编译时的各个选项。类似 Webpack 命令和它的配置文件 webpack.config.js。

Webpack 可以用 ts-loader 来处理 .ts 和 .tsx 文件。

### type & interface

type 关键字也可以像 interface 那样来定义一般的自定义类型，但其实它和 interface 的不完全相同，type 更侧重为类型定义别名 (type alias)。

[Interface vs Type alias in TypeScript 2.7](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c)

它们的区别：

1. interface 只可以用来定义对象类型，type 还可以用来定义 union, intersection, primitive 类型
1. interface 定义的接口可以 merge，但 type alias 不行
1. 如果 type alias 的类型是 union 类型，那么它不能被 extends 或 implements

为 React 的 component 定义 Props 和 State 时，推荐使用 type，而不是 interface (呃...我用了 interface)

### 声明文件

使用第三方库时，需要引用它的声明文件。比如在 TypeScript 中使用 jQuery: `$('#foo')` 或 `jQuery('#foo')`，但 TypeScript 并不知道 \$ 或 jQuery 是什么东西，这时需要用 declare 关键字来显式的声明 (类似 C 中的头文件)。

    declare var jQuery: (string) => any;

一般会把类型声明放到一个单独的文件中，比如 jQuery.d.ts，然后在使用到的文件开头用 `///` 表示引用 (??? 好像从来没有见到过啊):

    // jQuery.d.ts
    declare var jQuery: (string) => any;

    // app.ts
    /// <reference path='./jQuery.d.ts'/>
    jQuery('#foo').show()

常用的第三方库的声明文件都有人帮我们写好了，TypeScript 推荐使用 @types 来管理类型声明文件，比如：

    npm install @types/jquery --save-dev

### tsconfig.json

tsc 的配置文件，执行 tsc 进行编译时，编译器会从当前目录开始去查找 tsconfig.json 文件，逐级向上搜索父目录。

- [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [tsconfig v2](https://www.typescriptlang.org/v2/en/tsconfig)

tsconfig.json 中主要包含的字段：compileOptions，files, include, exclude, extends。

其中 files/include/exclude 都是用来声明编译时要包含和排除哪些文件。include 和 exclude 可以用通配符。

extend 用来指定从另一个配置中继承其配置。

最重要的是 compileOptions。一个示例：

```json
// tsconfig.paths.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    "target": "es6",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "noImplicitAny": false,
    "noImplicitThis": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "experimentalDecorators": true,
    "jsx": "react"
  },
  "include": [
    "src"
  ]
}
```

- target: 指定生成的目标版本，默认值 "ES3"，可选值 "ES5", "ES6" / "ES2015", "ES2016", "ES2017", "ESNext"... 比如你设置成 ES6，那 Promise 和箭头函数就不会转译，直接保留，但如果选 ES5，那么 Promise 和箭头函数就会转译成 ES5 的实现，"ESNext" 则表示最新的 ES 版本。
- module: 指定生成哪个模块系统，可选值："None", "CommonJS", "AMD", "System", "UMD", "ES6" / "ES2015", ESNext... 默认值，如果 target 小于 ES6 则为 CommonJS，否则为 ES6。ESNext 和 ES6 目前输出差不多。
- moduleResolution: 已经 deprecated 了，两个值，"node" 和 "classic"。
- lib: ts 默认为 js 内置的 API (如 Math) 以及浏览器环境 (比如 document) 包含了一系列的类型定义。同时，取决于 target，不同的 target 会包含不同的 ts 的类型定义，比如如果 target 为 ES6，那么你就可以在代码中使用 Map 类型，因为 ts 为 es6 的 target 包含了 Map 的定义，如果 target 是 es5，就不能在代码中使用 Map，会编译报错。(babel 也处理不了 Map 类型，无法转换成 es5 代码)。如果 target 是 es5，默认包含的 lib 为 DOM, ES5, ScriptHost，如果 target 为 ES6，则默认包含的 lib 为 DOM, ES6, DOM.Iterable, ScriptHost。
- esModuleInterop: 使用 CommonJS 写法的代码，在 module.exports 时如果没有一个 default object，则为它自动生成一个 default object。(一句话不好理解，看 ts v2 官方文档吧，有示例)
- resolveJsonModule: 允许 ts import json 文件，默认是不能处理 json 文件的。
- isolatedModules: 如果为 true 的话，每一个文件至少都要有 export，否则这个文件没有存在必要。
- jsx: "react"
