(function() {
  'use strict';

  mp.directive('incidentMap', incidentMap);

  function incidentMap() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/common/directives/incident-map/incident-map.template.html',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attrs) {

        scope.map = null;

        buildMap();

        function buildMap() {
          scope.map = L.map('incident-map').setView([-10, 50], 3);
          L.tileLayer('http://{s}.tiles.mapbox.com/v3/utkpiracyscience.n97d5l62/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 14
          }).addTo(scope.map);
          scope.map.scrollWheelZoom.disable();
        };





      }
    };
  }

})();
