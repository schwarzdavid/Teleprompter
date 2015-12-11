teleprompter.directive('trigger', ['socket', function(socket){
	return {
		restrict: 'A',
		link: function(scope, el, attr){
			angular.element(el).click(function($event){
				$event.preventDefault();
				
				if($event.target.tagName === 'BUTTON'){
					console.log("click");
					socket.emit(attr.trigger);
				}
			});
			
			angular.element(el).change(function($event){
				$event.preventDefault();
				
				console.log(el.val());
				
				socket.emit(attr.trigger, el.val());
			});
		}
	}
}]);