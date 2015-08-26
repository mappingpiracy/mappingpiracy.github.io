(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = false;
    $scope.showAnalysis = false;

    /**
     * Define the map object, which is used for the incident map
     * @type {Object}
     */
    $scope.map = {
      defaults: {
        tileLayer: "http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png",
        maxZoom: 14
      },
      center: {
        lat: -20,
        lng: 100,
        zoom: 2
      },
      geojson: {}
    };


    /**
     * Load the data sources and data
     */
    IncidentService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        $scope.dataSources = dataSources;
        return IncidentService.getDefaultIncidents($scope.dataSource.url);
      })
      .then(function(incidents) {
        console.log(incidents);
        $scope.map.geojson.data = incidents;
      });
  }

})();
