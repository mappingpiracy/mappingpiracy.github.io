(function() {
  'use strict';

  mp.service('SheetRockService', SheetRockService);

  SheetRockService.$inject = ['$http', '$log', '$q'];

  function SheetRockService($http, $log, $q) {

    var self = this;
    self.dataSources = [];

    var service = {
      executeQuery: executeQuery
    };

    return service;

    /**
     * Execute a query against the specified URL using sheetrock.
     * Then return a promise containing the returned cells
     * @param  {String} url   The data source url
     * @param  {String} query The Google Visualization query
     * @return {promise}       Promise that resolves to the returned data
     */
    function executeQuery(url, query, fetchSize) {
      var dfr = $q.defer();
      function callback(error, options, response) {
        if(error) {
          dfr.reject(error);
        } else {
          var cells = response.rows.map(function(row) {
            return row.cells;
          });
          dfr.resolve(cells);
        }
      }
      sheetrock({
        url: url,
        query: query,
        callback: callback,
        fetchSize: fetchSize || 0
      });
      return dfr.promise;
    }


  }

})();
