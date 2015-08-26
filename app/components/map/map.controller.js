(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = false;
    $scope.showAnalysis = false;


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

    // SheetRockService.getDataSources()
    //   .then(function(dataSources) {
    //     $scope.dataSource = dataSources[0];
    //     SheetRockService.executeQuery($scope.dataSource.url, 'select *')
    //       .then(function(response) {
    //         console.log(response);
    //       });
    //   });

  }

})();
