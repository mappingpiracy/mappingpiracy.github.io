/**
 * Service used to create export files.
 * @param  {Object} $rootScope) {               var service [description]
 * @return {[type]}             [description]
 */
mpmap.service('ExportDataService', function() {

    /**
     * Public functions and variables
     * @type {Object}
     */
    var service = {
        exportFile: exportFile
    }

    function exportFile(data, format) {
        var fileName, fileContents, fileType, blob;

        fileName = 'mpmap_export_' + new Date().toString('yyyy-MM-dd-HH:mm:ss') + '.' + format;

        if (format.indexOf('json') > -1) {
            fileContents = JSON.stringify(data);
            fileType = 'application/json;';
        } else if (format.indexOf('csv') > -1) {
            fileContents = data;
            fileType = 'text/csv;';
        }

        blob = new Blob([fileContents], {
            type: fileType + 'charset=utf-8;'
        });

        saveAs(blob, fileName);
    }

    return service;

});
