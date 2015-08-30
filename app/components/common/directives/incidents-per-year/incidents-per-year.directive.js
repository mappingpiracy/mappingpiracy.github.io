(function() {
  'use strict';

  function incidentsPerYear() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/incidents-per-year/incidents-per-year.template.html',
      scope: {
        data: '=data',
        beginDate: '=beginDate',
        endDate: '=endDate'
      },
      link: function(scope, element, attributes) {

        function buildGraph(data) {
          console.log(angular.toJson(data));

          var graph, years = [], counts = [], sortedCounts,
            minCount, maxCount;

          // Build an array of years to define the x-axis
          for (var yr = scope.beginDate.getFullYear() - 1; yr <= scope.endDate.getFullYear() + 1; yr++) {
            years.push(yr);
          }

          // Find the min and max counts to define the y-axis
          data.forEach(function(country) {
            country.values.forEach(function(value) {
              counts.push(value.count);
            });
          });
          sortedCounts = counts.sort();
          minCount = sortedCounts[0];
          maxCount = sortedCounts[sortedCounts.length - 1];

          counts = [0, 50, 100, 150, 200];

          nv.addGraph(function() {
            graph = nv.models.lineChart().useInteractiveGuideline(true);

            graph.x(function(d) {
              return d.year;
            });

            graph.y(function(d) {
              return d.count;
            });

            graph.xAxis.axisLabel('Year');
            graph.yAxis.axisLabel('Incident Count');

            graph.forceX([years[0], years[years.length - 1]]);
            graph.xAxis.tickValues(years);

            graph.forceY([0, 200]);
            graph.yAxis.tickValues([0, 50, 100, 150, 200]);

            d3.select('.incidents-per-year-chart svg')
              .datum(data)
              .call(graph);

            nv.utils.windowResize(graph.update);

            return graph;
          });
        }
        // Rebuild the chart anytime the data changes
        scope.$watch(function() {
          return scope.data;
        }, function(data) {
          buildGraph(data);
        });
      }
    };
  }
  mp.directive('incidentsPerYear', incidentsPerYear);
})();
