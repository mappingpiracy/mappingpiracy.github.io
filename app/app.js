var mp = angular.module('mp', [
  'ngMaterial',
  'ngRoute',
  'leaflet-directive'
]);

mp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('yellow');
});

mp.config(['$routeProvider', function($routeProvider) {
  'use strict';
  $routeProvider.when('/', {
    templateUrl: 'app/components/map/map.view.html',
    controller: 'MapController'
  })
  .when('/about', {
    templateUrl: 'app/components/static/about.view.html',
    controller: 'StaticController'
  })
  .when('/help', {
    templateUrl: 'app/components/static/help.view.html',
    controller: 'StaticController'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
