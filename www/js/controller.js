angular.module('starter')
  .controller('CountiesController', function ($scope, $rootScope, $http, $state, $ionicPopover, $ionicListDelegate, ionicToast, BookmarkService) {
    $scope.showSearch = function () {
      $scope.searchBar = true;
    };

    $scope.hideSearch = function () {
      $scope.searchBar = false;
      $scope.searchString = undefined;
    };

    $http.get('http://environment.data.gov.uk/flood-monitoring/id/floods').then(function (data, response) {
      $scope.$parent.items = data.data.items;
    });

    $scope.showItem = function (item) {
      $scope.$parent.item = item;
      $state.go("tab.county");
    };

    $scope.isBookmarked = function(county) {
      return BookmarkService.isBookmarked(county);
    };

    $scope.getBookmarks = function() {
      return BookmarkService.getBookmarks();
    };

    $scope.bookmarkCounty = function(county) {
      BookmarkService.bookmark(county);
      $rootScope.$broadcast("bookmark:add");
      $ionicListDelegate.closeOptionButtons();
      ionicToast.show("Watch set on " + county, "bottom", false, 2500);
    };

    $scope.removeBookmark = function(county) {
      BookmarkService.removeBookmark(county);
      $ionicListDelegate.closeOptionButtons();
      $rootScope.$broadcast("bookmark:remove");
      ionicToast.show("Watch removed from " + county, "bottom", false, 2500);
    };

    $ionicPopover.fromTemplateUrl('templates/popover-menu.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
  })

  .controller('CountyStationsController', function ($scope, $http, $state) {
    $scope.showSearch = function () {
      $scope.searchBar = true;
    };

    $scope.hideSearch = function () {
      $scope.searchBar = false;
      $scope.searchString = undefined;
    };

    $scope.item = $scope.$parent.item;
    $scope.showItem = function (item) {
      $scope.$parent.item = item;
      $state.go("tab.showItem");
    }
  })

  .controller('ItemDetailController', function ($scope, $http, $stateParams) {
    var itemIdLink = $scope.$parent.item["@id"];
    $http.get(itemIdLink).then(function (data) {
      $scope.item = data.data.items;

      switch ($scope.item.severityLevel) {
        case 1:
          $scope.explaination = "Severe flooding. Danger to life.";
          break;
        case 2:
          $scope.explaination = "Flooding is expected. Immediate action required";
          break;
        case 3:
          $scope.explaination = "Flooding is possible. Be prepared";
          break;
        case 4:
          $scope.explaination = "Flood warnings and flood alerts that have been removed in the last 24 hours.";
          break;
      }
    });
  })

  .controller('NearMeController', function($scope, $http) {

  })

  .controller('TabsController', function($scope, $http) {

  })

  .controller('BookmarksController', function($scope, $rootScope, $state, $ionicListDelegate, ionicToast, BookmarkService) {

    $scope.refreshBookmarks = function() {
      $scope.items = BookmarkService.getBookmarks();
    };

    $scope.removeBookmark = function(county) {
      BookmarkService.removeBookmark(county);
      $scope.items = BookmarkService.getBookmarks();
      $ionicListDelegate.closeOptionButtons();
      ionicToast.show(county + " removed from bookmarks.", "bottom", false, 2500);
    };

    $scope.$on("bookmark:add", function(event) {
      console.log("Add event happened!");
      $scope.refreshBookmarks();
    });

    $scope.$on("bookmark:remove", function(event) {
      console.log("Remove event happened!");
      $scope.refreshBookmarks();
    });

    $scope.refreshBookmarks();

    if(!$scope.items || $scope.items.length == 0) {
      return $state.go('tab.counties');
    }
  });
