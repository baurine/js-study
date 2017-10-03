var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.send('hello express')
})
app.get('/users/:name', function(req, res) {
  res.send('hello ' + req.params.name)
})

app.listen(3000)
