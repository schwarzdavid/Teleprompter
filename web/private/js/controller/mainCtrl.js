teleprompter.controller('mainCtrl', ['$scope', '$state', 'socket', function($scope, $state, socket){
	$scope.$watch('roomId', function(){
		socket.emit('join', $scope.roomId);
	});
	
	socket.on('join', function(data){
		$state.go('client');
	});
}]);