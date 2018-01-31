# CoffeeScript Note

简单了解，不深入学习，为了能看懂一些 Rails 资料中的 CoffeeScript 代码。

## References

- [CoffeeScript 中文](http://coffee-script.org/)

链接中的是 1.7.1 的版本，最新已经有 2.0 的版本，但无妨。ES6 普及后，CoffeeScript 注定要是走向没落的。

## Note

从头到尾描了一遍，CoffeeScript 相比 ES5 的代码是简法了很多，总的来说，综合的 Ruby, Python, YAML 的语法。

- Ruby
  - 函数定义和 Ruby 的 lambda 表达式一样用的是单箭头
  - 省略 return，默认最后一行表达式作为返回值
  - if / unless，可以放在一尾，可以放在行尾
  - switch / when / then
  - 方法参数省略括号 ()
  - 方法块省略花括号 {}
  - 变量前不用 var
  - 字符插值 `hello #{name}`
- Python
  - 切片
  - 列表表达式
- YAML
  - 对象的定义

而且熟悉了 ES6 再回过来看 CoffeScript，真的是很熟悉的感觉，难怪别人都说 ES6 从 CoffeeScript 学习了很多。

- ES6 从 CoffeeScript 借鉴的
  - 函数的定义 (`->` 变 `=>`)
  - spread / rest
  - class / extends
  - 解构赋值

简单把语法过一下。

### 函数定义

    square = (x) -> x*x

支持默认参数：

    fill = (container, liquid="coffee") ->
      "Fill the #{container} with #{liquid}..."

从上面的例子可以看出，CoffeeScript 支持字符串插值。

### 对象和数组

可以和 JavaScript 一样的写法，对象也支持 YAML 的写法。

    kids =
      brother:
        name: "Max"
        age:  11
      sister:
        name: "Ida"
        age:  9

...

算了，剩下的不记了，看到代码八九不离十也能猜到是干嘛的。
