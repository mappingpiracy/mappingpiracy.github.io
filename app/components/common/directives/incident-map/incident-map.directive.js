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

      function populateMarkers(map, data) {
        var marker = null;

        data.forEach(function(entry) {
          var marker = new L.marker([entry.latitude, entry.longitude])
            .bindPopup(entry.id)
            .addTo(map);
        });

        return data;
      }

      scope.map = buildMap();
      scope.markers = populateMarkers(scope.map, scope.data);

      scope.$watch(function watchData() {
        return scope.data;
      }, function newData(data) {
        populateMarkers(scope.map, data);
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
