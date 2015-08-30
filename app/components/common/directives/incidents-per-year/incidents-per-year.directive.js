/**
 * incidents-per-year directive
 *
 */
(function() {
  'use strict';

  mp.directive('incidentsPerYear', incidentsPerYear);

  function incidentsPerYear() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/incidents-per-year/incidents-per-year.template.html',
      scope: {
        data: '=data',
        beginDate: '=beginDate',
        endDate: '=endDate',
        countries: '=countries'
      },
      link: function(scope, element, attributes) {

        // Rebuild the chart anytime the data changes
        scope.$watch(function watchData() {
          return scope.data;
        }, function newData(data) {
          var formattedData = formatData(data);
          buildGraph(formattedData);
        });

        function formatData(data) {
          var dataMap = {},
            dataArray = [],
            dataArraySorted = [];

          // Data is received in the format:
          // [{count:25, year:2012, country: "Malaysia"},
          // {count: 35, year:2013, country: "Malaysia"}, ...]

          // First pass: convert the data to the format:
          // {"Malaysia": { key: "Malaysia", values: [{year:2012, count: 25},{year:2013, count: 35}, ...]}, ...}
          data.forEach(function formatDataFirstPass(entry) {
            if (!dataMap.hasOwnProperty(entry.country)) {
              dataMap[entry.country] = {
                key: entry.country,
                values: []
              };
            }
            dataMap[entry.country].values.push({
              year: entry.year,
              count: Number(entry.count)
            });
          });

          // Second pass: convert the data to the format:
          // [{ key: "Malaysia", values: [{year:2012, count: 25},{year:2013, count: 35}]}]
          Object.keys(dataMap).forEach(function formatDataSecondPass(key) {
            dataArray.push(dataMap[key]);
          });

          // Sort the data according to the total count per country
          dataArraySorted = dataArray.sort(function dataArraySorting(countryA, countryB) {
            var countryATotal = 0, countryBTotal = 0;
            countryA.values.forEach(function(value) {
              countryATotal += value.count;
            });
            countryB.values.forEach(function(value) {
              countryBTotal += value.count;
            });
            if (countryATotal < countryBTotal) return 1;
            else if (countryATotal > countryBTotal) return -1;
            else return 0;
          });

          return dataArraySorted;
        }

        function buildGraph(data) {

          var graph, years = [], sortedCounts, maxCount = 0;

          // Build an array of years to define the x-axis
          for (var yr = scope.beginDate.getFullYear(); yr <= scope.endDate.getFullYear(); yr++) {
            years.push(yr);
          }

          // Find the max count to define the y-axis
          data.forEach(function findMaxCount(entry) {
            entry.values.forEach(function(value) {
              if(maxCount === 0 || value.count > maxCount) {
                maxCount = value.count;
              }
            });
          });

          // Build/rebuild the graph using the nv-d3 library
          nv.addGraph(function addNVD3Graph() {
            graph = nv.models.lineChart().useInteractiveGuideline(true);

            // Define the properties for x and y axes to use as values
            graph.x(function(d) {
              return d.year;
            });
            graph.y(function(d) {
              return d.count;
            });

            // Name and define ticks for x and y axes
            // x-axis uses years, y-axis uses count
            graph.xAxis.axisLabel('Year');
            graph.forceX([years[0], years[years.length - 1]]);
            graph.xAxis.tickValues(years);

            graph.yAxis.axisLabel('Incident Count');
            graph.forceY([0, maxCount]);

            // If no countries were specified, only the first five should be shown
            if(scope.countries.length === 0) {
              data = data.splice(0,5);
            }

            // Select the element to which the data will be added and add it
            d3.select('.incidents-per-year-graph > svg')
              .datum(data)
              .call(graph);

            return graph;
          });
        }
      }
    };
  }
})();
