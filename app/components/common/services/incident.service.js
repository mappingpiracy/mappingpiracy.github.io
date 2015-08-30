(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['$http', '$log', '$q', 'SheetRockService'];

  function IncidentService($http, $log, $q, SheetRockService) {

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
      getDefaultIncidents: getDefaultIncidents,
      getIncidentsPerYearPerCountry: getIncidentsPerYearPerCountry,
      getYears: getYears,
      getCountries: getCountries,
      getTerritorialWaterStatuses: getTerritorialWaterStatuses,
      getVesselStatuses: getVesselStatuses,
      getIncidentTypes: getIncidentTypes,
      getIncidentActions: getIncidentActions,
      getDataSources: getDataSources,
      getGeolocationSources: getGeolocationSources,
      convertIncidentsToGeoJson: convertIncidentsToGeoJson,
      getPopupContent: getPopupContent
    };

    return service;

    function getDefaultIncidents(url) {
      var query = 'select id, latitude, longitude order by date_occurred desc';
      query = SheetRockService.renderQuery(self.columnMap, query);
      return SheetRockService.executeQuery(url, query, 100)
        .then(function(incidents) {
          incidents = sanitizeIncidents(incidents);
          incidents = convertIncidentsToGeoJson(incidents);
          return incidents;
        });
    }

    function getIncidents(url, filter, fields, limit) {

      var where = [];
      if (angular.isUndefined(fields)) {
        fields = ['*'];
      } else {
        fields = fields.join(', ');
      }
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
        //TODO
      }

      if (where.length > 0) {
        var query = 'select ' + fields + ' where ' + where.join(' and ');
      }
      query = SheetRockService.renderQuery(self.columnMap, query);

      return SheetRockService.executeQuery(url, query, limit)
        .then(function(incidents) {
          incidents = sanitizeIncidents(incidents);
          incidents = convertIncidentsToGeoJson(incidents);
          return incidents;
        })
        .catch(function(error) {
          var incidents = convertIncidentsToGeoJson([]);
          return incidents;
        });
    }

    function getIncidentsPerYearPerCountry(url, filter) {

      var uniqueCountries = {},
        countries = [],
        where = [],
        beginDate = filter.beginDate,
        endDate = filter.endDate,
        closestCoastalState = filter.closestCoastalState,
        query, country, year, count;

      where.push('date "' + moment(beginDate).format('YYYY-MM-DD') + '" < date_occurred');
      where.push('date "' + moment(endDate).format('YYYY-MM-DD') + '" > date_occurred');
      where.push('closest_coastal_state is not null');

      if (angular.isDefined(closestCoastalState) && closestCoastalState.length > 0) {
        where.push('closest_coastal_state matches "' + closestCoastalState.join('|') + '"');
      }

      query = 'select count(id), year(date_occurred), closest_coastal_state ' +
        'where ' + where.join(' and ') +
        ' group by closest_coastal_state, year(date_occurred) ' +
        ' label count(id) "count", year(date_occurred) "year", closest_coastal_state "country"';

      query = SheetRockService.renderQuery(self.columnMap, query);

      return SheetRockService.executeQuery(url, query)
        .then(function(incidents) {
            return incidents;
          // incidents.forEach(function(incident) {
          //   country = incident['closest_coastal_state'];
          //   year = incident['year(date_occurred)'];
          //   count = incident['countid'];
          //   if (!uniqueCountries.hasOwnProperty(country)) {
          //     uniqueCountries[country] = {
          //       key: country,
          //       values: []
          //     };
          //   }
          //   uniqueCountries[country].values.push({
          //     year: year,
          //     count: count
          //   });
          // });

          // Convert to object into an array
          // countries = Object.keys(uniqueCountries).map(function(key) {
          //   return uniqueCountries[key];
          // });

          // Sort the array according to the total number of incidents for a
          // country through this timespan.

          // return countries.sort(function(c1, c2) {
          //   var c1total = 0,
          //     c2total = 0;
          //   c1.values.forEach(function(value) {
          //     c1total += value.count;
          //   });
          //   c2.values.forEach(function(value) {
          //     c2total += value.count;
          //   });
          //   if (c1total < c2total) return 1;
          //   if (c1total > c2total) return -1;
          //   return 0;
          // });


        });

    }

    function sanitizeIncidents(incidents) {
      incidents.forEach(function(incident, index) {
        if (angular.isDefined(incident.date_occurred)) {
          incident.date_occurred = SheetRockService.convertDate(incident.date_occurred);
        }
        if (isNaN(incident.latitude) || incident.latitude < -90 || incident.latitude > 90 ||
          isNaN(incident.longitude) || incident.longitude < -180 || incident.longitude > 180) {
          incidents.splice(index, 1);
        }
      });
      return incidents;
    }

    function convertIncidentsToGeoJson(incidents) {
      var geojson = GeoJSON.parse(incidents, {
        Point: ['latitude', 'longitude']
      });
      geojson.features.forEach(function(feature) {
        feature.properties.latitude = feature.geometry.coordinates[0];
        feature.properties.longitude = feature.geometry.coordinates[1];
      });
      return geojson;
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

    function getPopupContent(incident) {
      var rows = [];
      incident = incident.properties;
      rows.push(['ID', incident.id]);
      rows.push(['Date', incident.date_occurred]);
      rows.push(['Time', incident.time_of_day]);
      rows.push(['Incident Type', incident.incident_type]);
      rows.push(['Incident Action', incident.incident_action]);
      rows.push(['Longitude', incident.longitude]);
      rows.push(['Latitude', incident.latitude]);
      rows.push(['Closest Coastal State', incident.closest_coastal_state]);
      rows.push(['Territorial Water Status', incident.territorial_water_status]);
      rows.push(['Vessel Name', incident.vessel_name]);
      rows.push(['Vessel Country', incident.vessel_country]);
      rows.push(['Vessel Status', incident.vessel_status]);
      var html = '<div class="incident-popup"><ul>';
      rows.forEach(function(row) {
        html += '<li>' + row[0] + ': ' + row[1] + '</li>';
      });
      html += '</ul></div>'
      return html;
    }



  }

})();
