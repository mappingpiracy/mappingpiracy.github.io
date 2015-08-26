(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['$http', '$log', 'SheetRockService'];

  function IncidentService($http, $log, SheetRockService) {

    var columnMap = {
      'reference_id': 'A',
      'date': 'B',
      'latitude': 'J',
      'longitude': 'K'
    };

    var service = {
      getIncidents: getIncidents,
      getDefaultIncidents: getDefaultIncidents,
      getCountries: getCountries,
      getVesselTypes: getVesselTypes,
      getVesslStatuses: getVesslStatuses,
      getIncidentTypes: getIncidentTypes,
      getIncidentActions: getIncidentActions,
      getDataSources: getDataSources
    };

    return service;

    function getDefaultIncidents(url) {
      console.log(columnMap);
      var query = 'select ' + columnMap['latitude'] + ', ' + columnMap['longitude'] + ' order by ' + columnMap['date'] + ' desc';
      return SheetRockService.executeQuery(url, query, 10)
        .then(function(incidents) {
          incidents = sanitizeIncidents(incidents);
          incidents = convertIncidentsToGeoJson(incidents);
          return incidents;
        });
    }

    function getIncidents(url, filter) {
      return SheetRockService.executeQuery(url, 'select *');
    }

    function sanitizeIncidents(incidents) {
        incidents.forEach(function(incident, index) {
          if(angular.isDefined(incident.date)) {
            incident.date = SheetRockService.convertDate(incident.date);
          }
          // if(!incident.longitude || !incident.latitude) {
          //   console.log('bad')
          //   incidents.splice(index, 1);
          // }
        });
        return incidents;
    }

    function convertIncidentsToGeoJson(incidents) {
      var geojson = GeoJSON.parse(incidents, {
        Point: ['latitude', 'longitude']
      });
      geojson.features.forEach(function(feature, index) {

      })
    }

    function getCountries() {

    }

    function getVesselTypes() {

    }

    function getVesslStatuses() {

    }

    function getIncidentTypes() {

    }

    function getIncidentActions() {

    }

    function getDataSources() {

      return $http.get('config/data-sources.json')
        .then(function(response) {
          self.dataSources = response.data;
          return self.dataSources;
        });
    }

  }

})();
