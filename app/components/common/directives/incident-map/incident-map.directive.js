(function() {
  'use strict';

  mp.directive('incidentMap', incidentMap);

  function incidentMap() {

    function link(scope, element, attrs) {

      function buildMap() {
        var map = L.map('incident-map').setView([-10, 50], 3);
        L.tileLayer('http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png', {
          maxZoom: 14
        }).addTo(map);
        map.scrollWheelZoom.disable();
        return map;
      };

      function buildMarkersLayer(data) {
        var markers = [], markersLayer;
        data.forEach(function(entry) {
          markers.push(new L.marker([entry.latitude, entry.longitude])
            .bindPopup(entry.id));
        });
        markersLayer = L.layerGroup(markers);
        return markersLayer;
      }

      scope.map = buildMap();
      scope.markersLayer = buildMarkersLayer(scope.data);

      scope.$watch(function watchData() {
        return scope.data;
      }, function newData(data) {
        scope.map.removeLayer(scope.markersLayer);
        scope.markersLayer = buildMarkersLayer(data);
        scope.map.addLayer(scope.markersLayer);
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
