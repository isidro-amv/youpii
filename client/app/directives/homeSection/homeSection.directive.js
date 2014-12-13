'use strict';

angular.module('youpiiBApp')
  .directive('homeSection', function () {
    return {
      templateUrl: 'app/directives/homeSection/homeSection.html',
      restrict: 'EA',
      link: function (/*scope, element, attrs*/) {
      }
    };
  });