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
teleprompter.controller('hostCtrl', [function(){
	
}]);
teleprompter.controller('mainCtrl', ['$scope', '$state', 'socket', function($scope, $state, socket){
	$scope.$watch('roomId', function(){
		socket.emit('join', $scope.roomId);
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
				callback.apply(argv);
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