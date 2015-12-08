teleprompter.controller('playCtrl', ['$scope', '$state', 'socket', function($scope, $state, socket){
	socket.emit('init');
	
	socket.on('kick', function(){
		$state.go('host');
	});
}]);