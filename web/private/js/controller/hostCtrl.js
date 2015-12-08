teleprompter.controller('hostCtrl', ['$scope', '$rootScope', '$state', '$http', 'socket', function($scope, $rootScope, $state, $http, socket){
	$scope.roomId = 'n/a';
	
	socket.emit('host');
	socket.on('host', function(data){
		$scope.$apply(function(){
			$scope.roomId = data[0];
		});
	});
	
	$rootScope.$watch('text', function(){
		socket.emit('setText', $rootScope.text);
	});
	
	socket.emit('updateClients');
	socket.on('client', function(data){
		$scope.$apply(function(){
			$scope.clients = data[0];
		});
	});
	
	$scope.play = function($event, id){
		$event.preventDefault();
		
		socket.emit('play', id);
		$state.go('play');
	};
}]);