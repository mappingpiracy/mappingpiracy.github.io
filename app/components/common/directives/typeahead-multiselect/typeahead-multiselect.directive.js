(function() {
  'use strict';

  function typeaheadMultiselect() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/typeahead-multiselect/typeahead-multiselect.template.html',
      scope: {
        enteredText: '=',
        allItems: '=',
        selectedItems: '='
      },
      link: function(scope, element, attrs) {
        scope.selectItem = function(item) {
          var index = scope.allItems.indexOf(item);
          scope.selectedItems.push(scope.allItems[index]);
          scope.allItems.splice(index, 1);
          scope.enteredText = '';
        };
        scope.deselectItem = function(item) {
          var index = scope.allItems.indexOf(item);
          scope.allItems.push(scope.selectedItems[item]);
          scope.selectedItems.splice(index, 1);
        };
      }
    };
  }

  mp.directive('typeaheadMultiselect', typeaheadMultiselect);


})();
