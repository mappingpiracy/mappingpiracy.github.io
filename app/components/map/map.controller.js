(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService) {

    $scope.dataSource = null;
    $scope.dataSources = [];

    $scope.map = {
      defaults: {
        tileLayer: "http://{s}.tiles.mapbox.com/v3/utkpiracyscience.k1ei0a8m/{z}/{x}/{y}.png",
        maxZoom: 14
      },
      center: {
          lat: 0,
          lng: 0,
          zoom: 3
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
