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

// 自己现实 co 函数，取名为 myCo

myCo(function*() {
  const res = yield fetch(URL)
  // console.log('res:', res)

  const post = yield res.json()
  // console.log('post:', post)

  const title = post.title
  console.log('Title:', title)
})

// version1
/*
function myCo(generator) {
  const gen = generator()
  const iteration = gen.next()
  const promise = iteration.value
  promise.then( res => {
    const iteration2 = gen.next( res )
    const promise2 = iteration2.value
    promise2.then( post => gen.next(post) )
  })
}
*/

// version2
function myCo(generator) {
  const iterator = generator()
  function iterate(iteration) {
    if (iteration.done) return iteration.value
    const promise = iteration.value
    return promise.then( x => iterate(iterator.next(x)) )
  }
  return iterate(iterator.next())
}
