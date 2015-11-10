var express = require('express'),
	sio = require('socket.io'),
	fs = require('fs'),
	session = require('express-session'),
	app = express(),
	http;

app.set('views', 'web/views');
app.set('view engine', 'ejs');

app.get('/page/:page', function(req, res){
	var page = req.param.page.replace('html','ejs');
	fs.access('./web/views/pages/'+page, fs.R_OK, function(err){
		if(err){
			res.render('./web/views/pages/404');
		}
		res.render('./web/views/pages/'+page);
	});
});

app.get('/host', function(req, res, next){
	
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

sio = sio(http);