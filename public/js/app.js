'use strict';

var Infoscreenv2 = angular.module('Infoscreenv2',[
	'ngRoute',
	'ngAria',
	'ngMessages',
	'ngAnimate',
	'Infoscreenv2.controllers',
	'Infoscreenv2.filters',
	'Infoscreenv2.services',
	'Infoscreenv2.directives',
	'chart.js',
	'ui.bootstrap',
	'angularMoment',
	'underscore',
	'angular.filter',
	'tmh.dynamicLocale',
	'ngOboe',
	'ngMaterial',
	'ngMessages']);

Infoscreenv2
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider,tmhDynamicLocaleProvider) {
		$routeProvider
				.when('/home', {templateUrl: 'partials/home/home', controller: 'HomeCtrl', controllerAs: 'vm', access: {restricted: false}})
				.when('/packing2018/:topRows/:transportType/:daysAhead/:daysIncluded', {templateUrl: 'partials/home/packing', controller: 'PackingCtrl', controllerAs: 'vm', access: {restricted: false}})
				.otherwise({redirectTo: '/home', access: {restricted: false}});
		$locationProvider.html5Mode(true);
}])
.run(function($rootScope, $interval) {
		var ScopeProt = Object.getPrototypeOf($rootScope);
		ScopeProt.$interval = function(func, time){
				 var timer = $interval(func,time);
				 this.on('$destroy', function(){ $timeout.cancel(timer); });
				 return timer;
		};
});
