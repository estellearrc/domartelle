var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = (process.env.PORT || 8080);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('instruction_to_rpi', function(message) {
    io.emit('instruction_to_rpi', message);
  });
});

http.listen(port, function(){});