mpmap.service('AnalysisDataService', ["$http",
    function($http) {

        /**
         * Public functions and variables
         * @type {object}
         */
        var service = {
            incidentsPerYear: [],
            getIncidentsPerYear: getIncidentsPerYear
        };

        function getIncidentsPerYear(params) {
            var beginDate = params.beginDate,
                endDate = params.endDate,
                countries = params.closestCountry,
                limit = countries.length;

            if (countries.length === 0) {
                countries = 0;
                limit = 10;
            }

            var params = [beginDate, endDate, countries, limit].join('/');

            return $http.get('/analysis/incidentsperyear/' + params)
                .success(function(data, status, headers, config) {
                    service.incidentsPerYear = data;
                });
        }

        return service;
    }
]);
