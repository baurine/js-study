# Generator / Async

## References

1. [迭代器和生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)
1. [function*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)
1. [The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)

## Note

准备学习 redux-saga，然而 redux-saga 基于 Generator 实现，所以必须先了解 Generator (生成器)。

要了解生成器又要先了解迭代器，因为生成器是用来生成迭代器的。

[迭代器和生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)

迭代器，顾名思议，是用来遍历一个可迭代对象的对象，它有一个 `next()` 方法来迭代，每次调用 `next()` 方法得到下一个值和是否结束的标志，即返回值为 `{value: xxx, done: true/false}`，它的大致实现：

    function makeIterator(array){
        var nextIndex = 0;
        return {
          next: function(){
              return nextIndex < array.length ?
                  {value: array[nextIndex++], done: false} :
                  {done: true};
          }
        }
    }

它在内部需要一个类似指针的值，来保存每一次 `next()` 执行到哪里了，上例中就是 nextIndex。

使用：

    var it = makeIterator(['yo', 'ya']);
    console.log(it.next().value); // 'yo'
    console.log(it.next().value); // 'ya'
    console.log(it.next().done);  // true

或者使用语法层级提供的 `for...of` 来访问迭代器，相当于替代 `next()` 方法的调用：

    // Array 实现了iterator 接口，可以直接使用 for...of 方法遍历
    var langs = ['JavaScript', 'Python', 'C++'];
    for (const l of langs) {
      console.log(l);
    }
    // result:
    // JavaScript
    // Python
    // C++

如果我们自己手动实现迭代器，每一个迭代器内部我们都需要手动用一个或多个值来保存状态... anyway，总之是麻烦，所以生成器来帮我们了，它允许你通过写一个可以保存自己状态的的简单函数来定义一个迭代算法。(其实就是用语法层级的 yield 来记住状态，记住每次执行到哪了，粗略相当于上例中的 nextIndex 的作用。而含有 yield 语句的函数就是生成器函数。)

生成器是一个函数，特点是使用了 yield 语句，表示它能记住状态。执行这个函数，就能得到一个迭代器对象。然后就能调用这个迭代器对象的 `next()` 方法了。

yield 有 2 个作用，一是产生这次执行的结果，二是记住这次执行到哪了，下次不是从开头执行，而是从上次执行到的位置开始执行。

这就是生成器函数的特殊之处了，一般函数，如果它要返回一个对象，那么你就要在函数中 return 一个对象，但生成器函数并没有显示地 return 一个迭代器对象 (更重要的是，这个函数中的 return 所返回的值，并不是执行这个函数所得到的结果，和一般函数并不相同。前面说了，不管里面有没有 return，执行这个函数永远得到的是一个迭代器对象，函数中的 return 跟执行这个函数得到的对象没有关系)。所以它不是一般的函数，因而不是用 function 来定义它，而是用 `function*` 来定义它。

例子：

    function* simpleGenerator(){
      yield "first";
      yield "second";
      yield "third";
      for (var i = 0; i < 3; i++)
        yield i;
    }

    var g = simpleGenerator();   // 执行函数，生成迭代器对象
    console.log(g.next().value); // first
    console.log(g.next().value); // second
    console.log(g.next().value); // third
    console.log(g.next().value); // 0
    console.log(g.next().value); // 1
    console.log(g.next().value); // 2
    console.log(g.next().value); // undefined

终于理解了！

生成器可以接收参数，这我能理解，`next()` 方法也能接收参数...这咋理解，继续看后面的文章。

[function*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)

> function* 这种声明方式(function关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个  Generator  对象。

(啊！我以为返回的是迭代器对象呢...哎，反正意思差不多)

> 调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个**生成器的迭代器（iterator）对象**。当这个迭代器的 `next()` 方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现 yield 表达式的位置为止，该表达式定义了迭代器要返回的值，或者被 `yield*` 委派至另一个生成器函数。`next()` 方法返回一个对象，这个对象包含两个属性：value 和 done，value 属性表示本次 yield 表达式的返回值，done 属性为布尔类型，表示生成器是否已经产出了它最后的值，即生成器函数是否已经返回。

(好吧，这段里面又说返回是的迭代器对象，但是是属于生成器的...)

> 调用 `next()` 方法时，如果传入了参数，那么这个参数会取代生成器函数中对应执行位置的 yield 表达式（整个表达式被这个值替换）

(这个要看例子才能理解)

> 当在生成器函数中显式 return 时，会导致生成器立即变为完成状态，即调用 `next()` 方法返回的对象的 done 为 true。如果 return 了一个值，那么这个值会作为下次调用 `next()` 方法返回的 value 值。

(got it! 就是说如果在生成器函数中直接 return 了，没有 return 一个值，那么下次调用 `next()` 方法，得到的是 `{value: undefined, done: true}`，但是如果 return 了一个值，比如 5，那么下次谳用 `next()` 方法，得到的是 `{value: 5, done: true}`)

如果要在生成器函数中执行得到另一个生成器函数的值，那么用 `yield*` 替代 `yield`。

    function* anotherGenerator(i) {
      yield i + 1;
      yield i + 2;
      yield i + 3;
    }

    function* generator(i){
      yield i;
      yield* anotherGenerator(i);
      yield i + 10;
    }

    var gen = generator(10);

    console.log(gen.next().value); // 10
    console.log(gen.next().value); // 11
    console.log(gen.next().value); // 12
    console.log(gen.next().value); // 13
    console.log(gen.next().value); // 20

[The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)

这篇文章解答了我上面关于 `next()` 中传参的作用的疑问。

Generator 最大的特点，可以在执行中途通过 yield 暂停自己，但是不能由自己重启，必须在外部通过 `next()` 方法重启。

在普通的 JS 实现中，使用 `while (true) {...}` 是极少见的，但在 Generator 函数中，它会是经常使用的。

Generator 函数通过 `yield xxx` 向外部传值，而外部通过 `next()` 方法中的参数在重启 Generator 时向内部传值。

来看下面这个例子就明白了。

    function *foo(x) {
        var y = 2 * (yield (x + 1));
        var z = yield (y / 3);
        return (x + y + z);
    }

    var it = foo( 5 );

    // note: not sending anything into `next()` here
    console.log( it.next() );       // { value:6, done:false }
    console.log( it.next( 12 ) );   // { value:8, done:false }
    console.log( it.next( 13 ) );   // { value:42, done:true }

当第一次执行 `next()` 方法时，generator 内部执行到 `yield(x+1)`，由于 x 为 5，因为外部得到 value 为 6。但 `yield(x+1)` 在内部执行是不返回任何值的，它产生的结果是 undefined，它产生的结果可以由外部通过 `next()` 中的参数传进来，因为第二次执行 `next()` 方法时我们传入参数 12，这个 12 在内部会作为 `yield(x+1)` 的结果，因此，得到 y 值为 24，因为 `yield(y/3)` 使外部得到 value 为 8。同理，第三次 `next()` 传入 13，使得 z = 13，最后得到结果 5 + 24 + 13 = 42。

上面第一次执行 `next()` 时我们并没有传入参数，因为此时并没有什么 `yield` 语句需要这个参数是作为它的结果，或者说是替换它，因为不需要传参，或者你传入参数也不会有任何影响。

但是要注意，在 `for...of` 循环中，会忽略 return 返回的值，因为它一旦检测到 done 值为 true，就结束循环，不会去取此时的 value 值。

[Diving Deeper With ES6 Generators](https://davidwalsh.name/es6-generators-dive)

异常：Generator 可以调用 `throw()` 抛出异常

`yield*`：Generator 的代理，可以在一个 Generator 函数中通过 `yield*` 代理另一个 Generator 函数。

[Generator 函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)

在阮一峰的这篇文章里，他把 yield 理解为一种协程...我觉得也可以这么理解。

[Javascript Generators - THEY CHANGE EVERYTHING - ES6 Generators Harmony Generators](https://www.youtube.com/watch?v=QO07THdLWQo)

前面看的都是 Generator 的基本介绍，举的例子都特别简单，比如 `yield 1; yield 2` 这种实际根本不会用到的，让我们产生一种误解，以为 yield 就只能产生这种简单的数据。实际，yield 可以向外界输出任意对象，比如，最常用的，就是 Promise 对象，这应该才是 Generator 最大的威力。(所以 Generator 经常和 Promise 关联使用)

上面的视频中的例子代码：

    var myGen = function*() {
      var one = yield $.get('/api/friends');  // $.get() 得到的是 Promise 对象，且是立即返回的
      var two = yield $.get('/api/profile');
      var three = yield $.get('/api/tweets');
    }

    function smartCode(generator) {
      // ready to run
      var gen = generator();
      // get first yielded value
      var yieldVal = gen.next().value;
      // check whether yieldedVal is whether a promise
      if (yieldVal.then) {
        yieldVal.then(gen.next)  // 注意参数是 gen.next，不是 gen.next() 哦
      }
      ...
    }

    Promise.coroutine(function*() {
      var tweets = yield $.get('tweets.json');
      var profile = yield $.get('profile.json');
      var friends = yield $.get('friends.json);
      console.log(tweets, profile, friends); // ??
    })();

这相当于把三个异步请求串行化了。把异步操作同步化，我想应该是 Generator 主要作用了吧。

疑问??，这和直接用 Promise.then.then 有什么不一样特别突出的优势吗?

    $.get('tweets.json').then( $.get('profile.json') ).then( $.get('friends.json') )

应该还是 yield 的写法看上去更像同步代码。并且最关键的是，上面用 generator 的实现，我可以更自由的控制 yield 执行的时机，而 Promise 的链式实现法不具备这种自由性。

从上面也可以看出，操作 Generator 还是很麻烦的，要自己控制其中每一个 `next()` 的执行，然后为了简化 Generator 的使用，后面又出现了 async 和 await。所以一路的进化：迭代器 --> 生成器 --> async/await。

[Generators in JavaScript - What, Why and How - FunFunFunction #34](https://www.youtube.com/watch?v=ategZqxHkz4)

    const fetch = require('node-fetch')
    const co = require('co')

    const URL = 'http://jsonplaceholder.typicode.com/posts/1'

    fetch(URL)
        .then( res => res.json() )
        .then( post => post.title )
        .then( result => console.log('Title:', result) )

    co(function*() {
      const res = yield fetch(URL)
      const post = yield res.json()
      const title = post.title
      console.log('Title:', title)
    })

上面两段代码实现了一样的效果。[测试代码](../codes/generator-test.js)

前面说道，用 Generator 的时候，要手动调用 `next()` 很麻烦，而这里的 co 函数，可以想象得到，它的作用就是帮你自动调度 `next()` 方法，而且它可以把前一次 yield 得到的值作为下一次 `next()` 方法的参数再传进 Generator 中。

大致实现：

    function myCo(generator) {
      const iterator = generator()
      function iterate(iteration) {
        if (iteration.done) return iteration.value
        const promise = iteration.value
        return promise.then( x => iterate(iterator.next(x)) )
      }
      return iterate(iterator.next())
    }

(在看视频的时候我一直在想，当要通过 `next()` 往 generator 中传值时，这个值应该是 promise 中的 data，那我怎么取到这个 data 呢，啊哈，原来是通过 `promise.then( x => dosomething(x) )` 方法，x 就是 promise 中的 data)。

Got it!

[co 函数库的含义和用法](http://www.ruanyifeng.com/blog/2015/05/co.html)

阮一峰的这篇博客也介绍了 co 的内部实现，co 用来实现 Generator 函数的自动执行。

要使用 co，必须保证 yield 后得到的对象是 Thunk 函数或 Promise 对象。什么是 Thunk 函数，见：[Thunk 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)。

### async/await

Generator 是 ES6 标准的内容，async/await 是 ES7 标准的内容。

~~(?? async/await 到底是用来替代 Promise 的，还是用来包裹 Generator 的啊?)~~

(我觉得 async/await 并不是完全用来替代 Promise 的，因为 async 返回的结果还是 Promise，如果是替代，那就不需要 Promise 了呀。async/await 是通过 Geneartor 实现的。总而言之，async 是和 promise，generator 都有关系的)。

async 和 await 是配合使用的。只能在 async 函数中使用 await。

[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)

阮一峰在这篇博客中认为

> 一句话，async 函数就是 Generator 函数的语法糖。

(但 async 函数返回的是 Promise 对象，所以 async / generator / promise 是纠缠在一起的，generator 本身是跟 promise 没有关系的，但实际中，常在 yield 后面使用 promise 对象，所以导致 generator 和 promise 就有了很大关联)。

(await 后面也基本是用 promise 对象，为什么呢，因为 promise 是表示异步操作，如果 await 后面跟一个同步操作，虽然可以这么做，但没有价值，因为同步操作不用加 await 也是一样的效果啊，所以 await 后面跟一个异步操作才有意义和价值，那么如今最常见的异步操作，那就是 Promise 了)。

Generator 写法：

    var gen = function* (){
      var f1 = yield readFile('/etc/fstab');
      var f2 = yield readFile('/etc/shells');
      console.log(f1.toString());
      console.log(f2.toString());
    };

async 写法：

    var asyncReadFile = async function (){
      var f1 = await readFile('/etc/fstab');
      var f2 = await readFile('/etc/shells');
      console.log(f1.toString());
      console.log(f2.toString());
    };

从写法上看，async 函数就是将 Generator 函数的星号 `*` 替换成 async，将 yield 替换成 await。

但 async 相比 Generator：

1. async 内置执行器，await 相当于 yield + `next()`，因此，async 函数的执行与普通函数一样。而 Generator 需要手动执行 `next()`，因此才有了 co 函数。

        asyncReadFile();
        co(generator);

1. 更好的语义
1. 更广的适用性，co 函数限制了 yield 后面只能跟 promise 或 thunk 函数，但 await 后无限制 (虽然是这么说，看我上面的说明，但 await 后面常跟的也是 promise 对象)。

async 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。具体略，看阮一峰的博客原文。

async 函数执行的结果是总是返回一个 Promise 对象，因此后面可以加上 `then()` 调用。

    async function getStockPriceByName(name) {
      var symbol = await getStockSymbol(name);
      var stockPrice = await getStockPrice(symbol);
      return stockPrice;
    }

    getStockPriceByName('goog').then(function(result) {
      console.log(result);
    });

(在函数中的 return 作用上，这一点 async 函数和 geneartor 函数也是一样的，它们的 return 和普通函数不一样，并不表示这个函数执行后自身返回的值。对于 async 函数，如果 return 一个非 promise 对象，假设叫 x，最终会包装成 Promise.resolve(x)，如果是一个 promise 对象，那么就返回这个 promise 对象，和 `promise.then()` 中和逻辑是一样的。[MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function))。

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 `try...catch` 代码块中。

    async function myFunction() {
      try {
        await somethingThatReturnsAPromise();
      } catch (err) {
        console.log(err);
      }
    }
