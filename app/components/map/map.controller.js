(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = true;
    $scope.showAnalysis = false;
    $scope.updateDataSource = updateDataSource;
    $scope.pushItemToArray = pushItemToArray;

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
        lat: -10,
        lng: 50,
        zoom: 3
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

    $scope.dataFilters = {
      years: [],
      selectedYear: null,
      countries: [],
      selectedClosestCoastalStates: [],
      selectedVesselCountries: [],
      territorialWaterStatuses: [],
      selectedTerritorialWaterStatuses: [],
      incidentTypes: [],
      selectedIncidentTypes: [],
      incidentActions: [],
      selectedIncidentActions: []
    };

    /**
     * Load the data sources and data
     */
    IncidentService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        $scope.dataSources = dataSources;

        populateDefaultData();

      });

    function populateDefaultData() {
      IncidentService.getDefaultIncidents($scope.dataSource.url)
        .then(function(incidents) {
          $scope.map.geojson.data = incidents;
        });

      IncidentService.getYears($scope.dataSource.url)
        .then(function(years) {
          $scope.dataFilters.years = years;
          $scope.dataFilters.selectedYear = years[0];
        });

      IncidentService.getCountries($scope.dataSource.url)
        .then(function(countries) {
          $scope.dataFilters.countries = countries;
        });

      IncidentService.getTerritorialWaterStatuses($scope.dataSource.url)
        .then(function(territorialWaterStatuses) {
          $scope.dataFilters.territorialWaterStatuses = territorialWaterStatuses;
        });

      IncidentService.getIncidentTypes($scope.dataSource.url)
        .then(function(incidentTypes) {
          $scope.dataFilters.incidentTypes = incidentTypes;
        });

      IncidentService.getIncidentActions($scope.dataSource.url)
        .then(function(incidentActions) {
          $scope.dataFilters.incidentActions = incidentActions;
        });

      IncidentService.getVesselStatuses($scope.dataSource.url)
        .then(function(vesselStatuses) {
          $scope.dataFilters.vesselStatuses = vesselStatuses;
        });

    }

    function updateDataSource() {

    }

    function pushItemToArray(item, array) {
      array.push(item);
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
