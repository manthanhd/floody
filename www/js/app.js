// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic-toast'])

  .run(function ($ionicPlatform, $window) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      var storedBookmarks = $window.localStorage["countybookmarks"];
      if(!storedBookmarks) {
        $window.localStorage["countybookmarks"] = JSON.stringify({bookmarks: []});
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/tab/bookmarks');

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: "TabsController"
      })
        .state('tab.counties', {
          url: '/counties',
          views: {
            'tab-counties': {
              controller: 'CountiesController',
              templateUrl: 'templates/tab-counties.html'
            }
          }
        })
        .state('tab.county', {
          url: '/counties/county',
          views: {
            'tab-counties': {
              controller: 'CountyStationsController',
              templateUrl: 'templates/tab-counties-county-stations.html'
            }
          }
        })
        .state('tab.showItem', {
          url: '/counties/showItem',
          views: {
            'tab-counties': {
              controller: 'ItemDetailController',
              templateUrl: 'templates/tab-counties-item-detail.html'
            }
          }
        })
      .state('tab.showNearMe', {
        url: '/nearMe',
        views: {
          'tab-nearme': {
            controller: 'NearMeController',
            templateUrl: 'templates/tab-near-me.html'
          }
        }
      })
      .state('tab.bookmarks', {
        url: '/bookmarks',
        views: {
          'tab-bookmarks': {
            controller: 'BookmarksController',
            templateUrl: 'templates/tab-bookmarks.html'
          }
        }
      });
  })

  .filter('unique', function () {

    return function (items, filterOn) {

      if (filterOn === false) {
        return items;
      }

      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var hashCheck = {}, newItems = [];

        var extractValueToCompare = function (item) {
          if (angular.isObject(item) && angular.isString(filterOn)) {
            if (filterOn.indexOf('.') !== -1) {
              var res = filterOn.split(".");
              return item[res[0]][res[1]];
            }

            return item[filterOn];
          } else {
            return item;
          }
        };

        angular.forEach(items, function (item) {
          var valueToCheck, isDuplicate = false;

          for (var i = 0; i < newItems.length; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }

        });
        items = newItems;
      }
      return items;
    };
  })

  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focusMe, function (value) {
          if (value === true) {
            $timeout(function () {
              element[0].focus();
              scope[attrs.focusMe] = false;
            });
          }
        });
      }
    };
  })

  /*.factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }])*/

  .factory('BookmarkService', function($window) {
    var thisService = this;

    this.getBookmarks = function() {
      var bookmarks;
      var storedBookmarks = $window.localStorage["countybookmarks"];
      if(storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
        bookmarks = bookmarks.bookmarks;
      }

      if(!bookmarks) {
        bookmarks = [];
        this.persistBookmarks(bookmarks);
      }

      return bookmarks;
    };

    this.persistBookmarks = function(bookmarks) {
      if(!bookmarks || bookmarks.length == 0) {
        $window.localStorage["countybookmarks"] = JSON.stringify({bookmarks:[]});
        return;
      }

      $window.localStorage["countybookmarks"] = JSON.stringify({bookmarks: bookmarks});
    };

    this.bookmark = function(county) {
      var bookmarks = this.getBookmarks();

      for(var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if(bookmark == county) {
          return;
        }
      }

      bookmarks.push(county);
      thisService.persistBookmarks(bookmarks);
    };

    this.isBookmarked = function(county) {
      var bookmarks = this.getBookmarks();

      for(var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if(bookmark == county) {
          return i;
        }
      }

      return undefined;
    };

    this.removeBookmark = function(county) {
      var location = this.isBookmarked(county);
      if(typeof location != 'number') {
        return;
      }

      var bookmarks = this.getBookmarks();
      bookmarks.splice(location, 1);
      this.persistBookmarks(bookmarks);
    };

    console.log("service init");

    return this;
  });
