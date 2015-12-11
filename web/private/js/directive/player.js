teleprompter.directive('teleprompter', ['$sce', 'socket', function($sce, socket){
	return {
		restrict: 'AE',
		templateUrl: '/page/teleprompter.html',
		replace: false,
		link: function(scope, el, attr){
			socket.emit('t_getText');
			socket.on('t_getText', function(data){
				scope.$apply(function(){
					console.log(data);
					scope.teleText = $sce.trustAsHtml(data[0]);
				});
			});
			
			socket.on('t_setMargin', function(data){
				angular.element(el).find('p').css('margin-top', data[0]+'px');
			});
			
			socket.on('t_font', function(data){
				angular.element(el).find('p').css('font-size', data[0]+'em');
			});
		}
	};
}]);