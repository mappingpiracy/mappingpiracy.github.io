/**
 * Service used to retrieve data from the backend API
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $location  [description]
 * @param  {Object} $http)     {                   var service [description]
 * @return {[type]}            [description]
 */
mpmap.service('GeoDataService', ["$http",
    function($http) {
        
        /**
         * Public functions and variables
         * @type {object}
         */
        var service = {
            incidents: [],
            getIncidents: getIncidents,
            countries: [],
            getCountries: getCountries,
            dateRange: [],
            getDateRange: getDateRange,
            incidentActions: [],
            getIncidentActions: getIncidentActions,
            incidentTypes: [],
            getIncidentTypes: getIncidentTypes,
            vesselTypes: [],
            getVesselTypes: getVesselTypes,
            vesselStatuses: [],
            getVesselStatuses: getVesselStatuses
        };

        function getIncidents(params, format) {
            return $http.get('/geodata/incident/' + format, {
                    params: params
                })
                .success(function(data, status, headers, config) {
                    service.incidents = data;
                });
        }

        function getDateRange() {
            return $http.get('/geodata/daterange/')
                .success(function(data, status, headers, config) {
                    service.dateRange = data;
                });
        }

        function getCountries(id) {
            if(id === undefined) id = '';
            return $http.get('/geodata/country/' + id, {})
                .success(function(data, status, headers, config) {
                    service.countries = data;
                });
        }

        function getIncidentActions(id) {
            if(id === undefined) id = '';
            return $http.get('/geodata/incidentaction/' + id, {})
                .success(function(data, status, headers, config) {
                    service.countries = data;
                });
        }

        function getIncidentTypes(id) {
            if(id === undefined) id = '';
            return $http.get('/geodata/incidenttype/' + id, {})
                .success(function(data, status, headers, config) {
                    service.countries = data;
                });
        }

        function getVesselTypes(id) {
            if(id === undefined) id = '';
            return $http.get('/geodata/vesseltype/' + id, {})
                .success(function(data, status, headers, config) {
                    service.countries = data;
                });
        }

        function getVesselStatuses(id) {
            if(id === undefined) id = '';
            return $http.get('/geodata/vesselstatus/' + id, {})
                .success(function(data, status, headers, config) {
                    service.countries = data;
                });
        }

        return service;
    }
]);
