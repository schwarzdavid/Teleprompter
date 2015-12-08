teleprompter.directive('teleprompter', ['socket', function(socket){
	return {
		restrict: 'AE',
		templateUrl: '/page/teleprompter.html',
		replace: false,
		link: function(scope, el, attr){
			socket.on('text', function(data){
				scope.teleText = data;
			});
		}
	};
}]);