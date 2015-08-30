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
      var modal = $modal.open({
        template: 'Populating Data'
      });
      IncidentService.getDefaultIncidents($scope.dataSource.url)
        .then(function(incidents) {
          $scope.map.geojson.data = incidents;
          modal.close();
        });

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

          return IncidentService.getIncidentsPerYear($scope.dataSource.url, $scope.dataFilters.beginDate, $scope.dataFilters.endDate, [], true);
        })
        .then(function(incidentsPerYear) {
          console.log(incidentsPerYear);
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
          return IncidentService.getIncidentsPerYear($scope.dataSource.url, filter.beginDate, filter.endDate, filter.closestCoastalState);
        })
        .then(function(incidents) {
          console.log(incidents);
          modal.close();
        })
        .catch(function(error) {
          $modal.close();
          $modal.open({
            template: 'An error occurred'
          });
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

    // Begin shit code

    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function(d) {
          return d.x;
        },
        y: function(d) {
          return d.y;
        },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function(e) {
            console.log("stateChange");
          },
          changeState: function(e) {
            console.log("changeState");
          },
          tooltipShow: function(e) {
            console.log("tooltipShow");
          },
          tooltipHide: function(e) {
            console.log("tooltipHide");
          }
        },
        xAxis: {
          axisLabel: 'Time (ms)'
        },
        yAxis: {
          axisLabel: 'Voltage (v)',
          tickFormat: function(d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: 30
        },
        callback: function(chart) {
          console.log("!!! lineChart callback !!!");
        }
      },
      title: {
        enable: true,
        text: 'Title for Line Chart'
      },
      subtitle: {
        enable: true,
        text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
        css: {
          'text-align': 'center',
          'margin': '10px 13px 0px 7px'
        }
      },
      caption: {
        enable: true,
        html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
        css: {
          'text-align': 'justify',
          'margin': '10px 13px 0px 7px'
        }
      }
    };

    $scope.data = sinAndCos();

    /*Random Data Generator */
    function sinAndCos() {
      var sin = [],
        sin2 = [],
        cos = [];

      //Data is represented as an array of {x,y} pairs.
      for (var i = 0; i < 100; i++) {
        sin.push({
          x: i,
          y: Math.sin(i / 10)
        });
        sin2.push({
          x: i,
          y: i % 10 == 5 ? null : Math.sin(i / 10) * 0.25 + 0.5
        });
        cos.push({
          x: i,
          y: .5 * Math.cos(i / 10 + 2) + Math.random() / 10
        });
      }

      //Line chart data should be sent as an array of series objects.
      return [{
        values: sin, //values - represents the array of {x,y} data points
        key: 'Sine Wave', //key  - the name of the series.
        color: '#ff7f0e' //color - optional: choose your own line color.
      }, {
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      }, {
        values: sin2,
        key: 'Another sine wave',
        color: '#7777ff',
        area: true //area - set to true if you want this line to turn into a filled area chart.
      }];
    };

  }

})();
