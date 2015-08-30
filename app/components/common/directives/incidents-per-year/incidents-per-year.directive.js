(function() {
  'use strict';

  function incidentsPerYear() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/common/directives/incidents-per-year/incidents-per-year.template.html',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attributes) {

        function data() {
          var sin = [],
            cos = [];
          for (var i = 0; i < 100; i++) {
            sin.push({
              x: i,
              y: Math.sin(i / 10)
            });
            cos.push({
              x: i,
              y: .5 * Math.cos(i / 10)
            });
          }
          return [{
            values: sin,
            key: 'Sine Wave'
          }, {
            values: cos,
            key: 'Cosine Wave'
          }];
        }

        scope.$watch(function() {
          return scope.data;
        }, function(newValue) {
          nv.addGraph(function() {
            var chart = nv.models.lineChart()
              .useInteractiveGuideline(true);
            chart.xAxis
              .axisLabel('Time (ms)')
              //.tickFormat(d3.format(',r'))
            ;
            chart.yAxis
              .axisLabel('Voltage (v)')
              //.tickFormat(d3.format('.02f'))
            ;
            d3.select('#chart svg')
              .datum(data())
              .transition().duration(500)
              .call(chart);
            nv.utils.windowResize(chart.update);
            return chart;
          });
        });
        
      }
    };
  }
  mp.directive('incidentsPerYear', incidentsPerYear);
})();
