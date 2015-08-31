(function() {
  'use strict';

  mp.controller('MapController', ['IncidentService', '$modal', '$scope', 'SheetRockService', MapController]);

  function MapController(IncidentService, $modal, $scope, SheetRockService) {

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
    $scope.createDataFilters = createDataFilters;
    $scope.populateDataFilters = populateDataFilters;
    $scope.resetDataFilters = resetDataFilters;
    $scope.populateIncidents = populateIncidents;
    $scope.populateAnalysis = populateAnalysis;
    $scope.exportData = exportData;

    /**
     * Load the data sources, filters, and data
     */
    IncidentService.getDataSources()
      .then(function(dataSources) {
        $scope.dataSource = dataSources[0];
        $scope.dataSources = dataSources;
        $scope.createDataFilters();
        $scope.populateDataFilters();
        $scope.populateIncidents();
        $scope.populateAnalysis();
      });

    /**
     * Populate the default data filters - i.e. everything is empty.
     * @return {[type]} [description]
     */
    function createDataFilters() {
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

    function getDataFilters() {
      return {
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
      $scope.createDataFilters();
      $scope.populateDataFilters();
      $scope.populateIncidents();
      $scope.populateAnalysis();
    }

    function populateIncidents() {
      var filter = getDataFilters();

      // Open a loading modal
      var modal = $modal.open({
        template: 'Loading Data'
      });

      // Get the incidents to create markers
      // Closes the loading modal when the data is populated
      IncidentService.getIncidents($scope.dataSource.url, filter, ['*'])
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

    function exportData() {
      var filter = getDataFilters();
      IncidentService.exportIncidentsCSV($scope.dataSource.url, filter);
    }

  }

})();
