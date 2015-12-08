module.exports = (function(){
	var Room = require('./room.js'),
		rooms = {}, 
		genId;
	
	genId = function(){
		var id = Math.floor(Math.random() * 90000 + 10000);
		if(rooms[id]){
			return genId();
		}
		return id;
	}; 

	return {
		createRoom: function(admin){
			var id = genId(),
				r = new Room(admin, id);
			
			rooms[id] = r;
			
			return id;
		},
		
		findRoom: function(rid){
			if(rid && rooms[rid]){
				return rooms[rid];
			}
			return false;
		},
		
		deleteRoom: function(rid){
			if(rid && rooms[rid]){
				rooms[rid] = null;
				delete rooms[rid];
			}
		},
		
		findClient: function(sid){
			for(var i in rooms){
				if(rooms[i].findClient(sid)){
					return true;
				}
			}
			return false;
		}
	};
}());