var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var allClients = {};

io.on('connection', function(socket) {
  socket.on('chat name', function(chatName) {
    allClients[socket.id] = chatName;
	  io.emit('user connect', chatName);
	  io.emit('update user list', allClients);
  });
	
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function() {
		setTimeout (function () {
		    var name = allClients[socket.id];
		    delete allClients[socket.id];
		    io.emit('update user list', allClients);
		    io.emit('user disconnect', name);
        }, 500);
	});
});

http.listen(app.get('port'), function() {
	console.log('listening on *:' + app.get('port'));
});
