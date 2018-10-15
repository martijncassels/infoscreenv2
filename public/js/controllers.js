'use strict';

/* Controllers */
angular

.module('Infoscreenv2.controllers',[])

.controller('MainCtrl', MainCtrl)
.controller('HomeCtrl', HomeCtrl)
.controller('PackingCtrl', PackingCtrl);

MainCtrl.$inject = ['$scope','$http','_','$interval'];
HomeCtrl.$inject = ['$scope', '$route','$http','$interval','Helpers','moment'];
PackingCtrl.$inject = ['$scope', '$route', '$routeParams', '$http','$interval','Helpers','moment'];

function MainCtrl($scope,$http,_,$interval) {
	var vm = this;
	vm.title = '';
	vm.screens = [{
		title: 'Packing',
		url: 'packing2018'
	}];
}

function HomeCtrl($scope,$route,$http,$interval,Helpers,moment) {
		var vm = this;
		vm.title = '';

}

function PackingCtrl($scope,$route,$routeParams,$http,$interval,Helpers,moment) {
		var vm = this;
		vm.title = 'Packing';

		vm.getPacking = function(){
			$http.get('/api/packing2018/'+$routeParams.topRows+'/'+$routeParams.transportType+'/'+$routeParams.daysAhead+'/'+$routeParams.daysIncluded)
					.success(function(data) {
							data = Helpers.parseTimestamps(data);
							angular.forEach(data, function(value,index){
								value.Time = moment.utc(value.Time).format('HH:mm')
								value.ShipDate = moment.utc(value.ShipDate).format('YYYY-MM-DD');
							});
							vm.data = data;
					})
					.error(function(data) {
							console.log('Error: ' + data);
							vm.error = data;
					});
			}

		vm.getPacking();

		var packinginterval = $interval(function () {vm.getPacking()}, 60000);

		$scope.$on('$destroy', function() {
			$interval.cancel(packinginterval);
		});
}

// helpers
function getRandomValue (data) {
	var l = data.length, previous = l ? data[l - 1] : 50;
	var y = previous + Math.random() * 10 - 5;
	return y < 0 ? 0 : y > 100 ? 100 : y;
}
