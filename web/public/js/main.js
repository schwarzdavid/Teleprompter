/* Teleprompter (c) 2015 by David Schwarz */

var teleprompter = angular.module('teleprompter', ['ui.router', 'ui.router.stateHelper']);

teleprompter.config(['stateHelperProvider', '$urlRouterProvider', function(stateHelperProvider, $urlRouterProvider){
	stateHelperProvider.state({
		name: 'root',
		url: '/',
		views: {
			'main': {
				templateUrl: '/page/index.html',
				controller: 'mainCtrl'
			}
		}
	}).state({
		name: 'host',
		url: '/host',
		views: {
			'main': {
				templateUrl: '/page/host.html',
				controller: 'hostCtrl'
			}
		}
	}).state({
		name: 'client',
		url: '/client',
		views: {
			'main': {
				templateUrl: '/page/client.html',
				controller: 'clientCtrl'
			}
		}
	}).state({
		name: 'play',
		views: {
			'main': {
				templateUrl: '/page/play.html',
				controller: 'playCtrl'
			}
		}
	}).state({
		name: 'err404',
		url: '/err404',
		views: {
			'main': {
				templateUrl: '/page/404.html'
			}
		}
	});
	
	$urlRouterProvider.when('', '/');
	$urlRouterProvider.otherwise('/err404');
}]);

teleprompter.run(['$state', 'socket', function($state, socket){
	if(!$state.is('root')){
		socket.emit('isConnected');
		socket.on('isConntected', function(data){
			if(!data){
				$state.go('root');
			}
		});
	}
	
	socket.on('disconnect', function(){
		console.log("disconnected");
		$state.go('root');
	});
}]);
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
teleprompter.controller('hostCtrl', ['$scope', '$rootScope', '$state', '$http', 'socket', function($scope, $rootScope, $state, $http, socket){
	$scope.roomId = 'n/a';
	$scope.resolution = {
		'width': '100vw',
		'height': '100vh'
	};
	
	socket.emit('host');
	socket.on('host', function(data){
		$scope.$apply(function(){
			$scope.roomId = data[0];
		});
	});
	
	$rootScope.$watch('text', function(){
		socket.emit('setText', $rootScope.text);
	});
	
	socket.emit('updateClients');
	socket.on('client', function(data){
		$scope.$apply(function(){
			$scope.clients = data[0];
		});
	});
	
	$scope.play = function($event, id){
		$event.preventDefault();
		
		socket.emit('play', id);
		$state.go('play');
	};
}]);
teleprompter.controller('mainCtrl', ['$scope', '$state', '$window', 'socket', function($scope, $state, $window, socket){
	socket.emit('disconnect', true);
	$scope.$watch('roomId', function(){
		socket.emit('join', {
			rid:$scope.roomId,
			resolution: {
				x: $window.innerWidth,
				y: $window.innerHeight
			}
		});
	});
	
	socket.on('join', function(data){
		$state.go('client');
	});
}]);
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
teleprompter.factory('socket', [function(){
	var socket = io.connect();
	return {
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var argv = arguments;
				callback(argv);
			});
		},

		emit: function(eventName, data, callback){
			socket.emit(eventName, data);
			if(callback){
				callback.apply(socket);
			}
		}
	};
}]);