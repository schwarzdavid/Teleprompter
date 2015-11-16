teleprompter.controller('clientCtrl', ['$scope', '$rootScope', '$http', '$window', '$state', 'socket', function($scope, $rootScope, $http, $window, $state, socket){
	function sendResolution(){
		socket.emit('setResolution', { 
			x: $window.innerWidth, 
			y: $window.innerHeight
		});
	}
	sendResolution();
	angular.element($window).on('resize', sendResolution);
	
	socket.on('disconnect', function(){
		console.log("disconnected");
		$state.go('root');
	});
	
	socket.on('kick', function(){
		console.log("kicked");
		$state.go('root');
	});
}]);