module.exports = function(admin){
	var text = '', clients = {};

	admin.on('setText', function(data){
		text = data;
	});

	Object.observe(clients, function(change){
		admin.emit('setClients', clients);
	});

	this.addClient = function(con){
		clients[con.id] = con;
	};
};