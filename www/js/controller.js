angular.module('starter')
  .controller('HomeController', function ($scope, $http, $state) {
    $scope.showSearch = function() {
      $scope.searchBar = true;
    };

    $scope.hideSearch = function() {
      $scope.searchBar = false;
      $scope.searchString = undefined;
    };

    $http.get('http://environment.data.gov.uk/flood-monitoring/id/floods').then(function (data, response) {
      $scope.$parent.items = data.data.items;
    });
    $scope.showItem = function (item) {
      $scope.$parent.item = item;
      $state.go("county");
    };
  })

  .controller('CountyStationsController', function ($scope, $http, $state) {
    $scope.showSearch = function() {
      $scope.searchBar = true;
    };

    $scope.hideSearch = function() {
      $scope.searchBar = false;
      $scope.searchString = undefined;
    };

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

      switch($scope.item.severityLevel) {
        case 1:
              $scope.explaination = "Severe flooding. Danger to life."; break;
        case 2:
              $scope.explaination = "Flooding is expected. Immediate action required"; break;
        case 3:
              $scope.explaination = "Flooding is possible. Be prepared"; break;
        case 4:
              $scope.explaination = "Flood warnings and flood alerts that have been removed in the last 24 hours."; break;
      }
    });
  });
