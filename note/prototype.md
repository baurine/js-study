# prototype

## 资料

1. [Javascript 王国的一次旅行，一个没有类的世界怎么玩转面向对象？](https://mp.weixin.qq.com/s?__biz=MzAxOTc0NzExNg==&mid=2665513786&idx=1&sn=6f51ad314e3ef3e1575e032568477f3a)
1. [图解 Javascript 原型链](http://blog.rainy.im/2015/07/20/prototype-chain-in-js/)

这是 [ByVoid](https://github.com/byvoid) 画的一张图，理解了它，就理解了
 

   ![prototype](../art/js-prototype.png)

总结一下，就是：

假设 A 是构造函数：

    function A(name) {
      this.name = name
    }

    let a = new A('bao')

    function B(name) {
      ...
    }

`__proto__` 属于对象，而 `prototype` 属于构造函数。

    a.__proto__ = A.prototype
    (
      A.prototype.__proto__ = Object.prototype
      Object.prototype.__proto__ = null

      所以，任意一个对象，默认情况下

      a.__proto__.__proto__.__proto__ = null

      如果要改变它，比如想让 A 从 B 继承，那么手动修改之

      A.prototype.__proto__ = B.prototype
      
      记住，__proto__ 一般是指向一个 prototype
      prototype 是被 __proto__ 所指向
    )

然后构造函数的 prototype 也是对象，因此它也有自己的 `__proto__`

    A.prototype.__proto__ = Object.prototype

构造函数，从另一个角度看，可以看成是由 `new Function()` 创造出来的对象，因此，它也是对象，也有 `__proto__`

    A.__proto__ = Function.prototype

对于纯对象，它只有 `__proto__`，对于构造函数，它既有 `__proto__`，又有 `prototype`，`__proto__` 指向原型链的上游，`prototype` 被下游所指向。

把 `__proto__` 理解成指针。

和 ruby 联系起来看...


http://blog.rainy.im/2015/07/04/scope-chain-and-prototype-chain-in-js/
图解Javascript上下文与作用域




