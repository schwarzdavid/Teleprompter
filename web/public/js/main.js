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
				template: 'Client bitch :@',
				controller: 'clientCtrl'
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
teleprompter.controller('hostCtrl', ['$scope', '$rootScope', '$http', 'socket', function($scope, $rootScope, $http, socket){
	$scope.roomId = 'n/a';
	
	socket.emit('host');
	socket.on('host', function(data){
		$scope.$apply(function(){
			$scope.roomId = data[0];
		});
	});
	
	$scope.$watch('text', function(){
		socket.emit('setText', $scope.text);
	});
	
	socket.on('client', function(data){
		console.log(data[0]);
		$scope.$apply(function(){
			$scope.clients = data[0];
		});
	});
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