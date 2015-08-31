(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['ExportService', '$http', '$log', '$q', 'SheetRockService'];

  function IncidentService(ExportService, $http, $log, $q, SheetRockService) {

    var self = this;
    self.columnMap = {
      id: 'A',
      date_occurred: 'B',
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
      exportIncidentsCSV: exportIncidentsCSV,
      getIncidentsPerYearPerCountry: getIncidentsPerYearPerCountry,
      getYears: getYears,
      getCountries: getCountries,
      getTerritorialWaterStatuses: getTerritorialWaterStatuses,
      getVesselStatuses: getVesselStatuses,
      getIncidentTypes: getIncidentTypes,
      getIncidentActions: getIncidentActions,
      getDataSources: getDataSources,
      getGeolocationSources: getGeolocationSources
    };

    return service;

    function getIncidents(url, filter, fields, limit) {

      if (angular.isUndefined(fields)) {
        fields = ['*'];
      } else {
        fields = fields.join(', ');
      }

      var whereClause = createWhereClause(filter);
      var query = 'select ' + fields + whereClause;
      query = SheetRockService.renderQuery(self.columnMap, query);

      return SheetRockService.executeQuery(url, query, limit)
        .then(function(incidents) {
          incidents = sanitizeIncidents(incidents);
          return incidents;
        })
        .catch(function(error) {
          var incidents = [];
          return incidents;
        });
    }

    function exportIncidentsCSV(url, filter) {
      return getIncidents(url, filter, ['*'])
        .then(function(incidents) {
          var columns = Object.keys(self.columnMap);
          ExportService.exportCSV(columns, incidents);
        });
    }

    function getIncidentsPerYearPerCountry(url, filter) {

      var uniqueCountries = {},
        countries = [],
        where = [],
        beginDate = filter.beginDate,
        endDate = filter.endDate,
        closestCoastalState = filter.closestCoastalState,
        query, country, year, count,
        whereClause = createWhereClause(filter);

      query = 'select count(id), year(date_occurred), closest_coastal_state ' +
        whereClause +
        ' group by closest_coastal_state, year(date_occurred) ' +
        ' label count(id) "count", year(date_occurred) "year", closest_coastal_state "country"';

      query = SheetRockService.renderQuery(self.columnMap, query);

      return SheetRockService.executeQuery(url, query)
        .then(function(incidents) {
          return incidents;
        })
        .catch(function(error) {
          var incidents = [];
          return incidents;
        });
    }

    function createWhereClause(filter) {
      var where = [];
      if (angular.isDefined(filter.id)) {
        where.push('id = ' + filter.id);
      }
      if (angular.isDefined(filter.beginDate) &&
        angular.isDefined(filter.endDate)) {
        where.push('date "' + moment(filter.beginDate).format('YYYY-MM-DD') + '" < date_occurred');
        where.push('date "' + moment(filter.endDate).format('YYYY-MM-DD') + '" > date_occurred');
      }

      if (angular.isDefined(filter.closestCoastalState) &&
        filter.closestCoastalState.length > 0) {
        var match = filter.closestCoastalState.join('|');
        where.push('closest_coastal_state matches "' + match + '"');
      }

      if (angular.isDefined(filter.territorialWaterStatus) &&
        filter.territorialWaterStatus.length > 0) {
        var match = filter.territorialWaterStatus.join('|');
        where.push('territorial_water_status matches "' + match + '"');
      }

      if (angular.isDefined(filter.vesselCountry) &&
        filter.vesselCountry.length > 0) {
        var match = filter.vesselCountry.join('|');
        where.push('vessel_country matches "' + match + '"');
      }

      if (angular.isDefined(filter.vesselStatus) &&
        filter.vesselStatus.length > 0) {
        var match = filter.vesselStatus.join('|');
        where.push('vessel_status matches "' + match + '"');
      }

      if (angular.isDefined(filter.incidentType) &&
        filter.incidentType.length > 0) {
        var match = filter.incidentType.join('|');
        where.push('incident_type matches "' + match + '"');
      }

      if (angular.isDefined(filter.incidentAction) &&
        filter.incidentAction.length > 0) {
        var match = filter.incidentAction.join('|');
        where.push('incident_action matches "' + match + '"');
      }

      if (angular.isDefined(filter.geolocationSource) &&
        filter.geolocationSource.length > 0) {
        if(filter.geolocationSource.indexOf('IMB') > -1) {
          where.push('geolocation_source_imb = 1');
        }
        if(filter.geolocationSource.indexOf('IMO') > -1) {
          where.push('geolocation_source_imo = 1');
        }
        if(filter.geolocationSource.indexOf('ASAM') > -1) {
          where.push('geolocation_source_asam = 1');
        }
      }

      if (where.length > 0) {
        return ' where ' + where.join(' and ');
      } else {
        return '';
      }
    }

    function sanitizeIncidents(incidents) {
      var splice = false;
      incidents.forEach(function(incident, index) {
        if (angular.isDefined(incident.date_occurred)) {
          incident.date_occurred = SheetRockService.convertDate(incident.date_occurred);
        } else {
          splice = true;
        }
        if (angular.isDefined(incident.latitude) && angular.isDefined(incident.longitude)) {
          incident.latitude = Number(incident.latitude.trim());
          incident.longitude = Number(incident.longitude.trim());
        } else {
          splice = true;
        }
        if (isNaN(incident.latitude) || Math.abs(incident.latitude) > 90 || Math.abs(incident.longitude) > 180) {
          splice = true;
        }
        if(splice) {
          incidents.splice(index, 1);
        }
      });
      return incidents;
    }

    function getYears(url) {
      var query = 'select count(id), year(date_occurred) where date_occurred is not null group by year(date_occurred) order by year(date_occurred) desc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          return results.map(function(results) {
            return results['year(date_occurred)'];
          })
        });
    }

    function getCountries(url) {
      var countries = [],
        uniqueCountries = {},
        query = 'select closest_coastal_state, vessel_country where closest_coastal_state is not null and vessel_country is not null';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          results.forEach(function(result) {
            uniqueCountries[result.closest_coastal_state] = 1;
            uniqueCountries[result.vessel_country] = 1;
          });
          countries = Object.keys(uniqueCountries).sort();
          return countries;
        });
    }

    function getTerritorialWaterStatuses(url) {
      var query = 'select count(id), territorial_water_status where territorial_water_status is not null group by territorial_water_status order by territorial_water_status asc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          return results.map(function(result) {
            return result.territorial_water_status;
          });
        });
    }

    function getVesselStatuses(url) {
      var query = 'select count(id), vessel_status where vessel_status is not null group by vessel_status order by vessel_status asc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          return results.map(function(result) {
            return result.vessel_status;
          });
        })
    }

    function getIncidentTypes(url) {
      var query = 'select count(id), incident_type where incident_type is not null group by incident_type order by incident_type asc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          return results.map(function(result) {
            return result.incident_type;
          });
        });
    }

    function getIncidentActions(url) {
      var query = 'select count(id), incident_action where incident_action is not null group by incident_action order by incident_action asc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query)
        .then(function(results) {
          return results.map(function(result) {
            return result.incident_action;
          });
        });
    }

    function getGeolocationSources(url) {
      var dfr = $q.defer();
      dfr.resolve(['IMB', 'IMO', 'ASAM']);
      return dfr.promise;
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
