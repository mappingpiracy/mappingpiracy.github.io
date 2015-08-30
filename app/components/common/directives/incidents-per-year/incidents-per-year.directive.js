(function() {
  'use strict';

  function incidentsPerYear() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/incidents-per-year/incidents-per-year.template.html',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) { }
    };
  }

  mp.directive('incidentsPerYear', incidentsPerYear);


})();
