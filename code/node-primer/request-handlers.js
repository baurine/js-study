// var exec = require('child_process').exec

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
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write(postData)
  res.end()
}

module.exports = {
  start,
  upload
}
