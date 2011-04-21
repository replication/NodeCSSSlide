
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}

var socket = require('socket.io').listen(app);
// クライアントが接続してきたときの処理
socket.on('connection', function(client) {
    console.log(client.sessionId + ' connected');
    // メッセージを受けたときの処理
    client.on('message', function(msg) {
        console.log(client.sessionId + "'s send " + msg);
        // クライアントにメッセージを送信する
        console.log("クライアントにメッセージを送信しました。");
        client.broadcast(msg);
    });
    // クライアントが切断したときの処理
    client.on('disconnect', function(){
        console.log(client.sessionId + ' disconnected');
    });
})
