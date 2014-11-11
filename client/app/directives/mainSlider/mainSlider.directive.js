'use strict';

angular.module('youpiiBApp')
  .directive('mainSlider', function () {
    return {
      templateUrl: 'app/directives/mainSlider/mainSlider.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });