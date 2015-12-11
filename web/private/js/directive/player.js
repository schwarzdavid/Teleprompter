teleprompter.directive('teleprompter', ['socket', function(socket){
	return {
		restrict: 'AE',
		templateUrl: '/page/teleprompter.html',
		replace: false,
		link: function(scope, el, attr){
			socket.emit('t_getText');
			socket.on('t_getText', function(data){
				scope.$apply(function(){
					scope.teleText = data[0];
				});
			});
			
			socket.on('t_setMargin', function(data){
				angular.element(el).find('p').css('margin-top', data[0]+'px');
			});
		}
	};
}]);