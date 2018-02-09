var fs = require('fs');
var httpProxy = require('http-proxy');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();

app.use(function (req, res, next) {
  console.log(req);
  if (req.url === '/') {
    console.log("Transforming response");

    var _write = res.write;

    // Rewrite the livereload port with our secure one
    res.write = function (data) {
      _write.call(res, data.toString().replace('35729', '35700'), 'utf8');
    }
  }

  proxy.web(req, res);
});

// Proxy fpr connect server to use
var proxy = httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 3001
  }
});

//https://matoski.com/article/node-express-generate-ssl/
var secureServer = https.createServer({
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  ca: fs.readFileSync('./ssl/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
}, app).listen('3002', function () {
  console.log('Secure Express server listening on port 3002');
});
