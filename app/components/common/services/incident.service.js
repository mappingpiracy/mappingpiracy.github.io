(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['$http', '$log', 'SheetRockService'];

  function IncidentService($http, $log, SheetRockService) {
    var service = {
      getIncidents: getIncidents,
      getDefaultIncidents: getDefaultIncidents,
      getDataSources: getDataSources
    };

    return service;

    function getDefaultIncidents(url) {

      return SheetRockService.executeQuery(url, 'select *', 100);

    }

    function getIncidents(url, filter) {

      return SheetRockService.executeQuery(url, 'select *');

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
