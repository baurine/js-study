# RxJS

2019/4/9

## Note 1

References:

- [30 天精通 RxJS](https://juejin.im/post/59c9b57cf265da064261dcb4)

因为之前看过和用过 RxJava 和 RxSwift 的，所以 RxJS 理解起来也很快，同样的思想，不同的语言实现罢了。

注意，上面的文章教程使用的 RxJS 5，最新的 RxJS 6 有一个很大的变化是将所有链式调用放到了一个 pipe() 函数中。比如在 RxJS 5 中是这么写的：

    observable.filter(...).map(...)

在 RxJS 6 中要这么写：

    observable.pipe(filter(...), map(...))

主要点：

- Observable 的创建函数，最底层只有一个，`Observable.create(observer)`，但一般不直接用，一般用上层封装的快捷创建函数，有 of / from / interval / timer / empty / never / throw 等。
- Observable 的 operators，比如 map / filter / switchMap / mergeMap / concatMap ... 这是 Rx 编程中的核心
- subscriber: `Observable.subscribe(subscriber)`，subscriber 有三个方法：next / complete / error。 observer 和 subscriber 的区别，前者是事件的源头，用来发出数据，后者是整个事件链的末端，用来接收经过中间的各种 operators 处理后的数据。
- subject: 即是 observable，又是 subscriber
- 订阅后要 `unsubscribe()`，以免内存泄漏

核心是要常握各种常见的 operators 的使用。

- take
- first
- takeUtil
- concatAll: 合并 observable
- skip: 跳过前几个
- taskLast: 必须等到上一个 Observable 发射了 complete() 后，才会执行 next()，所以由此看 RxJS 也是有潜在问题的，不是万能的，像 takeLast 如果上一个 observable 如果永远没有 complete (比如 interval)，或者有大量数据，takeLast 必然是要缓存之前的结果的，如果缓存太多，会必导致内存占用太多吧。每种 operator 都有自己适用的范围。 takeLast 在 next() 方法中缓存之前的结果，在 complete 中执行 next() 和 complete()
- buffer / scan

switchMap / mergeMap / concatMap

- switchMap 等于 `.map().switch()`
- mergeMap 等于 `.map().mergeAll()`
- concatMap 等于 `.map().concatAll()`

switchMap 用来取消之前的 Observable，切换到新的 Observable 执行。mergeMap 用来同时并行执行多个 Observable，而 concatMap 用来顺序执行多个 Observable，但此时要保证除了最后一个 Observable，其它的 Observable 必须要能发出 complete 事件，不然它之后的 Observable 就被阻塞了，永远没有机会执行到。

throttle / debounce: 防抖与节流

## Notes

References:

- [希望是最浅显易懂的RxJS教程](http://www.10tiao.com/html/293/201807/2651229323/1.html)
