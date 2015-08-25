var mp = angular.module('mp');

mp.config(['$routeProvider', function($routeProvider) {
  'use strict';
  $routeProvider.when('/', {
    templateUrl: 'components/map/map.view.html',
    controller: 'MapController'
  })
  .when('/about', {
    templateUrl: 'components/static/about.view.html',
    controller: 'StaticController'
  })
  .when('/help', {
    templateUrl: 'components/static/help.view.html',
    controller: 'StaticController'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
