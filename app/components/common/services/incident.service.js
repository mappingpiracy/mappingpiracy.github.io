(function() {
  'use strict';

  mp.service('IncidentService', IncidentService);

  IncidentService.$inject = ['$http', '$log', 'SheetRockService'];

  function IncidentService($http, $log, SheetRockService) {
    var service = {
      getDataSources: getDataSources
    };

    return service;

    function getDataSources() {

      return $http.get('config/data-sources.json')
        .then(function(response) {
          self.dataSources = response.data;
          return self.dataSources;
        });
    }

  }

})();
