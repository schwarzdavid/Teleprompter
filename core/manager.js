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
			var r = new Room(admin),
				id = genId();
			
			rooms[id] = r;
			
			return id;
		},
		
		findRoom: function(rid){
			if(rid && rooms[rid]){
				return rooms[rid];
			}
			return false;
		}
	};
}());