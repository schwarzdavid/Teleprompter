module.exports = function(host, client, text){
	var emit = null,
		receiver = client,
		interval,
		margin = 0,
		speed = 1;
	
	client.con.on('disconnect', function(){
		host.emit('kick');
	});
	
	client.con.on('t_getText', function(){
		client.con.emit('t_getText', text);
	});
	
	host.on('disconnect', function(){
		client.con.emit('kick');
	});
	
	host.on('t_getText', function(){
		emit('t_getText', text);
	});
	
	host.on('t_play', function(){
		if(!interval){
			interval = setInterval(function(){
				margin -= speed;

				emit('t_setMargin', margin);
			}, 100);
		}
	});
	
	host.on('t_stop', function(){
		clearInterval(interval);
		interval = null;
	});
	
	host.on('t_reset', function(){
		clearInterval(interval);
		interval = null;
		
		margin = 0;
		emit('t_setMargin', margin);
	});
	
	emit = function(event, data){
		client.con.emit(event, data);
		host.emit(event, data);
	};
};