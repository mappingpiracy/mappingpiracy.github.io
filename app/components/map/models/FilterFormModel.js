/**
 * FilterFormModel
 *
 * Alex Klibisz, 2/21/15
 *
 * This model handles all data manipulation and configuration for the incident filter form in the map view.
 */
mpmap.service('FilterFormModel', ["GeoDataService", function(GeoDataService) {

        /**
         * Public API
         * @return {object} The public API for this model. Returned at the end of the file.
         */
        function model() {
            this.dateRange = dateRange;
            this.locationInformation = locationInformation;
            this.vesselInformation = vesselInformation;
            this.incidentInformation = incidentInformation;
            this.getData = getData;
            this.getFilter = getFilter;
            getData();
        }

        /**
         * Load data from the GeoDataService.
         * @return {[type]} [description]
         */
        function getData() {
            GeoDataService.getDateRange()
                .success(function(data) {
                    dateRange.years = data.sort().reverse();
                });
            GeoDataService.getCountries()
                .success(function(data) {
                    locationInformation.closestCountry.items = data;
                });
            GeoDataService.getCountries()
                .success(function(data) {
                    locationInformation.waterCountry.items = data;
                });
            GeoDataService.getCountries()
                .success(function(data) {
                    vesselInformation.vesselCountry.items = data;
                });
            GeoDataService.getVesselTypes()
                .success(function(data) {
                    vesselInformation.vesselType.items = data;
                })
            GeoDataService.getVesselStatuses()
                .success(function(data) {
                    vesselInformation.vesselStatus.items = data;
                })
            GeoDataService.getIncidentTypes()
                .success(function(data) {
                    incidentInformation.incidentType.items = data;
                })
            GeoDataService.getIncidentActions()
                .success(function(data) {
                    incidentInformation.incidentAction.items = data;
                })
        }

        /**
         * Construct and return a filter object from the current filter form fields.
         * @return {object} filter object, declared at top of function
         */
        function getFilter() {
            var filter = {
                beginDate: '',
                endDate: '',
                closestCountry: '',
                waterCountry: '',
                vesselType: '',
                vesselCountry: '',
                vesselStatus: '',
                incidentType: '',
                incidentAction: ''
            };

            filter.beginDate = dateRange.beginDate.value;
            filter.endDate = dateRange.endDate.value;

            /*
            Construct an array using the map function, then join it into a comma-separated string.
             */
            filter.closestCountry = locationInformation.closestCountry.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.waterCountry = locationInformation.waterCountry.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.vesselType = vesselInformation.vesselType.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.vesselCountry = vesselInformation.vesselCountry.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.vesselStatus = vesselInformation.vesselStatus.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.incidentType = incidentInformation.incidentType.selected.map(function(d) {
                return d.id;
            }).join(',');

            filter.incidentAction = incidentInformation.incidentAction.selected.map(function(d) {
                return d.id;
            }).join(',');

            return filter;
        }

        var dateRange = {
            years: [],
            selectedYear: '',
            beginDate: {
                value: new Date(new Date().getFullYear() - 2, 0, 1),
                opened: false,
                format: 'MM/dd/yyyy'
            },
            endDate: {
                value: new Date(new Date().getFullYear(), 11, 31),
                opened: false,
                format: 'MM/dd/yyyy'
            },
            openDatePicker: function($event, dp) {
                $event.preventDefault();
                $event.stopPropagation();
                dp.opened = !dp.opened;
            },
            update: function() {
                var year = dateRange.selectedYear;
                dateRange.beginDate.value = new Date(year, 0, 1);
                dateRange.endDate.value = new Date(year, 11, 31);
            }
        }

        var locationInformation = {
            closestCountry: {
                title: 'Closest Country',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            },
            waterCountry: {
                title: 'Territorial Water Status',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            }
        }

        var vesselInformation = {
            vesselCountry: {
                title: 'Vessel Country',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            },
            vesselStatus: {
                title: 'Vessel Status',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            },
            vesselType: {
                title: 'Vessel Type',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            }
        };

        var incidentInformation = {
            incidentType: {
                title: 'Incident Type',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            },
            incidentAction: {
                title: 'Incident Action',
                filterPlaceHolder: 'Start typing to filter the lists below.',
                labelAll: 'All',
                labelSelected: 'Selected',
                helpMessage: '',
                orderProperty: 'name',
                items: [],
                selected: []
            }
        };

        return model;
    }])
    /*
    Need this to make the begin date and end date calendars work correctly.
    https://github.com/angular-ui/bootstrap/issues/2659
     */
    .directive('datepickerPopup', function() {
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function(scope, element, attr, controller) {
                controller.$formatters.shift();
            }
        };
    });
