teleprompter.controller('playCtrl', ['$scope', '$state', '$timeout', 'socket', function($scope, $state, $timeout, socket){
	socket.on('kick', function(){
		$state.go('host');
	});
}]);