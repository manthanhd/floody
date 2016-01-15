angular.module('starter')
  .controller('HomeController', function ($scope, $http, $state, $ionicPopover, $ionicListDelegate, ionicToast) {
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
      $state.go("county");
    };

    $scope.isBookmarked = function(county) {
      var bookmarks;
      var storedBookmarks = window.localStorage["countyBookmarks"];
      if(storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
      }

      if(!bookmarks) {
        bookmarks = [];
        $scope.$parent.countyBookmarks = bookmarks;
      }

      for(var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if(bookmark === county) {
          $ionicListDelegate.closeOptionButtons();
          return i;
        }
      }

      return undefined;
    };

    $scope.getBookmarks = function() {
      var bookmarks;
      var storedBookmarks = window.localStorage["countyBookmarks"];
      if(storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
      }

      if(!bookmarks) {
        bookmarks = [];
      }

      return bookmarks;
    };

    $scope.persistBookmarks = function(bookmarks) {
      $scope.$parent.countyBookmarks = bookmarks;

      if(!bookmarks) {
        window.localStorage["countyBookmarks"] = undefined;
        return;
      }

      window.localStorage["countyBookmarks"] = JSON.stringify(bookmarks);
    };

    $scope.bookmarkCounty = function(county) {
      var bookmarks;
      var storedBookmarks = window.localStorage["countyBookmarks"];
      if(storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
      }

      if(!bookmarks) {
        bookmarks = [];
        $scope.$parent.countyBookmarks = bookmarks;
      }

      for(var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if(bookmark === county) {
          $ionicListDelegate.closeOptionButtons();
          return;
        }
      }

      bookmarks.push(county);
      $scope.$parent.countyBookmarks = bookmarks;
      window.localStorage["countyBookmarks"] = JSON.stringify(bookmarks);
      $ionicListDelegate.closeOptionButtons();
      ionicToast.show(county + " added to bookmarks.", "bottom", false, 2500);
    };

    $scope.removeBookmark = function(county) {
      var location = $scope.isBookmarked(county);
      if(!location) {
        return;
      }

      var bookmarks = $scope.getBookmarks();
      bookmarks.splice(location, 1);
      $scope.persistBookmarks(bookmarks);
      console.log(bookmarks);
      ionicToast.show(county + " removed from bookmarks.", "bottom", false, 2500);
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
      $state.go("showItem");
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
  });
