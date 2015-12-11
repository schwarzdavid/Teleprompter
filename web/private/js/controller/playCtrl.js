teleprompter.controller('playCtrl', ['$scope', '$state', '$timeout', '$window', 'socket', function($scope, $state, $timeout, $window, socket){
	socket.on('kick', function(){
		$state.go('host');
	});
	
	socket.emit('t_getSize');
	socket.on('t_setSize', function(size){
		$scope.$apply(function(){
			var factor = $window.innerWidth/size[0].x*0.95;
			if($window.innerHeight > $window.innerWidth){
				factor = $window.innerHeight/size[0].y*0.95;
			}
			
			$scope.resolution = {
				'width': size[0].x,
				'height': size[0].y,
				'transform': 'scale('+factor+')'
			};
		});
	});
}]);