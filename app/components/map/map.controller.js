(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', '$modal', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, $modal, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = true;
    $scope.showAnalysis = false;
    $scope.map = {
      data: []
    };
    $scope.analysis = {
      data: []
    };
    $scope.populateDefaultDataFilters = populateDefaultDataFilters;
    $scope.populateDataFilters = populateDataFilters;
    $scope.resetDataFilters = resetDataFilters;
    $scope.populateIncidents = populateIncidents;
    $scope.populateAnalysis = populateAnalysis;

    /**
     * Load the data sources, filters, and data
     */
    IncidentService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        $scope.dataSources = dataSources;
        $scope.populateDefaultDataFilters();
        $scope.populateDataFilters();
        $scope.populateIncidents();
        $scope.populateAnalysis();
      });

    /**
     * Populate the default data filters - i.e. everything is empty.
     * @return {[type]} [description]
     */
    function populateDefaultDataFilters() {
      $scope.dataFilters = {
        years: [],
        beginDate: new Date(new Date().getFullYear() - 1, 0, 1),
        endDate: new Date(new Date().getFullYear(), 11, 31),
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
    }

    /**
     * Populate the data filters with data returned from the incident service.
     * @return {[type]} [description]
     */
    function populateDataFilters() {

      // Years, begin date, end date
      IncidentService.getYears($scope.dataSource.url)
        .then(function(years) {
          $scope.dataFilters.years = years;
          $scope.dataFilters.selectedYear = years[0];
          $scope.$watch(function() {
            return $scope.dataFilters.selectedYear;
          }, function(newValue) {
            $scope.dataFilters.beginDate = new Date(newValue, 0, 1, 0, 0, 0);
            $scope.dataFilters.endDate = new Date(newValue, 11, 31, 0, 0, 0);
          });
        });

      // Countries
      IncidentService.getCountries($scope.dataSource.url)
        .then(function(countries) {
          $scope.dataFilters.countries = countries;
          $scope.dataFilters.selectedClosestCoastalStates = [];
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

    function resetDataFilters() {
      $scope.populateDefaultDataFilters();
      $scope.populateDataFilters();
      $scope.populateIncidents();
      $scope.populateAnalysis();
    }

    function populateIncidents() {
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
      // Closes the loading modal when the data is populated
      IncidentService.getIncidents($scope.dataSource.url, filter, ['id', 'latitude', 'longitude'])
        .then(function(incidents) {
          $scope.map.data = incidents;
          modal.close();
        })
        .catch(function(error) {
          modal.close();
          $modal.open({
            template: 'An error occurred'
          });
        });
    }

    /**
     * Populate the data analysis. For now it's only one chart.
     * @return {Boolean} [description]
     */
    function populateAnalysis() {
      var filter = {
        beginDate: $scope.dataFilters.beginDate,
        endDate: $scope.dataFilters.endDate,
        closestCoastalState: $scope.dataFilters.selectedClosestCoastalStates
      };
      IncidentService.getIncidentsPerYearPerCountry($scope.dataSource.url, filter)
        .then(function(incidentsPerYear) {
          $scope.analysis.data = incidentsPerYear;
        });
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
