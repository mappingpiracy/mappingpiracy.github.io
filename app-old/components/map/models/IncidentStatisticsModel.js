/**
 * IncidentStatisticsModel
 *
 * Alex Klibisz, 4/16/15
 *
 * This model keeps some basic statistics on the current selection of incidents.
 */
mpmap.service('IncidentStatisticsModel', function() {

    /**
     * Public API
     * @return {[type]} The public API for this model, returned at the end of the model.
     */
    function model() {
        this.incident = incident;
        this.closestCountry = closestCountry;
        this.waterCountry = waterCountry;
        this.vesselCountry = vesselCountry;
        this.setData = setData;
    }

    var incident = {
            count: 0
        },
        closestCountry = {
            count: 0
        },
        waterCountry = {
            count: 0
        },
        vesselCountry = {
            count: 0
        };

    /**
     * Set the data for the model based on a passed geoJson object.
     * @param {geoJson Object} data The same geoJson object that gets plotted on the map.
     */
    function setData(data) {
        var features = data.features,
            closestCountries = {},
            waterCountries = {},
            vesselCountries = {};
        features.map(function(f) {
            closestCountries[f.properties.closestCountry] = true;
            waterCountries[f.properties.waterCountry] = 1;
            vesselCountries[f.properties.vesselCountry] = 1;
        });
        incident.count = features.length;
        closestCountry.count = Object.keys(closestCountries).length;
        waterCountry.count = Object.keys(waterCountries).length;
        vesselCountry.count = Object.keys(vesselCountries).length;
    }

    return model;

});
