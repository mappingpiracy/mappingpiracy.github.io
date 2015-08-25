mpmap.config(["$routeProvider", function($routeProvider){
  $routeProvider.
  when('/map', {
    templateUrl: 'components/map/MapView.html',
    controller: 'MapController'
  }).
  when('/about', {
    templateUrl: 'components/about/AboutView.html',
    controller: 'StaticPageController'
  }).
  when('/help', {
    templateUrl: 'components/help/HelpView.html',
    controller: 'StaticPageController'
  }).
  otherwise({
    redirectTo: '/map'
  });
}]);