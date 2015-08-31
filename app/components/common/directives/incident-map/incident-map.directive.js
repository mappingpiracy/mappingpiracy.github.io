(function() {
  'use strict';

  mp.directive('incidentMap', [incidentMap]);

  function incidentMap() {

    function link(scope) {

      function createMap() {
        var map = L.map('incident-map').setView([-10, 50], 3);
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png', {
          maxZoom: 14
        }).addTo(map);
        map.scrollWheelZoom.disable();
        return map;
      };

      function createPopup(incident) {
        var html = '<div class="incident-popup"><ul>', li = [];
        li.push(['ID', incident.id]);
        li.push(['Date', incident.date_occurred]);
        li.push(['Time', incident.time_of_day]);
        li.push(['Incident Type', incident.incident_type]);
        li.push(['Incident Action', incident.incident_action]);
        li.push(['Longitude', incident.longitude]);
        li.push(['Latitude', incident.latitude]);
        li.push(['Closest Coastal State', incident.closest_coastal_state]);
        li.push(['Territorial Water Status', incident.territorial_water_status]);
        li.push(['Vessel Name', incident.vessel_name]);
        li.push(['Vessel Country', incident.vessel_country]);
        li.push(['Vessel Status', incident.vessel_status]);
        li.forEach(function(row) {
          html += '<li>' + row[0] + ': ' + row[1] + '</li>';
        });
        html += '</ul></div>'
        return html;
      }

      function createMarkersLayer(data) {
        var markers, markersLayer;
        markers = data.map(function(incident) {
          return new L.marker([incident.latitude, incident.longitude])
            .on('click', function(event) {
              this.bindPopup(createPopup(incident), {
                maxWidth: 450
              });
              this.openPopup();
            });
        });
        markersLayer = L.layerGroup(markers);
        return markersLayer;
      }

      var map = createMap();
      var markersLayer = createMarkersLayer(scope.data);

      scope.$watch(function watchData() {
        return scope.data;
      }, function newData(data) {
        map.removeLayer(markersLayer);
        markersLayer = createMarkersLayer(data);
        map.addLayer(markersLayer);
      });
    }

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/common/directives/incident-map/incident-map.template.html',
      scope: {
        data: '=data'
      },
      link: link
    };
  }

})();
