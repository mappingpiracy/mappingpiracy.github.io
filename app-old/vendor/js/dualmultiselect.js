var a = angular.module("dualmultiselect", []);
a.directive("dualmultiselect", [function() {
	return {
		restrict: 'E',
		scope: {
			options: '='
		},
		controller: function($scope) {
			$scope.transfer = function(from, to, index) {
				if (index >= 0) {
					to.push(from[index]);
					from.splice(index, 1);
				} else {
					for (var i = 0; i < from.length; i++) {
						to.push(from[i]);
					}
					from.length = 0;
				}
			};
		},
	template: '<div class="dualmultiselect"> <div class="row"> <div class="col-lg-12 col-md-12 col-sm-12"> <label class="large">{{options.title}}<small>&nbsp;{{options.helpMessage}}</small> </label> <input class="form-control" placeholder="{{options.filterPlaceHolder}}" ng-model="searchTerm"> </div></div><div class="row"> <div class="col-lg-6 col-md-6 col-sm-6"> <label>{{options.labelAll}}</label> <button class="btn btn-default btn-xs" ng-click="transfer(options.items, options.selected, -1)"> Select All </button> <div class="pool"> <ul> <li ng-repeat="item in options.items | filter: searchTerm | orderBy: options.orderProperty"> <a href="" ng-click="transfer(options.items, options.selected, options.items.indexOf(item))">{{item.name}}&nbsp;&rArr; </a> </li></ul> </div></div><div class="col-lg-6 col-md-6 col-sm-6"> <label>{{options.labelSelected}}</label> <button class="btn btn-default btn-xs" ng-click="transfer(options.selected, options.items, -1)"> Deselect </button> <div class="pool"> <ul> <li ng-repeat="item in options.selected | orderBy: options.orderProperty"> <a href="" ng-click="transfer(options.selected, options.items, options.selected.indexOf(item))"> &lArr;&nbsp;{{item.name}}</a> </li></ul> </div></div></div></div>'	};
}]);