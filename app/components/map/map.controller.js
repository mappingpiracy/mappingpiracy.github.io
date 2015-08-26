(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = false;
    $scope.showAnalysis = false;

    IncidentService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        $scope.dataSources = dataSources;
      });


    $scope.map = {
      defaults: {
        tileLayer: "http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png",
        maxZoom: 14
      },
      center: {
          lat: 0,
          lng: 10,
          zoom: 2
      },
      geoJson: []
    };


  }

})();
