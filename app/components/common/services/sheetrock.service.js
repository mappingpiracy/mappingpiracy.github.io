(function() {
  'use strict';

  mp.service('SheetRockService', SheetRockService);

  SheetRockService.$inject = ['$http', '$log', '$q'];

  function SheetRockService($http, $log, $q) {

    var self = this;
    self.dataSources = [];

    var service = {
      executeQuery: executeQuery,
      convertDate: convertDate,
      renderQuery: renderQuery
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

      function handleResponse(error, options, response) {
        if (error) {
          dfr.reject(error);
        } else {
          var cells = response.rows.map(function(row) {
            return row.cells;
          });
          // Remove the first row if it is just titles
          if(isHeadingRow(cells[0])) {
            cells.splice(0,1);
          }
          dfr.resolve(cells);
        }
      }
      var params = {
        url: url,
        query: query,
        callback: handleResponse
      };
      if(angular.isDefined(fetchSize)) {
        params.fetchSize = fetchSize;
      }

      sheetrock(params);
      return dfr.promise;
    }

    function convertDate(date) {
      date = date.replace(/Date\(/g, '');
      date = date.replace(/\)/g, '');
      date = date.split(',');
      return new Date(date[0], date[1], date[2], 0, 0, 0);
    }

    /**
     * Iterate over the column map, replace
     * each occurrence of the column name with the
     * corresponding column letter
     */
    function renderQuery(columnMap, query) {
      Object.keys(columnMap).forEach(function(key) {
        var columnLetter = columnMap[key],
          regex = new RegExp(key, "g");
        query = query.replace(regex, columnLetter);
      });
      return query;
    }

    function isHeadingRow(row) {
      var keys = Object.keys(row);
      for(var i = 0; i < keys.length; i++) {
        if(keys[i] !== row[keys[i]]) return false;
      }
      return true;
    }

  }

})();
