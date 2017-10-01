// var exec = require('child_process').exec
var querystring = require('querystring')
var fs = require('fs')

function start(res, postData) {
  console.log('Request handler "start" was called.')
  // exec('ls -lah', function(err, stdout, stderr) {
  //   res.writeHead(200, {"Content-Type": "text/plain"});
  //   res.write(stdout);
  //   res.end();
  // })

  var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" content="text/html; '+
  'charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/upload" method="post">'+
  '<textarea name="text" rows="20" cols="60"></textarea>'+
  '<input type="submit" value="Submit text" />'+
  '</form>'+
  '</body>'+
  '</html>'

  res.writeHead(200, {"Content-Type": "text/html"})
  res.write(body)
  res.end()
}

function upload(res, postData) {
  console.log('Request handler "upload" was called.')
  var text = querystring.parse(postData).text
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write(`You have sent the text: ${text}`)
  res.end()
}

function show(res, postData) {
  console.log('Request handler "show" was called.')
  fs.readFile('/tmp/test.png', 'binary', function(err, file) {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.write(err + '\n')
      res.end()
    } else {
      res.writeHead(200, {'Content-Type': 'image/png'})
      res.write(file, 'binary')
      res.end()
    }
  })
}

module.exports = {
  start,
  upload,
  show
}
