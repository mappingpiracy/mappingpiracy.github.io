(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', '$modal', '$q', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, $modal, $q, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = true;
    $scope.showAnalysis = false;
    $scope.applyFilters = applyFilters;
    $scope.populateDefaultData = populateDefaultData;
    $scope.analysis = {};

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
      beginDate: new Date(),
      endDate: new Date(),
      selectedYear: null,
      countries: [],
      selectedClosestCoastalStates: [],
      selectedVesselCountries: [],
      territorialWaterStatuses: [],
      selectedTerritorialWaterStatuses: [],
      geolocationSources: [],
      selectedGeolocationSources: [],
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
        $scope.populateDefaultData();
      })

    function populateDefaultData() {

      IncidentService.getYears($scope.dataSource.url)
        .then(function(years) {
          $scope.dataFilters.years = years;
          $scope.dataFilters.selectedYear = years[0];
          $scope.dataFilters.beginDate = new Date(years[0], 0, 1, 0, 0, 0);
          $scope.dataFilters.endDate = new Date(years[0], 11, 31, 0, 0, 0);

          $scope.$watch(function() {
            return $scope.dataFilters.selectedYear;
          }, function(newValue) {
            $scope.dataFilters.beginDate = new Date(newValue, 0, 1, 0, 0, 0);
            $scope.dataFilters.endDate = new Date(newValue, 11, 31, 0, 0, 0);
          });

          //TODO: should this be here?
          $scope.applyFilters();

        });

      IncidentService.getCountries($scope.dataSource.url)
        .then(function(countries) {
          $scope.dataFilters.countries = countries;
          $scope.dataFilters.selectedCountries = [];
        });

      IncidentService.getTerritorialWaterStatuses($scope.dataSource.url)
        .then(function(territorialWaterStatuses) {
          $scope.dataFilters.territorialWaterStatuses = territorialWaterStatuses;
          $scope.dataFilters.selectedTerritorialWaterStatuses = [];
        });

      IncidentService.getIncidentTypes($scope.dataSource.url)
        .then(function(incidentTypes) {
          $scope.dataFilters.incidentTypes = incidentTypes;
          $scope.dataFilters.selectedIncidentTypes = [];
        });

      IncidentService.getIncidentActions($scope.dataSource.url)
        .then(function(incidentActions) {
          $scope.dataFilters.incidentActions = incidentActions;
          $scope.dataFilters.selectedIncidentActions = [];
        });

      IncidentService.getVesselStatuses($scope.dataSource.url)
        .then(function(vesselStatuses) {
          $scope.dataFilters.vesselStatuses = vesselStatuses;
          $scope.dataFilters.selectedVesselStatuses = [];
        });

      IncidentService.getGeolocationSources()
        .then(function(geolocationSources) {
          $scope.dataFilters.geolocationSources = geolocationSources;
          $scope.dataFilters.selectedGeolocationSources = [];
        });



    }

    /**
     * Compile and send all of the selected values to the incident
     * service to return a newly-filtered set of incidents.
     * @return {[type]} [description]
     */
    function applyFilters() {
      var filter = {
        beginDate: $scope.dataFilters.beginDate,
        endDate: $scope.dataFilters.endDate,
        closestCoastalState: $scope.dataFilters.selectedClosestCoastalStates,
        territorialWaterStatus: $scope.dataFilters.selectedTerritorialWaterStatuses,
        geolocationSource: $scope.dataFilters.selectedGeolocationSources,
        vesselCountry: $scope.dataFilters.selectedVesselCountries,
        vesselStatus: $scope.dataFilters.selectedVesselStatuses,
        incidentType: $scope.dataFilters.selectedIncidentTypes,
        incidentAction: $scope.dataFilters.selectedIncidentActions
      };

      // Open a loading modal
      var modal = $modal.open({
        template: 'Loading Data'
      });

      // Get the incidents to create markers
      IncidentService.getIncidents($scope.dataSource.url, filter, ['id', 'latitude', 'longitude'])
        .then(function(incidents) {
          $scope.map.geojson.data = incidents;
          // Close the loading modal
          modal.close();
        })
        .catch(function(error) {
          // Close the loading modal, open another for any errors
          modal.close();
          $modal.open({
            template: 'An error occurred'
          });
        });

      IncidentService.getIncidentsPerYear($scope.dataSource.url, filter.beginDate, filter.endDate, filter.closestCoastalState)
        .then(function(incidentsPerYear) {
          $scope.analysis.incidentsPerYear = incidentsPerYear;
        });
    }

    $scope.changeDirective = function() {
      console.log('here foo');
      $scope.analysis.incidentsPerYear = ['foo', 'bar'];
    }

    function renderPopup(feature, layer) {
      IncidentService.getIncidents($scope.dataSource.url, {
          id: feature.properties.id
        })
        .then(function(incidents) {
          var incident = incidents.features[0];
          if (angular.isUndefined(layer.getPopup())) {
            layer.bindPopup(IncidentService.getPopupContent(incident), {
              minWidth: 450
            });
          }
          layer.openPopup();
        });
    }

  }

})();
