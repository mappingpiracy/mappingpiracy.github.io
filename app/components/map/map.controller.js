(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'SheetRockService', MapController]);

  function MapController($scope, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];

    SheetRockService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        SheetRockService.executeQuery($scope.dataSource.url, 'select *')
          .then(function(response) {
            console.log(response);
          });
      });

  }

})();
