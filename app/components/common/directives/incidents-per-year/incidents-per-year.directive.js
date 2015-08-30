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
        endDate: '=endDate',
        countries: '=countries'
      },
      link: function(scope, element, attributes) {

        function formatData(data) {
          var dataMap = {},
            dataArray = [],
            dataArraySorted = [];

          // Data is received in the format
          // [{count:25, year:2012, country: "Malaysia"},
          // {count: 35, year:2013, country: "Malaysia"}]

          // Convert the data to the format
          // {"Malaysia": { key: "Malaysia", values: [{year:2012, count: 25},{year:2013, count: 35}]}}
          data.forEach(function(entry) {
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

          // Convert the data to the format
          // [{ key: "Malaysia", values: [{year:2012, count: 25},{year:2013, count: 35}]}]
          Object.keys(dataMap).forEach(function(key) {
            dataArray.push(dataMap[key]);
          });

          // Sort the data according to the aggregate count per country
          dataArraySorted = dataArray.sort(function(countryA, countryB) {
            var countryATotal = 0,
              countryBTotal = 0;
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

          return dataArray;
        }

        function buildGraph(data) {

          var graph, years = [],
            counts = [],
            sortedCounts,
            minCount, maxCount;

          // Build an array of years to define the x-axis
          for (var yr = scope.beginDate.getFullYear(); yr <= scope.endDate.getFullYear(); yr++) {
            years.push(yr);
          }

          // Find the min and max counts to define the y-axis
          minCount = 0;
          maxCount = 0;
          data.forEach(function(entry) {
            entry.values.forEach(function(value) {
              if(minCount === 0 || value.count < minCount) {
                minCount = value.count;
              }
              if(maxCount === 0 || value.count > maxCount) {
                console.log('new max', value.count);
                maxCount = value.count;
              }
            });
          });
          console.log(minCount, maxCount);

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

            graph.forceY([minCount, maxCount]);
            // graph.yAxis.tickValues([0, 50, 100, 150, 200]);

            if(scope.countries.length === 0) {
              data = data.splice(0,5);
            }

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
          data = formatData(data);
          buildGraph(data);
        });
      }
    };
  }
  mp.directive('incidentsPerYear', incidentsPerYear);
})();
