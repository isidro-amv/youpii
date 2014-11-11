'use strict';

angular.module('youpiiBApp')
  .directive('promoSection', function () {
    return {
      templateUrl: 'app/directives/blockSection/blockSection.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });