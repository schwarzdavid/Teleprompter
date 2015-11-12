var express = require('express'),
	sio = require('socket.io'),
	fs = require('fs'),
	session = require('express-session'),
	room = require('./room.js'),
	app = express(),
	http, room, manager;

app.set('views', 'web/views');
app.set('view engine', 'ejs');

app.use(session({
	secret: 't3l3pr0mpt3r 1s b35cht3',
	resave: false,
	saveUninitialized: true
}));

app.get('/page/:page', function(req, res){
	var page = req.param.page.replace('html','ejs');
	fs.access('./web/views/pages/'+page, fs.R_OK, function(err){
		if(err){
			res.render('./web/views/pages/404');
		}
		res.render('./web/views/pages/'+page);
	});
});

app.get('/', function(req, res){
	res.render('./web/views/template.ejs');
});

app.get('*', function(req, res){
	res.redirect('/');
});

http = app.listen(80, function(err){
	if(err){
		throw new Error(err);
	}
	console.log('Webserver gestartet...');
	
	require('./core/sockets.js')(http);
});

manager = (function(){
	var Room = function(con){
		this.uid = Math.floor(Math.random() * 90000 + 10000);

		this.addClient = function(con){

		};

		this.removeClient = function(con){

		};

		this.editClient = function(x, y){

		};
	};
	
	var rooms = [];

	return {
		createRoom: function(con){
			var r = new Room(con);
			rooms.push(r);
			
			return r.uid;
		},
		
		deleteRoom: function(){
			
		},
		
		findRoom: function(){
			
		}
	}
}());

sio = sio(http);
sio.on('connection', function(socket){
	socket.room = null;
	
	socket.on('host', function(data){
		if(!socket.room){
			socket.room = new room(socket);
		}
	});
	
	socket.on('join', function(data){
		socket.room = 
	});
});