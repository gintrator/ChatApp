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

var freeNames = ['Koala', 'Giraffe', 'Bear', 'Aardvark', 'Dinosaur', 'Chipmunk', 'Turkey', 'Squirrel', 'Monkey', 'Sloth', 'Whale', 'Shark', 'Fish', 'Dolphin', 'Cheetah', 'Elephant', 'Tiger', 'Wolf', 'Manatee'];
var usedNames = {};

var allClients = [];

io.on('connection', function(socket) {
	var userId = socket.id;
	var index = Math.floor(Math.random()*freeNames.length);
	var chatName = freeNames[index];
	freeNames.splice(index, 1);
	//var chatName = freeNames.pop();
	usedNames[userId] = chatName;

	socket.emit('chat name', chatName);
	io.emit('user connect', chatName);
	io.emit('update user list', usedNames);

	//console.log(freeNames);
	//console.log(usedNames);
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function() {
		setTimeout (function () {
		    var name = usedNames[userId];
		    delete usedNames[userId];
		    freeNames.push(name);
		    io.emit('update user list', usedNames);
		    io.emit('user disconnect', name);
		    //console.log('user disconnected: ' + name);
        }, 1000);
	});
});

http.listen(app.get('port'), function() {
	console.log('listening on *:' + app.get('port'));
});
