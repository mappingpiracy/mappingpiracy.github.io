(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = false;
    $scope.showAnalysis = false;
    $scope.updateDataSource = updateDataSource;

    /**
     * Define the map object, which is used for the incident map
     * @type {Object}
     */
    $scope.map = {
      defaults: {
        tileLayer: "http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png",
        maxZoom: 14,
        scrollWheelZoom: false
      },
      center: {
        lat: -20,
        lng: 100,
        zoom: 2
      },
      geojson: {
        data: null,
        onEachFeature: function(feature, layer) {
          layer.on({
            click: function(event) {
              renderPopup(feature, layer);
            }
          });
        }
      }
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
        $scope.map.geojson.data = incidents;
      });


    function updateDataSource() {

    }

    function renderPopup(feature, layer) {
      IncidentService.getIncidents($scope.dataSource.url, {
          id: feature.properties.id
        })
        .then(function(incidents) {
          if (angular.isUndefined(layer.getPopup())) {
            layer.bindPopup(angular.toJson(incidents[0]), {
              maxWidth: 450
            });
          }
          layer.openPopup();
        });
    }

  }

})();
