var express = require('express'),
	sio = require('socket.io'),
	fs = require('fs'),
	session = require('express-session'),
	manager = require('./core/manager.js'),
	app = express(),
	http;

app.set('views', 'web/views');
app.set('view engine', 'ejs');

app.use(express.static('bower_components/'));
app.use(express.static('web/public/'))

app.use(session({
	secret: 't3l3pr0mpt3r 1s b35cht3',
	resave: false,
	saveUninitialized: true
}));

app.get('/page/:page', function(req, res){
	var page = req.params.page.replace('html','ejs');
	fs.access('./web/views/pages/'+page, fs.R_OK, function(err){
		if(err){
			res.render('pages/404');
		}
		res.render('pages/'+page);
	});
});

app.get('*', function(req, res){
	res.render('template.ejs');
});

http = app.listen(80, function(err){
	if(err){
		throw new Error(err);
	}
	console.log('Webserver gestartet...');
});

sio = sio(http);

sio.on('connection', function(socket){
	socket.room = null;
	
	socket.on('host', function(){
		if(!socket.room){
			socket.room = manager.createRoom(socket);
		}
		socket.emit('host', socket.room);
	});
	
	socket.on('join', function(data){
		var r = manager.findRoom(data);
		if(r){
			r.addClient(socket);
			socket.emit('join', data);
		}
	});
});