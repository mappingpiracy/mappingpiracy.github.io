(function() {
  'use strict';

  mp.service('ExportService', ExportService);

  ExportService.$inject = [];

  function ExportService() {

    var service = {
      exportCSV: exportCSV
    };

    return service;

    function exportCSV(columns, data) {
      var fileName = 'mapping-piracy-export-' + new Date().toString('yyyy-MM-dd-HH:mm:ss') + '.csv',
        fileType = 'text/csv;',
        // #FunctionalProgramming
        // #ReadabilityIsOverrated
        // #TrustMeThisWorks
        // #Kony2012
        fileContents = columns.join(',') + '\n' + data.map(function(entry) {
          return columns.map(function(column) {
            return '"' + entry[column] + '"';
          }).join();
        }).join('\n');

      var blob = new Blob([fileContents], {
        type: fileType + 'charset=utf-8;'
      });

      saveAs(blob, fileName);
    }

  }

})();
