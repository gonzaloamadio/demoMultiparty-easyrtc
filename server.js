/**
 * Servidor con conexión a base de datos MySQL
 * @module server.js
 */ 


// Load required modules
var https   = require("https");              // http server core module
var fs      = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// web framework external module
var io = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module
//var redisClient = require('redis').createClient();
//var RedisStore = require('connect-redis')(express);

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();


//Nos permite leer cosas submited by post forms
app.use(bodyParser());
app.use(cookieParser('shhhh, very secret'));




////////////// configuring the http server ///////////////////////

app.set("views", __dirname);

app.get('/demoMP', function(req,res, next) {
    res.sendfile('demoMP.html', {root: './static'});
});

// Publico CSS
app.get(/^\/css\/.+/,function(req,res){
	res.sendfile(req.url,{root:"static"});
});

// Publico JS
app.get(/^\/js\/.+/,function(req,res){
	res.sendfile(req.url,{root:"static"});
});

app.get(/^\/plugin\/.+/,function(req,res){
    res.sendfile(req.url,{root:"static"});
});

// Publico images
app.get(/^\/images\/.+/,function(req,res){
	res.sendfile(req.url,{root:"static"});
});

// Publico sounds
app.get(/^\/sounds\/.+/,function(req,res){
	res.sendfile(req.url,{root:"static"});
});

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.sendfile('404.html',{root:"./static"});
    //res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


var options = {
    key:  fs.readFileSync("certs/iconf.key"),
    cert: fs.readFileSync("certs/iconf.crt")    
}

// Start Express https server on port 8443
var webServer = https.createServer(options,app).listen(8081);
// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level": 1});
easyrtc.setOption("logLevel","debug");
//easyrtc.setOption("demosEnable",false);
// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);
