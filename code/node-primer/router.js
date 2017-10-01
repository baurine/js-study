function route(handle, pathname, res) {
  // console.log(handle)
  console.log(`About to route a request for ${pathname}`)
  if (typeof handle[pathname] === 'function') {
    handle[pathname](res)
  } else {
    console.log(`No request handler found for ${pathname}`)
  }
}

exports.route = route
