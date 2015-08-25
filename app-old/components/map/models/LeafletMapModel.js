/**
 * LeafletMapModel
 *
 * Alex Klibisz 2/21/15
 *
 * This model handles all data manipulation and configuration for the Leaflet
 */
mpmap.service('LeafletMapModel', function() {

    /**
     * Public API
     * @return {object} All publicly available functions and variables.
     */
    function model() {
        this.defaults = defaults;
        this.center = center;
        this.geoJson = geoJson;
        this.setGeoJsonData = setGeoJsonData;
    }

    var defaults = {
            tileLayer: "http://{s}.tiles.mapbox.com/v3/utkpiracyscience.k1ei0a8m/{z}/{x}/{y}.png",
            maxZoom: 14
        },

        center = {
            lat: 0,
            lng: 0,
            zoom: 2
        },

        geoJson = {
            data: null,
            pointToLayer: createMarker,
            onEachFeature: createPopup
        };

    function setGeoJsonData(data) {
        geoJson.data = data;
    }

    function createMarker(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 7,
            fillColor: "#ff0000",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        });
    }

    function createPopup(feature, layer) {
        var p = feature.properties,
            popupContent = '<div class="popup-content row">' + 
            '<div class="col-sm-6">' + 
                '<ul>' +
                    '<li>Reference Id: ' + p.referenceId + '</li>' +
                    '<li>Date: ' + p.date + '</li>' +
                    '<li>Time of Day: ' + p.time + '</li>' +
                    '<li>Incident Type: ' + p.incidentType + '</li>' +
                    '<li>Incident Action: ' + p.incidentAction + '</li>' +
                    '<li>Longitude: ' + feature.geometry.coordinates[0] + '</li>' +
                '</ul>' +
            '</div>' +
            '<div class="col-sm-6">' +
                '<ul>' +
                    '<li>Latitude: ' + feature.geometry.coordinates[1] + '</li>' +
                    '<li>Closest Country: ' + p.closestCountry + '</li>' +
                    '<li>Water Country: ' + p.waterCountry + '</li>' +
                    '<li>Vessel Name: ' + p.vesselName + '</li>' +
                    '<li>Vessel Country: ' + p.vesselCountry + '</li>' +
                    '<li>Vessel Status: ' + p.vesselStatus + '</li>' +
                '</ul>' +
            '</div>' +
        '</div>';
        layer.bindPopup(popupContent, {
            maxWidth: 450
        });
    }

    return model;
});
