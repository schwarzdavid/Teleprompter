teleprompter.factory('socket', [function(){
	//var socket = io.connect('localhost:8080');
	return {
		on: function(eventName, callback){
			/*socket.on(eventName, function(){
				var argv = arguments;
				callback(argv);
			});*/
		},

		emit: function(eventName, data, callback){
			/*socket.emit(eventName, data);
			if(callback){
				callback.apply(socket);
			}*/
		}
	};
}]);