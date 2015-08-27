(function() {
  'use strict';

  function incidentPopup() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/incident-popup/incident-popup.template.html',
      scope: {
        properties: '='
      }
    };
  }

  mp.directive('incidentPopup', incidentPopup);

})();
