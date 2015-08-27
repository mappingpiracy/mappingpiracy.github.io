(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['$http', '$log', 'SheetRockService'];

  function IncidentService($http, $log, SheetRockService) {

    var self = this;
    self.columnMap = {
      id: 'A',
      date: 'B',
      time_of_day: 'C',
      time_of_day_recode: 'D',
      incident_type: 'E',
      incident_action: 'F',
      territorial_water_status: 'G',
      closest_coastal_state: 'H',
      closest_coastal_state_cow_code: 'I',
      latitude: 'J',
      longitude: 'K',
      location_precision: 'L',
      geolocation_source_imb: 'M',
      geolocation_source_imo: 'N',
      geolocation_source_asam: 'O',
      location_description: 'P',
      vessel_name: 'Q',
      vessel_country: 'R',
      vessel_country_cow_code: 'S',
      vessel_status: 'T',
      violence_dummy: 'U',
      steaming_recode: 'V',
      incident_type_recode: 'W',
      incident_action_recode: 'X'
    };

    var service = {
      getIncidents: getIncidents,
      getDefaultIncidents: getDefaultIncidents,
      getYears: getYears,
      getCountries: getCountries,
      getVesselTypes: getVesselTypes,
      getVesslStatuses: getVesslStatuses,
      getIncidentTypes: getIncidentTypes,
      getIncidentActions: getIncidentActions,
      getDataSources: getDataSources,
      convertIncidentsToGeoJson: convertIncidentsToGeoJson
    };

    return service;

    function getDefaultIncidents(url) {
      var query = 'select id, latitude, longitude order by date desc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query, 100)
        .then(function(incidents) {
          incidents = sanitizeIncidents(incidents);
          incidents = convertIncidentsToGeoJson(incidents);
          return incidents;
        });
    }

    function getIncidents(url, filter) {

      if (angular.isDefined(filter.id)) {
        var query = 'select * where id = ' + filter.id;
        query = SheetRockService.renderQuery(self.columnMap, query);
      }
      return SheetRockService.executeQuery(url, query)
        .then(function(records) {
          var incidents = sanitizeIncidents(records);
          return incidents;
        });;

    }

    function getYears(url) {
      var query = 'select count(id), year(date) where date is not null group by year(date) order by year(date) desc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(records) {
          return records.map(function(record) {
            return record['year(date)'];
          })
        });
    }

    function sanitizeIncidents(incidents) {
      incidents.forEach(function(incident, index) {
        if (angular.isDefined(incident.date)) {
          incident.date = SheetRockService.convertDate(incident.date);
          incident.latitude = Number(incident.latitude);
          incident.longitude = Number(incident.longitude);
        }
      });
      return incidents;
    }

    function convertIncidentsToGeoJson(incidents) {
      var geojson = GeoJSON.parse(incidents, {
        Point: ['latitude', 'longitude']
      });
      return geojson;
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
