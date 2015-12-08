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