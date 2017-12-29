// var exec = require('child_process').exec
var querystring = require('querystring'),
    fs = require('fs'),
    formidable = require('formidable')
// don't forget to run `npm install formidable`

function start(res, req) {
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
  '<form action="/upload" method="post" enctype="multipart/form-data">'+
  '<input type="file" name="upload" />'+
  '<input type="submit" value="Upload file" />'+
  '</form>'+
  '</body>'+
  '</html>'

  res.writeHead(200, {"Content-Type": "text/html"})
  res.write(body)
  res.end()
}

function upload(res, req) {
  console.log('Request handler "upload" was called.')
  // var text = querystring.parse(postData).text
  // res.writeHead(200, {'Content-Type': 'text/plain'})
  // res.write(`You have sent the text: ${text}`)
  // res.end()
  var form = new formidable.IncomingForm()
  console.log('about to parse')
  form.parse(req, function(err, fields, files) {
    console.log('parse done')
    fs.renameSync(files.upload.path, '/tmp/test.png')
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write('received image: <br/>')
    res.write('<image src="/show" />')
    res.end()
  })
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
