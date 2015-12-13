angular.module('starter')
.controller('HomeController', function($scope, $http, $state) {
	$http.get('http://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=100').then(function(data, response) {
		console.log(data);
		$scope.$parent.items = data.data.items;
	});
	$scope.showItem = function(item) {
		$scope.$parent.item = item;
		$state.go("county");
	};
})

.controller('CountyStationsController', function($scope, $http, $stateParams) {
	var fwdCode = $stateParams.fwdCode;
	$scope.item = $scope.$parent.item;
	$scope.showItem = function(item) {
		$scope.$parent.item = item;
		$state.go("showItem");
	}
});