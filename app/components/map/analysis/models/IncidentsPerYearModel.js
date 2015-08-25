/******************************************

IncidentsPerYearModel

Alex Klibisz, 2/18/15

This service handles all options and data manipulation for the events per year nvD3 line chart.

It is initialized via the final return function with a passed list of events in geojson form.

******************************************/
mpmap.service('IncidentsPerYearModel', ["GeoDataService", function(GeoDataService) {

    function model() {
        this.options = options;
        this.data = [];
        this.setData = setData;
    }

    var options = {
        chart: {
            type: 'lineChart',
            height: 240,
            margin: {
                top: 20,
                right: 60,
                bottom: 40,
                left: 55
            },
            x: function(d) {
                return d.year;
            },
            y: function(d) {
                return d.count;
            },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e) { /* console.log("stateChange"); */ },
                changeState: function(e) { /* console.log("changeState"); */ },
                tooltipShow: function(e) { /* console.log("tooltipShow"); */ },
                tooltipHide: function(e) { /* console.log("tooltipHide"); */ }
            },
            xAxis: {
                axisLabel: 'Years',
                tickValues: []
            },
            yAxis: {
                axisLabel: 'Events',
                axisLabelDistance: 30
            },
            callback: function(chart) { /* console.log("!!! lineChart callback !!!"); */ }
        }
    }

    /**
     * Assign the model data to the passed data and iterate over the passed data to set the yearly tick values.
     * @param {Object} data Data returned from the AnalysisDataService
     */
    function setData(data) {
        var years = {};
        data.map(function(d) {
            d.values.map(function(v) {
                years[v.year] = true;
            });
        });
        options.chart.xAxis.tickValues = Object.keys(years);
        this.data = data;
    }

    return model;

}]);