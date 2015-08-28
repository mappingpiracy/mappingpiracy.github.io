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
          if(scope.selectedItems.indexOf(item) < 0) {
            var index = scope.allItems.indexOf(item);
            scope.selectedItems.push(scope.allItems[index]);
          }
          scope.enteredText = '';          
        };
        scope.deselectItem = function(item) {
          var index = scope.allItems.indexOf(item);
          scope.selectedItems.splice(index, 1);
        };
      }
    };
  }

  mp.directive('typeaheadMultiselect', typeaheadMultiselect);


})();
