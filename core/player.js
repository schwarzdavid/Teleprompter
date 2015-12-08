module.exports = function(host, client, text){
	var emit = null,
		receiver = client;
	
	client.con.on('disconnect', function(){
		host.emit('kick');
	});
	
	host.on('stop', function(){
		client.con.emit('kick');
	});
	
	host.on('init', function(){
		emit('text', text);
	});
	
	emit = function(event, data){
		client.con.emit(event, data);
		host.emit(event, data);
	};
};