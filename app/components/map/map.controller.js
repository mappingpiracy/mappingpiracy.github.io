(function() {
  'use strict';

  mp.controller('MapController', ['$scope', 'IncidentService', 'IncidentAnalysisService', '$modal', 'SheetRockService', MapController]);

  function MapController($scope, IncidentService, IncidentAnalysisService, $modal, SheetRockService) {

    $scope.dataSource = null;
    $scope.dataSources = [];
    $scope.showFilters = true;
    $scope.showAnalysis = false;
    $scope.applyFilters = applyFilters;
    $scope.populateDefaultData = populateDefaultData;

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

    /**
     * Define the incidents per year chart
     * @type {Object}
     */
    $scope.incidentsPerYearChart = {
      chart: {
        type: 'lineChart',
        x: function(d) {
          return d.year;
        },
        y: function(d) {
          return d.count;
        },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Years',
          tickValues: []
        },
        yAxis: {
          axisLabel: 'Incidents',
          axisLabelDistance: 30
        },
        data: [],
        dispatch: {
          stateChange: function(e) { /* console.log("stateChange"); */ },
          changeState: function(e) { /* console.log("changeState"); */ },
          tooltipShow: function(e) { /* console.log("tooltipShow"); */ },
          tooltipHide: function(e) { /* console.log("tooltipHide"); */ }
        },
        callback: function(chart) {}
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

        populateDefaultData();

      });

    function populateDefaultData() {

      IncidentService.getYears($scope.dataSource.url)
        .then(function(years) {
          $scope.dataFilters.years = years;
          $scope.dataFilters.selectedYear = years[0];
          // TODO: refactor
          $scope.dataFilters.beginDate = new Date(years[0], 0, 1, 0, 0, 0);
          $scope.dataFilters.endDate = new Date(years[0], 11, 31, 0, 0, 0);

          $scope.$watch(function() {
            return $scope.dataFilters.selectedYear;
          }, function(newValue) {
            $scope.dataFilters.beginDate = new Date(newValue, 0, 1, 0, 0, 0);
            $scope.dataFilters.endDate = new Date(newValue, 11, 31, 0, 0, 0);
          });

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
        },
        modal = $modal.open({
          template: 'Populating Data'
        });

      IncidentService.getIncidents($scope.dataSource.url, filter, ['id', 'latitude', 'longitude'])
        .then(function(incidents) {
          $scope.map.geojson.data = incidents;
          modal.close();
        })
        .catch(function(error) {
          modal.close();
          $modal.open({
            template: 'An error occurred'
          });
        });

      IncidentService.getIncidentsPerYear($scope.dataSource.url, filter.beginDate, filter.endDate, filter.closestCoastalState)
        .then(function(incidentsPerYear) {
          // TODO: refactor
          $scope.incidentsPerYearChart.chart.xAxis.tickValues = [];
          for (var i = $scope.dataFilters.beginDate.getFullYear(); i <= $scope.dataFilters.endDate.getFullYear(); i++) {
            $scope.incidentsPerYearChart.chart.xAxis.tickValues.push(i);
          }
          if (filter.closestCoastalState.length > 0) {
            $scope.incidentsPerYearChart.chart.data = incidentsPerYear;
          } else {
            $scope.incidentsPerYearChart.chart.data = incidentsPerYear.splice(0, 5);
          }
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
