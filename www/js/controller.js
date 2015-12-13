angular.module('starter')
  .controller('HomeController', function ($scope, $http, $state) {
    $http.get('http://environment.data.gov.uk/flood-monitoring/id/floods').then(function (data, response) {
      $scope.$parent.items = data.data.items;
    });
    $scope.showItem = function (item) {
      $scope.$parent.item = item;
      $state.go("county");
    };
  })

  .controller('CountyStationsController', function ($scope, $http, $state) {
    $scope.item = $scope.$parent.item;
    $scope.showItem = function (item) {
      $scope.$parent.item = item;
      $state.go("showItem");
    }
  })

  .controller('ItemDetailController', function ($scope, $http, $stateParams) {
    var itemIdLink = $scope.$parent.item["@id"];
    $http.get(itemIdLink).then(function(data) {
      $scope.item = data.data.items;
    });
  });
