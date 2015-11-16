teleprompter.controller('hostCtrl', ['$scope', '$rootScope', '$http', 'socket', function($scope, $rootScope, $http, socket){
	$scope.roomId = 'n/a';
	
	socket.emit('host');
	socket.on('host', function(data){
		$scope.$apply(function(){
			$scope.roomId = data[0];
		});
	});
	
	$scope.$watch('text', function(){
		socket.emit('setText', $scope.text);
	});
	
	socket.on('client', function(data){
		console.log(data[0]);
		$scope.$apply(function(){
			$scope.clients = data[0];
		});
	});
}]);