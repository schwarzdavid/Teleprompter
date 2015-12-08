var Player = require('./player.js');

module.exports = function(con, rid){
	var text = '', clients = {}, owner = con, player = null;
	
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
	
	owner.on('play', function(sid){
		player = new Player(owner, clients[sid], text);
	});
	
	owner.on('stop', function(){
		player = null;
	});
	
	owner.on('getText', function(){
		owner.emit('setText', text);
	});
	
	owner.on('updateClients', function(){
		updateClients();
	});
	
	owner.on('disconnect', function(){
		var manager = require('./manager.js');
		for(var i in clients){
			clients[i].con.emit('kick', {});
		}
		manager.deleteRoom(rid);
	});

	this.addClient = function(con, resolution){
		clients[con.id] = {
			id: con.id,
			con: con,
			ip: con.handshake.address,
			resolution: resolution
		};
		
		clients[con.id].con.on('setResolution', function(data){
			clients[con.id].resolution = data;
			updateClients();
		});
		
		clients[con.id].con.on('disconnect', function(){
			console.log("BAUM");
			
			clients[con.id] = null;
			delete clients[con.id];
		});
	};
	
	this.findClient = function(sid){
		if(clients[sid] || owner.id === sid){
			return true;
		}
		return false;
	};
};