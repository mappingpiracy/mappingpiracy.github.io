(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService) {

    $scope.dataSource = null;
    $scope.dataSources = [];

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
