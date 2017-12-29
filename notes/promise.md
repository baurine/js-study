# Promise

## References

1. [JavaScript Promise 迷你书（中文版）](http://liubin.org/promises-book/)
1. [剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://github.com/xieranmaya/blog/issues/3)

## Note

用了 Promise 挺久了，但一段时间没用，又有点晕了，究其原因还是对其内部实现不是完全了解。

[剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://github.com/xieranmaya/blog/issues/3)

    const myPromise = new Promise(function(resolve, reject) {
      ...
      // 成功
      resolve(...)
      ...
      // 失败
      reject(new Error(...))
      ...
    })

Promise 的构造函数只需要一个参数，这个参数也是一个函数，假设我们称这个函数名为 executor，这个函数由我们自己来实现，Promise 内部会马上执行这个函数。这个函数接收 2 个参数，这 2 个参数也是函数，分别为 reslove 和 reject 函数。这 2 个函数是由 Promise 在内部自己实现的，当它调用 executor 函数时，会把这 2 个函数作为 exectutor 的参数传递给它，这样 executor 内部就可以通过调用 resolve 或 reject 来改变 Promise 的状态。

    function Promise(executor) {
      function resolve() {
        ...
      }

      function reject() {
        ...
      }

      executor(resolve, reject)
    }

更完整一点的实现：

    function Promise(executor) {
      var self = this
      self.status = 'pending' // Promise 当前的状态
      self.data = undefined  // Promise 的值
      self.onResolvedCallback = [] // Promise resolve 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面
      self.onRejectedCallback = [] // Promise reject 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面

      function resolve(value) {
        // TODO
      }

      function reject(reason) {
        // TODO
      }

      try { // 考虑到执行 executor 的过程中有可能出错，所以我们用 try/catch 块给包起来，并且在出错后以 catch 到的值 reject 掉这个 Promise
        executor(resolve, reject) // 执行 executor
      } catch(e) {
        reject(e)
      }
    }

resolve 和 reject 内部应该做什么呢，逻辑很简单，改变 status 值，保存 data，通知所有的回调。

    function Promise(executor) {
      // ...

      function resolve(value) {
        if (self.status === 'pending') {
          self.status = 'resolved'
          self.data = value
          for(var i = 0; i < self.onResolvedCallback.length; i++) {
            self.onResolvedCallback[i](value)
          }
        }
      }

      function reject(reason) {
        if (self.status === 'pending') {
          self.status = 'rejected'
          self.data = reason
          for(var i = 0; i < self.onRejectedCallback.length; i++) {
            self.onRejectedCallback[i](reason)
          }
        }
      }

      // ...
    }

上面的 resolve / reject 的实现是有问题，这是同步的实现，要把它变成异步，可以用 `setTimeout(fn, 0)` 来把它们变成异步回调。(理论上，回调都应该是异步的，在 Android 上，可以用 `post()` 来把同步回调变成异步回调。[例子](https://github.com/baurine/permission-util/blob/master/PermissionUtil/permission-util/src/main/java/com/baurine/permissionutil/PermissionUtil.java#L67))。具体地优化可以看原文。

然后，就是 Promise 能够实现链式调用的关键，`then(onResolved, onRejected)` 函数，它应该根据当前 Promise 的状态，执行 `then()` 参数中的相应函数，并返回不同的新的 Promise。下面是它的大致实现，我基本能理解，有一些小的细节还不是很理解，但无妨。之后需要再回来深入理解。

    Promise.prototype.then = function(onResolved, onRejected) {
      var self = this
      var promise2

      // 根据标准，如果 then 的参数不是 function，则我们需要忽略它，此处以如下方式处理
      onResolved = typeof onResolved === 'function' ? onResolved : function(value) {}
      onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {}

      if (self.status === 'resolved') {
        // 如果 promise1 (此处即为 this/self) 的状态已经确定并且是 resolved，我们调用参数中的 onResolved
        // 因为考虑到有可能 throw，所以我们将其包在 try/catch 块里
        return promise2 = new Promise(function(resolve, reject) {
          try {
            var x = onResolved(self.data)
            if (x instanceof Promise) { // 如果 onResolved 的返回值是一个 Promise 对象，直接取它的结果做为 promise2 的结果
              x.then(resolve, reject)
              // (
              // !!! 关键的一步，cool! 如果 x 是 Promise，则调用它的 then 函数来产生一个匿名的 promise3 继续执行，
              // 假设 promise3 没有产生异常，
              // 那么 promise3 内部会执行 onResolved(x.data)，这个 onResolved 实际上是 promise2.resolve，
              // 因此，x.then(resolve, reject) 相当于执行了 promise2.resolve(x.data)
              // )
            }
            resolve(x) // 否则，以它的返回值做为promise2的结果
            // (上面这一部分代码不是很理解，感觉作者是不是写错了，否则部分不用 else 来执行吗? 我觉得是要的)
          } catch (e) {
            reject(e) // 如果出错，以捕获到的错误做为promise2的结果
          }
        })
      }

      // 此处与前一个 if 块的逻辑几乎相同，区别在于所调用的是 onRejected 函数，就不再做过多解释
      if (self.status === 'rejected') {
        return promise2 = new Promise(function(resolve, reject) {
          try {
            var x = onRejected(self.data)
            if (x instanceof Promise) {
              x.then(resolve, reject)
            }
            // (?? 这是不是还缺点东西啊)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (self.status === 'pending') {
        // 如果当前的 Promise 还处于 pending 状态，我们并不能确定调用 onResolved 还是 onRejected，
        // 只能等到 Promise 的状态确定后，才能确实如何处理。
        // 所以我们需要把我们的**两种情况**的处理逻辑做为 callback 放入 promise1 (此处即 this/self) 的回调数组里
        // 逻辑本身跟第一个 if 块内的几乎一致，此处不做过多解释
        return promise2 = new Promise(function(resolve, reject) {
          self.onResolvedCallback.push(function(value) {
            try {
              var x = onResolved(self.data)
              if (x instanceof Promise) {
                x.then(resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })

          self.onRejectedCallback.push(function(reason) {
            try {
              var x = onRejected(self.data)
              if (x instanceof Promise) {
                x.then(resolve, reject)
              }
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    }

其中的精华代码：

    return promise2 = new Promise(function(resolve, reject) {
      try {
        var x = onResolved(self.data)
        if (x instanceof Promise) { // 如果 onResolved 的返回值是一个 Promise 对象，直接取它的结果做为 promise2 的结果
          x.then(resolve, reject)
          // (
          // !!! 关键的一步，cool! 如果 x 是 Promise，则调用它的 then 函数来产生一个匿名的 promise3 继续执行，
          // 假设 promise3 没有产生异常，
          // 那么 promise3 内部会执行 onResolved(x.data)，这个 onResolved 实际上是 promise2.resolve，
          // 因此，x.then(resolve, reject) 相当于执行了 promise2.resolve(x.data)
          // )
        }
        resolve(x) // 否则，以它的返回值做为promise2的结果
        // (上面这一部分代码不是很理解，感觉作者是不是写错了，否则部分不用 else 来执行吗? 我觉得是要的)
      } catch (e) {
        reject(e) // 如果出错，以捕获到的错误做为promise2的结果
      }
    }
