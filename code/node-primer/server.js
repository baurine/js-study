var http = require('http')
var url = require('url')

function start(route, handle) {
  function onResp(req, res) {
    // var postData = ''
    var pathname = url.parse(req.url).pathname
    console.log(`Request for ${pathname} received.`)

    // req.setEncoding("utf8");
    // req.addListener('data', function(chunkData) {
    //   postData += chunkData
    //   console.log("Received POST data chunk '"+ chunkData + "'.");
    // })
    // req.addListener('end', function() {
    //   route(handle, pathname, res, postData)
    // })

    route(handle, pathname, res, req)
  }

  http.createServer(onResp).listen(8888)
  console.log('Server started!')
}

exports.start = start
