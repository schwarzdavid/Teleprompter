module.exports = function(con, rid){
	var text = '', clients = {}, owner = con;
	
	Object.observe(clients, updateClients);
	
	function updateClients(){
		var tmp = [];
		for(var i in clients){
			tmp.push({
				id:i,
				ip:clients[i].ip,
				width: clients[i].resolution.x,
				height: clients[i].resolution.y
			});
		}
		owner.emit('client', tmp);
	}

	owner.on('setText', function(data){
		text = data;
	});
	
	owner.on('disconnect', function(){
		var manager = require('./manager.js');
		for(var i in clients){
			clients[i].socket.emit('kick', {});
			console.log('disconnect');
		}
		manager.deleteRoom(rid);
	});

	this.addClient = function(con, resolution){
		clients[con.id] = {
			id: con.id,
			socket: con,
			ip: con.handshake.address,
			resolution: resolution
		};
		
		con.on('setResolution', function(data){
			clients[con.id].resolution = data;
			updateClients();
		});
		
		con.on('disconnect', function(){
			clients[con.id] = null;
			delete clients[con.id];
		});
	};
};