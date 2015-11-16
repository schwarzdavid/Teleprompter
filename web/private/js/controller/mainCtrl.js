teleprompter.controller('mainCtrl', ['$scope', '$state', '$window', 'socket', function($scope, $state, $window, socket){
	socket.emit('disconnect', true);
	$scope.$watch('roomId', function(){
		socket.emit('join', {
			rid:$scope.roomId,
			resolution: {
				x: $window.innerWidth,
				y: $window.innerHeight
			}
		});
	});
	
	socket.on('join', function(data){
		$state.go('client');
	});
}]);