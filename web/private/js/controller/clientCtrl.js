teleprompter.controller('clientCtrl', ['$scope', '$rootScope', '$http', '$window', '$state', 'socket', function($scope, $rootScope, $http, $window, $state, socket){
	function sendResolution(){
		socket.emit('setResolution', { 
			x: $window.innerWidth, 
			y: $window.innerHeight
		});
	}
	sendResolution();
	angular.element($window).on('resize', sendResolution);
	
	socket.on('kick', function(){
		$state.go('root');
	});
}]);