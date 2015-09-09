(function() {
  'use strict';
  mp.directive('datePicker', datePicker);
  function datePicker() {
    function link(scope, element, attributes) {
      if (angular.isDefined(attributes.minDate)) {
        scope.minDate = new Date(attributes.minDate);
      }
      if (angular.isDefined(attributes.maxDate)) {
        scope.maxDate = new Date(attributes.maxDate);
      }
      scope.format = 'MM/dd/yyyy';
      scope.status = {
        opened: false
      };
      scope.open = function($event) {
        scope.status.opened = true;
      };
      scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    }

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/common/directives/date-picker/date-picker.template.html',
      scope: {
        modelVal: '=ngModel'
      },
      link: link
    };
  }
})();
