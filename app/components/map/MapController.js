/**
 * MapController
 *
 * Alex Klibisz, 1/16/15
 *
 * This controller handles all data loading and passing for the map view.
 */
mpmap.controller('MapController', ["$scope",
    "$modal", "GeoDataService", "AnalysisDataService", 
    "ExportDataService", "LeafletMapModel", "FilterFormModel", 
    "IncidentsPerYearModel", "GenericModalModel", "IncidentStatisticsModel",
    function($scope, $modal,
        GeoDataService, AnalysisDataService, ExportDataService, LeafletMapModel, FilterFormModel, IncidentsPerYearModel, GenericModalModel, IncidentStatisticsModel) {
        /*
        Declare all public functions and variables.
         */
        $scope.initialize = initialize;
        $scope.filterForm = new FilterFormModel();
        $scope.map = new LeafletMapModel();
        $scope.incidentStatistics = new IncidentStatisticsModel();
        $scope.modal = new GenericModalModel();
        $scope.incidentsPerYear = new IncidentsPerYearModel();
        $scope.exportIncidents = exportIncidents;
        $scope.exportFilters = exportFilters;

        /**
         * Load the incident data, load incident statistics, display modals.
         * @return {[type]} [description]
         */
        function initialize() {
            $scope.modal.open("Events loading, please wait.");
            GeoDataService.getIncidents($scope.filterForm.getFilter(), 'geojson')
                .success(function(data, status) {
                    $scope.map.setGeoJsonData(data);
                    $scope.incidentStatistics.setData(data);
                })
                .error(function(data, status) {
                    $scope.modal.open("Error loading events.", status);
                    console.error(status);
                })
                .then(function() {
                    $scope.modal.close();
                });
            AnalysisDataService.getIncidentsPerYear($scope.filterForm.getFilter())
                .success(function(data, status) {
                    $scope.incidentsPerYear.setData(data);
                });
        };

        /**
         * Export incidents given the current filter selections in geojson, json, or csv format.
         * @param  {string} format format: geojson|json|csv
         * @return {[type]}        [description]
         */
        function exportIncidents(format) {
            if (format === 'geojson') {
                var data = $scope.map.geoJson;
                ExportDataService.exportFile(data, format);
            } else if (format === 'json') {
                GeoDataService.getIncidents($scope.filterForm.getFilter(), format)
                    .success(function(data, status) {
                        ExportDataService.exportFile(data, format);
                    });
            } else if (format === 'csv') {
                GeoDataService.getIncidents($scope.filterForm.getFilter(), format)
                    .success(function(data, status) {
                        ExportDataService.exportFile(data, format);
                    });
            }
        }

        /**
         * Export the current event filter seelctions as json
         * @param  {string} format [description]
         * @return {[type]}        [description]
         */
        function exportFilters(format) {
            ExportDataService.exportFile($scope.filterForm.getFilter(), format);
        }

        initialize();
    }
]); //  MapController
