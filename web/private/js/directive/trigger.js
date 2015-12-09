teleprompter.directive('trigger', ['socket', function(socket){
	return {
		restrict: 'A',
		link: function(scope, el, attr){
			angular.element(el).click(function($event){
				$event.preventDefault();
				
				socket.emit(attr.trigger);
			});
		}
	}
}]);